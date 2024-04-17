'use client';
import { Spinner } from '@/app/components';
import { $Enums as Enums, Issue } from '@prisma/client';
import { Button } from '@radix-ui/themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const buttons: {
  showOn: Enums.Status;
  label: string;
  newStatus: Enums.Status;
}[] = [
  { showOn: 'CLOSED', label: 'Reopen Issue', newStatus: 'OPEN' },
  { showOn: 'IN_PROGRESS', label: 'Close Issue', newStatus: 'CLOSED' },
  { showOn: 'OPEN', label: 'Start Progress', newStatus: 'IN_PROGRESS' },
];

const ChangeIssueStatusButtons = ({ issue }: { issue: Issue }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const changeStatus = (newStatus: Enums.Status) => {
    setIsLoading(true);
    const updatedIssue = { ...issue, status: newStatus };

    axios
      .patch(`/api/issues/${issue.id}`, updatedIssue)
      .then(() => {
        toast.success('Status updated');
        router.refresh();
      })
      .catch(() => {
        toast.error('Changes could not be saved');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {buttons.map(
        (button) =>
          issue.status === button.showOn && (
            <Button
              key={button.showOn}
              onClick={() => changeStatus(button.newStatus)}
              disabled={isLoading}
            >
              {button.label}
              {isLoading && <Spinner></Spinner>}
            </Button>
          )
      )}
      <Toaster></Toaster>
    </>
  );
};

export default ChangeIssueStatusButtons;
