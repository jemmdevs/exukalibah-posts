import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";
import {supabase} from "../supabase-client";
import { useEffect } from "react";

interface AuthContextType{
    user: User | null;
    signInWithGitHub: () => void;
    signInWithGoogle: () => void;
    signOut: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setUser(session?.user ?? null);
        });

        const {data: listener} = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        })

        return () => {
            listener?.subscription.unsubscribe();
        }
    }, [])


    const signInWithGitHub = () => {
        supabase.auth.signInWithOAuth({provider: "github"})
    }

    const signInWithGoogle = () => {
        // NOTA: Debes configurar el proveedor de Google en el dashboard de Supabase:
        // 1. Ve a Authentication > Providers > Google
        // 2. Habilita el proveedor
        // 3. Configura Client ID y Client Secret desde Google Cloud Console
        // 4. Configura la URL de redirección en Google Cloud Console
        supabase.auth.signInWithOAuth({provider: "google"})
    }

    const signOut = () => {
        supabase.auth.signOut();
    }

    return (

    <AuthContext.Provider value={{user, signInWithGitHub, signInWithGoogle, signOut}}>
    {" "}
    {children}{" "}
    </AuthContext.Provider>

);
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}