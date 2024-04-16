import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import EditIssueButton from './_components/EditIssueButton';
import IssueDetails from './_components/IssueDetails';
import DeleteIssueButton from './_components/DeleteIssueButton';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import AssigneeSelect from './_components/AssigneeSelect';
import { cache } from 'react';
import Comments from './_components/Comments';
import PostComment from './_components/CommentForm';

interface Props {
  params: { id: string };
}

const fetchIssues = cache((id: number) =>
  prisma.issue.findUnique({
    where: { id },
    include: {
      comments: {
        include: { author: true },
      },
    },
  })
);

const IssueDetailsPage = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  const issue = await fetchIssues(+id);

  if (!issue) notFound();

  return (
    <>
      <Grid
        columns={{
          initial: '1',
          sm: '5',
        }}
        gap='5'
        mb='5'
      >
        <Flex direction='column' gap='5' className='md:col-span-4'>
          <IssueDetails issue={issue} />
          <hr />
          <Comments issue={issue} />
        </Flex>
        {session && (
          <Flex direction='column' gap='4'>
            <AssigneeSelect issue={issue} />
            <EditIssueButton id={issue.id} />
            <DeleteIssueButton id={issue.id} />
          </Flex>
        )}
      </Grid>
    </>
  );
};

export default IssueDetailsPage;

export const generateMetadata = async ({ params: { id } }: Props) => {
  const issue = await fetchIssues(+id);

  return {
    title: issue?.title,
    description: 'Details of issue ' + issue?.id,
  };
};
