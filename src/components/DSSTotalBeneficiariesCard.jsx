import { FaUsers } from 'react-icons/fa';

const DSSTotalBeneficiariesCard = () => {
  const total = '24,678';

  return (
    <div className="w-64 h-40 bg-white border-2 border-teal-500 rounded-xl p-4 flex items-center">
      <div className="text-teal-500 text-2xl mr-4">
        <FaUsers />
      </div>
      <div className="flex flex-col items-start">
        <p className="text-sm text-gray-700 font-medium">Total FRA Beneficiaries</p>
        <p className="text-xl font-bold text-teal-600 mt-2">{total}</p>
        <p className="text-xs text-gray-500 mt-1">Eligible for DSS mapping</p>
      </div>
    </div>
  );
};

export default DSSTotalBeneficiariesCard;
