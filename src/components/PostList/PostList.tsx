import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "../../types/post";
import css from "./PostList.module.css";
import { deletePost } from "../../services/postService";

interface PostListProps {
  onChekedPost: (post: Post) => void;
  posts: Post[];
  modalOpen: () => void;
}

export default function PostList({ onChekedPost, posts, modalOpen }: PostListProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Post deleted");
    },
  });
  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button
              className={css.edit}
              onClick={() => {
                onChekedPost(post);
                modalOpen();
              }}
            >
              Edit
            </button>
            <button className={css.delete} onClick={() => mutation.mutate(post.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
