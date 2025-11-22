import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";

import css from "./EditPostForm.module.css";
import { Post } from "../../types/post";

import { postSchema } from "../CreatePostForm/CreatePostForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";

interface EditPostFormProps {
  initialValues: Post;
  onClose: () => void;
}

interface FormValues {
  title: string;
  body: string;
  id: number;
}

export default function EditPostForm({ initialValues, onClose }: EditPostFormProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      alert("Post edited");
      onClose();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  const handleEditPost = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    mutate(values);
    actions.resetForm();
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleEditPost} validationSchema={postSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
