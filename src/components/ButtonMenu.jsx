const ButtonMenu = () => {
  return (
    <div className="flex flex-wrap gap-4 justify-start py-4">
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
        Upload Document
      </button>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
        View Atlas
      </button>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
        Generate Report
      </button>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
        Apply DSS
      </button>
    </div>
  );
};

export default ButtonMenu;
