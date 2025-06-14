
function SubmitButton ({type, disabled, children}) {
    return (
        <button 
            type={type} 
            disabled={disabled}
            className="
                w-full px-4 py-3 font-bold 
                text-white bg-blue-600 rounded-lg 
                cursor-pointer hover:bg-blue-700 
                disabled:bg-blue-400">
              {children}
          </button>
    );
}

export default SubmitButton;