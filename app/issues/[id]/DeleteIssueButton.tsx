"use client";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";

const DeleteIssueButton = ({ id }: { id: number }) => {
  const router = useRouter();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Delete Issue</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
        <AlertDialog.Description>
          You are about to delete this issue. Are you sure you want to do this?
          This action cannot be undone.
        </AlertDialog.Description>
        <Flex mt="4" gap="3" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              color="red"
              onClick={async () => {
                await axios.delete(`/api/issues/${id}`);
                router.push("/issues");
                router.refresh();
              }}
            >
              Delete Issue
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteIssueButton;
