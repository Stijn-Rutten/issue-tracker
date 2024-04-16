"use client";
import { Skeleton } from "@/app/components";
import useUsers from "@/app/issues/hooks/useUsers";
import { Issue } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers();

  const [assignedUserId, setAssignedUserId] = useState(issue.assignedToUserId);
  const [latestAssignedUserId, setLatestAssignedUserId] = useState(
    issue.assignedToUserId
  );

  useEffect(() => {
    if (assignedUserId === null || assignedUserId === latestAssignedUserId) {
      setLatestAssignedUserId(assignedUserId);
      return;
    }

    axios
      .patch(`/api/issues/${issue.id}`, {
        assignedToUserId:
          assignedUserId !== "unassigned" ? assignedUserId : null,
      })
      .then(() => {
        setLatestAssignedUserId(assignedUserId);
        if (assignedUserId === "unassigned") setAssignedUserId(null);
      })
      .catch(() => {
        toast.error("Changes could not be saved");
        setAssignedUserId(latestAssignedUserId);
      });
  }, [assignedUserId, latestAssignedUserId, issue]);

  if (isLoading) return <Skeleton height="2rem" />;

  if (error) return null;

  return (
    <>
      <Select.Root
        value={latestAssignedUserId || ""}
        defaultValue={issue.assignedToUserId || ""}
        onValueChange={setAssignedUserId}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="unassigned">Unassign</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster></Toaster>
    </>
  );
};

export default AssigneeSelect;
