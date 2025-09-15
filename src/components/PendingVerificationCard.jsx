import { FaExclamation } from 'react-icons/fa';

const PendingVerificationCard = () => {
  const pendingCount = '12,000+';

  return (
    <div className="w-56 h-40 bg-white border-2 border-red-500 rounded-xl shadow-sm p-4 flex items-center justify-center">
      {/* Icon on the left */}
      <div className="text-red-500 text-xl mr-3">
        <FaExclamation />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-start">
        <p className="text-sm text-gray-700 font-medium">Pending</p>
        <p className="text-xl font-bold text-red-600 mt-1">{pendingCount}</p>
      </div>
    </div>
  );
};

export default PendingVerificationCard;
