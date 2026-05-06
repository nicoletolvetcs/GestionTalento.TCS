import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null;
    if (!user) {
        return <div className="p-10 text-center">Inicia sesión primero.</div>;
    }
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return (
            <div className="p-10 text-center text-red-500">
                <h2>Acceso Denegado</h2>
                <p>Tu rol ({user.rol}) no tiene permisos para ver esta sección.</p>
            </div>
        );
    }
    return children;
};
export default ProtectedRoute;
