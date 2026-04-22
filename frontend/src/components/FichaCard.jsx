import React from 'react';
import { FaCheckSquare, FaRegSquare, FaStar, FaRegStar } from 'react-icons/fa';


// Estos son los componentes reuilizables que utilizamos en @TalentCard.jsx

// Bloque de sección con título y línea inferior
export const Section = ({ title, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
            <h2 style={{ color: '#1F2937', fontSize: '18px', fontWeight: '700', margin: 0 }}>
                {title}
            </h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            {children}
        </div>
    </div>
);

// Par Etiqueta : Valor
export const DataField = ({ label, value, customContent, fullWidth }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: fullWidth ? '1 1 100%' : '1 1 200px',
        gap: '4px'
    }}>
        <span style={{ color: '#6B7280', fontSize: '14px' }}>{label}</span>
        {customContent ? (
            customContent
        ) : (
            <span style={{ color: '#1F2937', fontSize: '16px', fontWeight: '500' }}>{value}</span>
        )}
    </div>
);

// Tag / Badge de especialidades
export const Badge = ({ text }) => (
    <span style={{
        background: 'rgba(26, 115, 232, 0.10)',
        color: '#1A73E8',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '14px',
        fontWeight: '500',
        border: '1px solid rgba(26, 115, 232, 0.20)'
    }}>
        {text}
    </span>
);

// Caja gris de texto (Notas, Observaciones)
export const GrayBox = ({ children }) => (
    <div style={{
        background: '#F5F7FA',
        padding: '16px',
        borderRadius: '4px',
        border: '1px solid #E5E7EB',
        color: '#1F2937',
        fontSize: '15px',
        lineHeight: '1.6'
    }}>
        {children}
    </div>
);

// Estrellas de puntuación
export const StarRating = ({ label, score }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ color: '#6B7280', fontSize: '14px' }}>{label}</span>
        <div style={{ display: 'flex', gap: '4px', color: '#F59E0B', fontSize: '18px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                star <= score
                    ? <FaStar key={star} />
                    : <FaRegStar key={star} style={{ color: '#D1D5DB' }} />
            ))}
        </div>
    </div>
);

// Ítem de documentación con checkbox
export const CheckItem = ({ label, checked }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1F2937', fontSize: '14px' }}>
        {checked
            ? <FaCheckSquare style={{ color: '#10B981', fontSize: '18px' }} />
            : <FaRegSquare style={{ color: '#9CA3AF', fontSize: '18px' }} />
        }
        <span>{label}</span>
    </div>
);
