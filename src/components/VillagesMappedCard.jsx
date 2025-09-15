import { FaHome } from 'react-icons/fa';

const VillagesMappedCard = () => {
  const villageCount = '1,200+';

  return (
    <div className="w-56 h-40 bg-white border-2 border-green-500 rounded-xl shadow-sm p-4 flex items-center justify-center">
      {/* Icon on the left */}
      <div className="text-green-500 text-xl mr-3">
        <FaHome />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-start">
        <p className="text-sm text-gray-700 font-medium">Villages Mapped</p>
        <p className="text-xl font-bold text-green-600 mt-1">{villageCount}</p>
      </div>
    </div>
  );
};

export default VillagesMappedCard;
