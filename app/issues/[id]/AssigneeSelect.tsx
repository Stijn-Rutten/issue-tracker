"use client";
import { Skeleton } from "@/app/components";
import useUsers from "@/app/hooks/useUsers";
import { Issue } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers();
  const [assignedUserId, setAssignedUserId] = useState(issue.assignedToUserId);

  useEffect(() => {
    if (assignedUserId === null) return;

    axios.patch(`/api/issues/${issue.id}`, {
      assignedToUserId: assignedUserId !== "unassigned" ? assignedUserId : null,
    });
    if (assignedUserId === "unassigned") setAssignedUserId(null);
  }, [assignedUserId, issue]);

  if (isLoading) return <Skeleton height="2rem" />;

  if (error) return null;

  return (
    <Select.Root
      value={assignedUserId ?? ""}
      defaultValue={issue.assignedToUserId ? issue.assignedToUserId : ""}
      onValueChange={setAssignedUserId}
    >
      <Select.Trigger placeholder="Asign..." />
      <Select.Content>
        <Select.Group>
          <Select.Item value="unassigned">Unassign</Select.Item>
          <Select.Label>Suggestions</Select.Label>
          {users?.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default AssigneeSelect;
