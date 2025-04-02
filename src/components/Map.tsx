
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppContext } from '@/lib/context';
import { calculateDistance } from '@/lib/calculations';
import { Shop } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

// Mock function for map rendering
const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { shops, userLocation, selectedShop, setSelectedShop } = useAppContext();
  const { toast } = useToast();
  const [distances, setDistances] = useState<{[key: string]: number}>({});
  
  // Calculate distances to shops
  useEffect(() => {
    if (!userLocation) return;
    
    const newDistances: {[key: string]: number} = {};
    shops.forEach(shop => {
      if (shop.isApproved) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          shop.location.lat,
          shop.location.lng
        );
        newDistances[shop.id] = distance;
      }
    });
    
    setDistances(newDistances);
  }, [userLocation, shops]);
  
  useEffect(() => {
    // Mock map initialization
    if (mapRef.current) {
      // In a real app, we would initialize a map library here (Google Maps, MapBox, etc.)
      console.log('Map initialized');
    }
  }, []);
  
  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
    toast({
      title: "Shop selected",
      description: `You've selected ${shop.name}`,
    });
  };
  
  const getDirections = () => {
    if (!selectedShop || !userLocation) return;
    
    toast({
      title: "Directions",
      description: `Directions to ${selectedShop.name} (${Math.round(distances[selectedShop.id])} meters)`,
    });
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Nearby Shops</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mock map view */}
        <div 
          ref={mapRef}
          className="h-60 bg-gray-200 mb-4 rounded-md flex items-center justify-center text-gray-500"
        >
          {userLocation ? (
            <div className="text-center p-4">
              <div className="text-sm">Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</div>
              <div className="text-xs mt-2 text-gray-400">(This is a mock map display)</div>
              
              {selectedShop && (
                <div className="mt-4 p-2 bg-white rounded-md shadow-sm">
                  <div className="text-sm font-medium text-primary">{selectedShop.name}</div>
                  <div className="text-xs">{Math.round(distances[selectedShop.id])} meters away</div>
                </div>
              )}
            </div>
          ) : (
            <div>Fetching your location...</div>
          )}
        </div>
        
        {/* Shop list */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {shops
            .filter(shop => shop.isApproved)
            .sort((a, b) => 
              (distances[a.id] || Infinity) - (distances[b.id] || Infinity)
            )
            .map(shop => (
              <div 
                key={shop.id} 
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedShop?.id === shop.id 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                }`}
                onClick={() => handleShopSelect(shop)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{shop.name}</div>
                    <div className="text-xs text-gray-500">{shop.address}</div>
                  </div>
                  {distances[shop.id] && (
                    <div className="text-sm">{Math.round(distances[shop.id])}m</div>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <div className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    Rating: {shop.rating}★
                  </div>
                </div>
              </div>
            ))}
        </div>
        
        {selectedShop && (
          <Button className="w-full mt-4" onClick={getDirections}>
            Get Directions
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;
