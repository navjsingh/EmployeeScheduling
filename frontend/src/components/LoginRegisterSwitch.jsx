
function LoginRegisterSwitch ({text, linkText, onClick}) {
    return (
        <p className="text-center text-gray-600">
          {text}{' '}
          <button 
            onClick={onClick} 
            className="font-medium text-blue-600 cursor-pointer hover:underline">
              {linkText}
          </button>
        </p>
    );
}

export default LoginRegisterSwitch;