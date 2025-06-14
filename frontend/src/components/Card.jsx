import React from "react";

function Card ({ title, children }) {
    return (
        <div className="flex items-center justify-center h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800">{title}</h1>
                    {children}
            </div>
        </div>
    );
}

export default Card;