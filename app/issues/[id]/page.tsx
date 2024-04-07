import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import DeleteIssueButton from "./DeleteIssueButton";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "./AssigneeSelect";
import { cache } from "react";

interface Props {
  params: { id: string };
}

const fetchUser = cache((id: number) =>
  prisma.issue.findUnique({ where: { id } })
);

const IssueDetailsPage = async ({ params: { id } }: Props) => {
  const session = await getServerSession(authOptions);
  const issue = await fetchUser(+id);

  if (!issue) notFound();

  return (
    <Grid
      columns={{
        initial: "1",
        sm: "5",
      }}
      gap="5"
    >
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Flex direction="column" gap="4">
          <AssigneeSelect issue={issue} />
          <EditIssueButton id={issue.id} />
          <DeleteIssueButton id={issue.id} />
        </Flex>
      )}
    </Grid>
  );
};

export default IssueDetailsPage;

export const generateMetadata = async ({ params: { id } }: Props) => {
  const issue = await fetchUser(+id);

  return {
    title: issue?.title,
    description: "Details of issue " + issue?.id,
  };
};
