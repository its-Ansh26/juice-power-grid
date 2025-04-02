
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import MapView from '@/components/Map';
import OrderForm from '@/components/OrderForm';
import { useAppContext } from '@/lib/context';

const Customer = () => {
  const navigate = useNavigate();
  const { currentUser, setUserLocation } = useAppContext();
  
  // Check if user is logged in and is a customer
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    } else if (currentUser.role !== 'customer') {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);
  
  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // If user denies permission or there's an error, use a default location (Delhi)
          setUserLocation({ lat: 28.6139, lng: 77.2090 });
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      setUserLocation({ lat: 28.6139, lng: 77.2090 });
    }
  }, []);
  
  if (!currentUser || currentUser.role !== 'customer') {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, {currentUser.name}</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <MapView />
          <OrderForm />
        </div>
      </main>
      
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SolarJuice. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Customer;
