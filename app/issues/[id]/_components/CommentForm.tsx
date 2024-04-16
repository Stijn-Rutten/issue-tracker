'use client';
import { ErrorMessage } from '@/app/components';
import { commentSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue } from '@prisma/client';
import { Button, Callout, Spinner } from '@radix-ui/themes';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SimpleMDE from 'react-simplemde-editor';
import { z } from 'zod';

type CommentFormData = z.infer<typeof commentSchema>;

const CommentForm = ({ id }: { id: number }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitted, isValid, errors },
  } = useForm<CommentFormData>({ resolver: zodResolver(commentSchema) });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const submitComment = async (data: CommentFormData) => {
    try {
      setIsSubmitting(true);
      await axios.post(`/api/issues/${id}/comments`, {
        ...data,
      });
    } catch {
      setError('An error occured');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <Callout.Root color='red' className='mb-5'>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form onSubmit={handleSubmit(submitComment)}>
        <Controller
          name='content'
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="What's on your mind?" {...field} />
          )}
        ></Controller>
        <ErrorMessage> {errors.content?.message} </ErrorMessage>
        <Button disabled={(isSubmitted && !isValid) || isSubmitting}>
          Post Comment
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </>
  );
};

export default CommentForm;
