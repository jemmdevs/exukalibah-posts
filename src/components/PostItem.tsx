import { Link } from "react-router-dom";
import { Post } from "./PostList";
import { linkifyText } from "../utils/textUtils";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <Link to={`/post/${post.id}`} className="block w-full sm:w-80 md:w-96 mb-2 mx-auto">
      <div className="h-full bg-white dark:bg-[#15202b] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#192734] shadow-sm hover:shadow-md">
        {/* Header: Avatar and Title */}
        <div className="flex items-center p-3">
          {post.avatar_url ? (
            <img
              src={post.avatar_url}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          )}
          <div className="ml-3">
            <div className="font-bold text-gray-900 dark:text-white">
              {post.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Contenido resumido */}
        <div className="px-3 pb-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2 h-12 overflow-hidden">
          {linkifyText(post.content)}
        </div>
        
        {/* Image - Con altura fija y object-contain para mantener proporciones completas */}
        {post.image_url && (
          <div className="relative">
            <div className="w-full h-52 overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <img
                src={post.image_url}
                alt={post.title}
                className="max-w-full max-h-52 object-contain"
              />
            </div>
          </div>
        )}
        
        {/* Footer con estadísticas */}
        <div className="flex px-3 py-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center mr-6 text-gray-500 dark:text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>{post.like_count ?? 0}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <span>{post.comment_count ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};