import { FaFileAlt } from 'react-icons/fa';

const FRAClaimCard = () => {
  const totalClaims = '150,000+';

  return (
    <div className="w-56 h-40 bg-white border-2 border-blue-500 rounded-xl shadow-sm p-4 flex items-center justify-center">
      {/* Icon on the left */}
      <div className="text-blue-500 text-xl mr-3">
        <FaFileAlt />
      </div>

      {/* Heading and number */}
      <div className="flex flex-col items-start">
        <p className="text-sm text-gray-700 font-medium">Total FRA Claims</p>
        <p className="text-xl font-bold text-blue-600 mt-1">{totalClaims}</p>
      </div>
    </div>
  );
};

export default FRAClaimCard;
