import { FaLink } from 'react-icons/fa';

const DSSLinkedSchemesCard = ({ linkedSchemes }) => {
  return (
    <div className="w-64 h-40 bg-white border-2 border-indigo-500 rounded-xl p-4 flex items-start">
      {/* Icon */}
      <div className="text-indigo-500 text-2xl mr-4 mt-1">
        <FaLink />
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-700 font-medium mb-1">Schemes Linked</p>
        <ul className="text-sm text-indigo-700 list-disc pl-4 overflow-y-auto max-h-20">
          {linkedSchemes.map((scheme, idx) => (
            <li key={idx}>{scheme}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DSSLinkedSchemesCard;
