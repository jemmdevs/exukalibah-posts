import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  // Obtener posts de la tabla posts
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (postsError) throw new Error(postsError.message);

  // Para cada post, obtener conteo de likes y comentarios
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      // Contar likes (votos positivos)
      const { data: likes, error: likesError } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", post.id)
        .eq("vote", 1);

      if (likesError) throw new Error(likesError.message);

      // Contar comentarios
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", post.id);

      if (commentsError) throw new Error(commentsError.message);

      return {
        ...post,
        like_count: likes.length,
        comment_count: comments.length,
      };
    })
  );

  return postsWithCounts as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  console.log(data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-40 max-w-6xl mx-auto px-6 py-4">
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
};