// import Modal from "../Modal/Modal";
import { useState } from "react";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";

import CreatePostForm from "../CreatePostForm/CreatePostForm";

import css from "./App.module.css";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
import Modal from "../Modal/Modal";
import { Post } from "../../types/post";
import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);

  const toggleCreatePost = () => setIsCreatePost(!isCreatePost);

  const toggleModal = () => setIsModal(!isModal);

  const changeSearchQuery = (newQuery: string) => {
    setPage(1);
    setQuery(newQuery);
    console.log(newQuery);
  };
  const { data } = useQuery({
    queryKey: ["posts", debouncedQuery, page],
    queryFn: () => fetchPosts(debouncedQuery, page),
    placeholderData: keepPreviousData,
  });
  const posts = data?.posts ?? [];

  const totalPages = data?.totalCount ? Math.ceil(data?.totalCount / 8) : 0;

  const toggleEditedPost = (postToEdit?: Post) => {
    if (postToEdit) {
      setEditedPost(postToEdit);
    }
    setIsEditPost(!isEditPost);
    console.log(postToEdit);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={changeSearchQuery} value={query} />
        <Pagination totalPages={totalPages} currentPage={page} onPageChange={setPage} />
        <button
          className={css.button}
          onClick={() => {
            toggleModal();
            toggleCreatePost();
          }}
        >
          Create post
        </button>
      </header>
      {posts.length > 0 && (
        <PostList onChekedPost={toggleEditedPost} posts={posts} modalOpen={toggleModal} />
      )}
      {isModal && (
        <Modal
          onClose={() => {
            toggleModal();
            toggleCreatePost();
          }}
        >
          {isEditPost && editedPost && (
            <EditPostForm
              initialValues={editedPost}
              onClose={() => {
                toggleModal();
                toggleEditedPost();
                setEditedPost(null);
              }}
            />
          )}{" "}
          {isCreatePost && (
            <CreatePostForm
              onClose={() => {
                toggleModal();
                toggleCreatePost();
              }}
            />
          )}{" "}
        </Modal>
      )}
    </div>
  );
}
