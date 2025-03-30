import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";
import { linkifyText } from "../utils/textUtils";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({queryKey: ["post", postId],queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return <div> Loading posts...</div>;
  }

  if (error) {
    return <div> Error: {error.message}</div>;
  }

  console.log(data); // Log the data to the console for inspectio

  return (
    <div className="space-y-6">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent"> {data?.title} </h2>
      <div className="w-full max-h-[600px] overflow-hidden rounded shadow-lg">
        <img src={data?.image_url} alt={data?.title} className="w-full object-contain max-h-[600px] bg-gray-100 dark:bg-gray-900" />
      </div>
      <p className="text-gray-400">{linkifyText(data?.content || '')}</p>
      <p className="text-gray-500 text-sm">Posted on: {new Date(data!.created_at).toLocaleDateString()}</p>

      <LikeButton postId={postId}/>
      <CommentSection postId={postId}/>

    </div>
  );
};
