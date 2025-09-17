import { FaReact } from 'react-icons/fa';

const DSSAvailableSchemesCard = ({ schemes }) => {
  return (
    <div className="w-64 h-40 bg-white border-2 border-blue-500 rounded-xl p-4 flex items-start">
      {/* Icon */}
      <div className="text-blue-500 text-2xl mr-4 mt-1">
        <FaReact />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-700 font-medium mb-1">Eligible Schemes</p>
        <ul className="text-sm text-blue-700 list-disc pl-4 overflow-y-auto max-h-20">
          {schemes.map((scheme, idx) => (
            <li key={idx}>{scheme}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DSSAvailableSchemesCard;
