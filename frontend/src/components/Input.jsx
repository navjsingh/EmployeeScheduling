import React from "react";

function Input ({type, placeholder, value, onChange, disabled = false, ...rest}) {
    return (
        <input 
            type= {type} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} required
            disabled={disabled}
            {...rest} 
            className={`w-full px-4 py-2 text-lg border-gray-300 rounded-lg focus:ring-blue-500 
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}/>
    );
}

export default Input;