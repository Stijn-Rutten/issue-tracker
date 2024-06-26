import { IssueStatusBadge } from '@/app/components';
import { Issue } from '@prisma/client';
import { Heading, Flex, Card, Text } from '@radix-ui/themes';
import React from 'react';
import ReactMarkdown from 'react-markdown';

const IssueDetails = ({ issue }: { issue: Issue }) => {
  return (
    <>
      <Flex justify='between'>
        <Heading>{issue.title}</Heading>
        <Flex className='space-x-3'>
          <IssueStatusBadge status={issue.status} />
          <Text color='gray'>{issue.createdAt.toDateString()}</Text>
        </Flex>
      </Flex>
      <Card mt='4'>
        <ReactMarkdown className='prose max-w-full'>
          {issue.description}
        </ReactMarkdown>
      </Card>
    </>
  );
};

export default IssueDetails;
