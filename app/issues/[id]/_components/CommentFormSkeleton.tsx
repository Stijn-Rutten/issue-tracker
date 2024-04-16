import { Skeleton } from "@/app/components";
import React from "react";

const CommentFormSkeleton = () => {
  return (
    <div className="max-w-xl">
      <Skeleton height="20rem" />
    </div>
  );
};

export default CommentFormSkeleton;
