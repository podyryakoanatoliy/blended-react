import axios from "axios";
import { Post } from "../types/post";
axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";
type FetchPostsResponse = Post[];

interface NewPost {
  title: string;
  body: string;
}

interface EditerPost {
  id: number;
  title: string;
  body: string;
}

export const fetchPosts = async (
  searchText: string,
  page: number
): Promise<{ posts: Post[]; totalCount: number }> => {
  const response = await axios.get<FetchPostsResponse>(`/posts`, {
    params: { ...(searchText !== "" && { q: searchText }), _page: page, _limit: 8 },
  });
  const totalCount = Number(response.headers["x-total-count"]);
  return { posts: response.data, totalCount };
};

export const createPost = async (newPost: NewPost) => {
  const { data } = await axios.post<Post>(`/posts`, newPost);
  return data;
};

export const editPost = async (newDataPost: EditerPost) => {
  const { data } = await axios.patch<Post>(`/posts/${newDataPost.id}`, newDataPost);
  return data;
};

export const deletePost = async (postId: number) => {
  const { data } = await axios.delete<Post>(`/posts/${postId}`);
  return data;
};
