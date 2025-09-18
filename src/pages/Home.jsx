import FRAClaimCard from '../components/FRAClaimCard';
import ApprovedTitlesCard from '../components/ApprovedTitlesCard';
import PendingVerificationCard from '../components/PendingVerificationCard';
import SchemesLinkedCard from '../components/SchemesLinkedCard';
import StatesCoveredCard from '../components/StatesCoveredCard';
import VillagesMappedCard from '../components/VillagesMappedCard';
import MapComponent from '../components/MapComponent';
import ButtonMenu from '../components/ButtonMenu';

const Home = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Dashboard Title */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* Responsive grid for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <FRAClaimCard />
        <ApprovedTitlesCard />
        <PendingVerificationCard />
        <SchemesLinkedCard />
        <StatesCoveredCard />
        <VillagesMappedCard />
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Interactive Map</h2>
        <div className="h-[500px] w-full rounded-xl overflow-hidden">
          <MapComponent />
        </div>
      </div>

      {/* Floating Button Menu (bottom-right) */}
    </div>
  );
};

export default Home;
