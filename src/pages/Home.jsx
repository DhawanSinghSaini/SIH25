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
        <div>
                {/* Responsive grid for cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  <FRAClaimCard />
                  <ApprovedTitlesCard />
                  <PendingVerificationCard />
                  <SchemesLinkedCard />
                  <StatesCoveredCard />
                  <VillagesMappedCard />
                </div>

                {/* Map */}
                <MapComponent />

                {/* Button Menu */}
                <ButtonMenu />
        </div>
    );
}

export default Home;