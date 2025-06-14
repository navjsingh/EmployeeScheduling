
function Form ({onSubmit, children}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {children}
        </form>
    );
}

export default Form;