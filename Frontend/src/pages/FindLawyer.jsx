import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/layout/DashboardHeader';
import HeroSection from "../components/HeroSection";
import LawyersCarousel from "../components/LawyersCarousel";
import BrowseLawyers from "../components/BrowseLawyers";

export default function FindLawyer() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if user came from dashboard
  const cameFromDashboard = user && location.pathname === '/dashboard/find-lawyer';

  return (
    <div className="min-h-screen">
      {cameFromDashboard && <DashboardHeader />}
      <HeroSection />
      <LawyersCarousel />
      <BrowseLawyers />
    </div>
  );
}