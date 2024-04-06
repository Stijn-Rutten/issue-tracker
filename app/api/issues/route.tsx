import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createIssueSchema = z.object({
  title: z.string().max(255),
  description: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = await createIssueSchema.safeParseAsync(body);

  if (!validation.success) {
    return new Response(JSON.stringify(validation.error.errors), {
      status: 400,
    });
  }

  const issue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(issue, {
    status: 201,
  });
}
