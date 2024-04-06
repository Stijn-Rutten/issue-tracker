"use client";
import { Skeleton } from "@/app/components";
import useUsers from "@/app/hooks/useUsers";
import { Select } from "@radix-ui/themes";

const AssigneeSelect = () => {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) return <Skeleton height="2rem" />;

  if (error) return null;

  return (
    <Select.Root>
      <Select.Trigger placeholder="Asign..." />
      <Select.Content>
        <Select.Group>
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
