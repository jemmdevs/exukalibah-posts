import { CommunityList } from "../components/CommunityList";
import { Link } from "react-router-dom";

export const CommunitiesPage = () => {

  
  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative mb-12 pb-6 border-b border-white/5">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center sm:text-left bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
              Communities
            </h2>
            <p className="mt-3 text-gray-400 max-w-2xl text-center sm:text-left">Explora y únete a comunidades donde puedes compartir ideas y conectar con personas de intereses similares.</p>
          </div>
          
          <Link 
            to="/community/create"
            className="mt-6 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nueva Comunidad
          </Link>
        </div>
      </div>
      
      <CommunityList />
    </div>
  );
};