import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {

        try {
            const response = await api.post('login/', { username, password });
            const { access, nombre_completo, rol } = response.data;
            const userData = { username, nombre_completo, rol };
            localStorage.setItem('access_token', access);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true, message: "Login exitoso" };
        }
        catch (error) {
            console.error("Error al iniciar sesión:", error);
            return { success: false, message: "Credenciales inválidas" };
        }
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};