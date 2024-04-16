import { Skeleton } from '@/app/components';
import { Card, Flex } from '@radix-ui/themes';

const LoadingIssueDetailsPage = () => {
  return (
    <div className='max-w-xl'>
      <Skeleton />
      <Flex className='space-x-3' my='2'>
        <Skeleton width='5rem' />
        <Skeleton width='8rem' />
      </Flex>
      <Card mt='4'>
        <Skeleton count={3} />
      </Card>
    </div>
  );
};

export default LoadingIssueDetailsPage;
