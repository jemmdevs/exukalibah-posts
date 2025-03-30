import { createElement } from 'react';

/**
 * Convierte URLs en texto plano a enlaces clicables
 * @param text El texto que puede contener URLs
 * @returns Un array de elementos React (texto y enlaces)
 */
export const linkifyText = (text: string) => {
  if (!text) return '';
  
  // Expresión regular para detectar URLs
  // Detecta URLs que comienzan con http://, https://, www. o simplemente dominios con extensiones comunes
  const urlRegex = /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  
  // Si no hay URLs, devolver el texto original
  if (!text.match(urlRegex)) {
    return text;
  }
  
  // Dividir el texto en partes (texto normal y URLs)
  const parts = [];
  let lastIndex = 0;
  let match;
  
  // Encontrar todas las coincidencias de URLs
  while ((match = urlRegex.exec(text)) !== null) {
    // Añadir el texto antes de la URL
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Obtener la URL completa
    const url = match[0];
    
    // Asegurarse de que la URL tenga el protocolo correcto para el enlace
    const href = url.startsWith('www.') ? `https://${url}` : url;
    
    // Añadir el enlace como elemento React usando createElement
    parts.push(
      createElement(
        'a',
        {
          key: match.index,
          href: href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-blue-500 hover:underline",
          onClick: (e) => e.stopPropagation()
        },
        url
      )
    );
    
    // Actualizar el último índice procesado
    lastIndex = match.index + url.length;
  }
  
  // Añadir el texto restante después de la última URL
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts;
};