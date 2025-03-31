import { PostList } from "../components/PostList";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user } = useAuth(); // Obtenemos el estado de autenticación
  
  return (
    <div className="pt-10 relative">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
        Explore
      </h2>
      <div>
        <PostList />
      </div>
      
      {/* Botón flotante para crear nuevo post - visible siempre */}
      <Link 
        to="/create" 
        className="fixed z-10 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 lg:bottom-10 lg:right-10 md:bottom-8 md:right-8 bottom-6 right-6 sm:right-8"
        aria-label="Crear nuevo post"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </div>
  );
};

