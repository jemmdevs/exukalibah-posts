import { ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { Community, fetchCommunities } from "./CommunityList";
import { useNavigate } from "react-router-dom";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
}

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...post, image_url: publicURLData.publicUrl });

  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityId, setCommunityId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Estados para manejar errores de validación
  const [errors, setErrors] = useState<{
    title: boolean;
    content: boolean;
    image: boolean;
  }>({
    title: false,
    content: false,
    image: false,
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) => {
      return createPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      // Redireccionar a la página Home después de crear el post exitosamente
      navigate('/');
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validar campos requeridos
    const newErrors = {
      title: title.trim() === "",
      content: content.trim() === "",
      image: !selectedFile
    };
    
    setErrors(newErrors);
    
    // Si hay algún error, no enviar el formulario
    if (newErrors.title || newErrors.content || newErrors.image) {
      return;
    }
    
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile as File,
    });
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-[#15202b] border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Crear nuevo post</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comparte tus ideas con la comunidad</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Título */}
        <div className="group">
          <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Título
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Escribe un título atractivo"
              className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border ${errors.title ? 'border-red-400' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-colors duration-200`}
              required
            />
            {!errors.title && title && (
              <span className="absolute right-3 top-2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          {errors.title && <p className="text-red-400 text-xs mt-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>El título es obligatorio</p>}
        </div>
        
        {/* Contenido */}
        <div className="group">
          <label htmlFor="content" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Contenido
          </label>
          <div className="relative">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe tu post con detalle"
              className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border ${errors.content ? 'border-red-400' : 'border-gray-300 dark:border-gray-700'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-colors duration-200`}
              rows={4}
              required
            />
            {!errors.content && content && (
              <span className="absolute right-3 top-2 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          {errors.content && <p className="text-red-400 text-xs mt-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>El contenido es obligatorio</p>}
        </div>

        {/* Comunidad */}
        <div className="group">
          <label htmlFor="community" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Comunidad
          </label>
          <div className="relative">
            <select 
              id="community" 
              onChange={handleCommunityChange}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-colors duration-200 appearance-none"
            >
              <option value={""}> -- Selecciona una comunidad -- </option>
              {communities?.map((community, key) => (
                <option key={key} value={community.id}>
                  {community.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Imagen */}
        <div className="group">
          <label htmlFor="image" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Imagen
          </label>
          <div className={`border border-dashed ${errors.image ? 'border-red-400' : 'border-gray-300 dark:border-gray-700'} rounded-md p-4 text-center transition-all duration-200 hover:border-blue-400 cursor-pointer bg-gray-50 dark:bg-gray-800`}>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="image" className="cursor-pointer flex flex-col items-center justify-center">
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="w-full max-w-xs mx-auto overflow-hidden rounded-md">
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Preview" 
                      className="object-contain max-h-48 w-full"
                    />
                  </div>
                  <p className="text-sm text-blue-500 dark:text-blue-400">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Haz clic para cambiar la imagen</p>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">Arrastra una imagen o haz clic para seleccionar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF hasta 10MB</p>
                </div>
              )}
            </label>
          </div>
          {errors.image && <p className="text-red-400 text-xs mt-1 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>La imagen es obligatoria</p>}
        </div>
        
        {/* Botón de envío */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando post...
              </span>
            ) : "Crear Post"}
          </button>
        </div>

        {isError && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Error al crear el post. Debes iniciar sesión primero.
          </div>
        )}
      </form>
    </div>
  );
};