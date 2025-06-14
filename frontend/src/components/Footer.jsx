
function Footer() {
  return (
    <footer className="w-full bg-white shadow-inner mt-auto">
      <div className="container mx-auto px-6 py-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} VacationManager. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;