import { Prisma } from '@prisma/client';
import { Avatar, Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import dynamic from 'next/dynamic';
import React from 'react';
import CommentFormSkeleton from './CommentFormSkeleton';
import ReactMarkdown from 'react-markdown';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';

const CommentForm = dynamic(
  () => import('@/app/issues/[id]/_components/CommentForm'),
  {
    ssr: false,
    loading: () => <CommentFormSkeleton />,
  }
);

type IssueWithCommentsAndAuthor = Prisma.IssueGetPayload<{
  include: { comments: { include: { author: true } } };
}>;

interface Props {
  issue: IssueWithCommentsAndAuthor;
}

const Comments = async ({ issue }: Props) => {
  const session = await getServerSession(authOptions);
  return (
    <Flex direction='column' gap='3' width='100%'>
      <ul>
        {issue.comments.map((comment) => (
          <li key={comment.id}>
            <Card size='1'>
              <Flex gap='4' align='center'>
                <Avatar
                  size='2'
                  radius='full'
                  src={comment.author.image ?? ''}
                  fallback='?'
                  color='indigo'
                />
                <Box width='100%'>
                  <Flex justify='between'>
                    <Text as='div' size='2' weight='bold'>
                      {comment.author.name}
                    </Text>
                    <Text as='div' size='2' color='gray'>
                      {comment.createdAt.toDateString()}
                    </Text>
                  </Flex>
                  <Text as='div' size='2' color='gray'>
                    <ReactMarkdown className='prose max-w-full'>
                      {comment.content}
                    </ReactMarkdown>
                  </Text>
                </Box>
              </Flex>
            </Card>
          </li>
        ))}
      </ul>
      {session && <CommentForm id={issue.id} />}
    </Flex>
  );
};

export default Comments;
