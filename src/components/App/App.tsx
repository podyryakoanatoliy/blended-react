// import Modal from "../Modal/Modal";
import { useState } from "react";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
// import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 300);
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
  console.log(data);
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={changeSearchQuery} value={query} />
        {/* <Pagination /> */}
        <button className={css.button}>Create post</button>
      </header>
      {/* <Modal>Передати через children компонент CreatePostForm або EditPostForm</Modal> */}
      <PostList />
    </div>
  );
}
