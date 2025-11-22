import * as Yup from "yup";
import { Field, Form, Formik, FormikHelpers, ErrorMessage } from "formik";

import css from "./CreatePostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";

interface PostFormProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  body: string;
}
const initialValues: FormValues = {
  title: "",
  body: "",
};

export const postSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Min 3 character")
    .max(50, "Max 50 character")
    .required("This field required"),
  body: Yup.string().max(500, "Max 500 character").required("This field required"),
});

export default function PostForm({ onClose }: PostFormProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post created");
      onClose();
    },
  });

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    mutate(values);
    actions.resetForm();
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={postSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
