import { createContext, useContext, useEffect, useState } from 'react';
import { iniciarSesion, obtenerPerfil } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            setLoading(false);
            return;
        }

        obtenerPerfil()
            .then((respuestaPerfil) => setUser(respuestaPerfil.data))
            .catch(logout)
            .finally(() => setLoading(false));
    }, []);

    const login = async (correo, contrasena) => {
        const respuesta = await iniciarSesion(correo, contrasena);
        const token = respuesta.usuario.token;

        localStorage.setItem('token', token);

        const respuestaPerfil = await obtenerPerfil();
        setUser(respuestaPerfil.data);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}