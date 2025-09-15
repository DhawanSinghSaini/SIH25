const Footer = () => {
  return (
    <footer className="w-full bg-white border-t-4 border-blue-500 shadow-sm px-6 py-2 flex justify-between items-center text-sm text-blue-600">
      {/* Left side with more space */}
      <div className="flex-[2]">
        &copy; 2025 Ministry of Tribal Affairs
      </div>

      {/* Right side with less space and spaced links */}
      <div className="flex-1 flex justify-between">
        <a href="#" className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">Support</a>
        <a href="#" className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">Contact Us</a>
        <a href="#" className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">FAQs</a>
      </div>
    </footer>
  );
};

export default Footer;
