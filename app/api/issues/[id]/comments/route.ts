import authOptions from "@/app/auth/authOptions";
import { commentSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = await commentSchema.safeParseAsync(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  console.log(session?.user?.email);
  const author = await prisma.user.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!author)
    return NextResponse.json({ error: "Invalid author." }, { status: 400 });

  const issue = await prisma.issue.findUnique({
    where: { id: +id },
  });

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  const comment = await prisma.comment.create({
    data: {
      content: body.content,
      author: { connect: { id: author.id } },
      issue: { connect: { id: issue.id } },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
