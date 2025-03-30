import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router-dom";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}
export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading)
    return (
      <div className="text-center py-12">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-400 border-r-transparent">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-4 text-blue-300 font-medium">Cargando comunidades...</p>
      </div>
    );
  if (error)
    return (
      <div className="text-center py-8 px-4 bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="mt-4 text-red-400 font-medium">Error: {error.message}</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto">
      {data?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((community) => (
            <div
              key={community.id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-white/10 shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              {/* Efecto de fondo */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Decoración */}
              <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-all duration-300"></div>
              <div className="absolute -left-4 -bottom-4 h-12 w-12 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-all duration-300"></div>
              
              <div className="relative p-6 flex flex-col h-full">
                <div className="flex-1">
                  <div className="mb-2 inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-medium">
                    Comunidad
                  </div>
                  <Link
                    to={`/community/${community.id}`}
                    className="text-xl sm:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200 block"
                  >
                    {community.name}
                  </Link>
                  <p className="text-gray-400 mt-3 text-sm sm:text-base line-clamp-3">{community.description}</p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(community.created_at).toLocaleDateString('es-ES', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Link
                      to={`/community/${community.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 group-hover:bg-blue-500 transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 group-hover:text-white transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
          <div className="inline-block p-6 rounded-full bg-blue-500/10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No hay comunidades disponibles</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Sé el primero en crear una comunidad y comienza a conectar con personas que comparten tus intereses.</p>
          <Link 
            to="/community/create"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Crear la primera comunidad
          </Link>
        </div>
      )}
    </div>
  );
};