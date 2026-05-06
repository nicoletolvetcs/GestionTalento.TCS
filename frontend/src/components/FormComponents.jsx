import React, { useState, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import ciudadesVE from '../ciudadesVE.json';


export const FormSelect = ({ label, value, onChange, options, width = "100%", defaultOption = "Seleccione...", disabled = false }) => (
    <div style={{ width, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500', fontFamily: 'Inter' }}>
            {label}
        </label>
        <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={{
                height: '42px',
                padding: '0 16px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '16px',
                fontFamily: 'Inter',
                outline: 'none',
                backgroundColor: disabled ? '#F3F4F6' : 'white',
                color: disabled ? '#6B7280' : 'inherit',
                cursor: disabled ? 'not-allowed' : 'pointer'
            }}
        >
            <option value="">{defaultOption}</option>
            {options?.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

export const FormInput = ({ label, placeholder, type = "text", value, onChange,
    width = "100%", disabled = false, readOnly = false,
    name, error }) => (
    <div style={{ width, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500', fontFamily: 'Inter' }}>
            {label}
        </label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            style={{
                height: '42px',
                padding: '0 16px',
                borderRadius: '8px',
                border: error ? '1px solid #EF4444' : '1px solid #E5E7EB',
                fontSize: '16px',
                fontFamily: 'Inter',
                outline: 'none',
                backgroundColor: disabled || readOnly ? '#F3F4F6' : 'white',
                color: disabled || readOnly ? '#6B7280' : 'inherit'
            }}
        />
        {error && (
            <span style={{ color: '#EF4444', fontSize: '12px', fontFamily: 'Inter' }}>
                {error}
            </span>
        )}
    </div>
);

export const FormSection = ({ title, children }) => (
    <div
        style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "32px",
        }}
    >
        <div style={{ borderBottom: "1px solid #E5E7EB", paddingBottom: "8px" }}>
            <h3
                style={{
                    color: "#1F2937",
                    fontSize: "18px",
                    fontWeight: "600",
                    fontFamily: "Inter",
                    margin: 0,
                }}
            >
                {title}
            </h3>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {children}
        </div>
    </div>
);

export const FileDropzone = ({ label, helperText, accept, maxFiles, files, onChange }) => (
    <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ color: '#1F2937', fontSize: '14px', fontWeight: '500' }}>{label}</span>
        <label style={{
            height: '132px',
            borderRadius: '8px',
            border: '2px dashed #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: '#FAFBFC'
        }}>
            <input
                type="file"
                multiple={maxFiles > 1}
                accept={accept}
                style={{ display: 'none' }}
                onChange={onChange}
            />
            {files && files.length > 0 ? (
                <div style={{ color: '#1A73E8', fontSize: '14px', fontWeight: 'bold' }}>
                    {files.length} archivo(s) seleccionado(s)
                </div>
            ) : (
                <>
                    <div style={{ color: '#6B7280', fontSize: '14px' }}>Arrastra o haz clic aquí</div>
                    <div style={{ color: '#9CA3AF', fontSize: '12px' }}>{helperText}</div>
                </>
            )}
        </label>
    </div>
);
