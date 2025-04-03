'use client'
import React from "react";

interface TextFieldProps {
    type?: string; 
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<TextFieldProps> = ({ type = "text", placeholder, name, value, onChange }) => {
    return (
        <input
            type={type}  
            name={name}
            placeholder={placeholder}
            className="border border-gray-300 p-2 rounded w-full"
            value={value}
            onChange={onChange}
        />
    );
};

export default TextField;