import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BatteryDisplay from '@/components/BatteryDisplay';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Glass, Sugarcane, Shop } from '@/components/Icons';
import { useAppContext } from '@/lib/context';
import { calculateSugarcanesNeeded } from '@/lib/calculations';
import { Order } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

const Shopkeeper = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentUser, 
    shops, 
    orders, 
    updateOrderStatus, 
    machines, 
    updateMachine,
    submitShopRegistration
  } = useAppContext();
  
  const [submittingRegistration, setSubmittingRegistration] = useState(false);
  
  // Check if user is logged in and is a shopkeeper
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    } else if (currentUser.role !== 'shopkeeper') {
      navigate(`/${currentUser.role}`);
    }
  }, [currentUser, navigate]);
  
  if (!currentUser || currentUser.role !== 'shopkeeper') {
    return null;
  }
  
  // Find user's shop
  const userShop = shops.find(shop => shop.ownerId === currentUser.id && shop.isApproved);
  
  // Find machine for the shop
  const machine = userShop && machines.find(m => m.shopId === userShop.id);
  
  // Get orders for this shop
  const shopOrders = userShop 
    ? orders
        .filter(order => order.shopId === userShop.id)
        .sort((a, b) => b.timestamp - a.timestamp)
    : [];
  
  const handleProcessOrder = (order: Order) => {
    updateOrderStatus(order.id, 'processing');
    toast({
      title: "Order status updated",
      description: `Order #${order.id.slice(-5)} is now being processed`,
    });
  };
  
  const handleCompleteOrder = (order: Order) => {
    updateOrderStatus(order.id, 'completed');
    toast({
      title: "Order completed",
      description: `Order #${order.id.slice(-5)} has been completed`,
    });
  };
  
  const toggleMachineCharging = () => {
    if (!machine) return;
    updateMachine(machine.id, { isCharging: !machine.isCharging });
  };
  
  const togglePaymentMachine = () => {
    if (!machine) return;
    updateMachine(machine.id, { isPaymentMachineOn: !machine.isPaymentMachineOn });
  };
  
  const toggleLight = () => {
    if (!machine) return;
    updateMachine(machine.id, { isLightOn: !machine.isLightOn });
  };
  
  const cycleFanSpeed = () => {
    if (!machine) return;
    
    const speeds: Array<'off' | 'low' | 'medium' | 'high'> = ['off', 'low', 'medium', 'high'];
    const currentIndex = speeds.indexOf(machine.fanSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    updateMachine(machine.id, { fanSpeed: speeds[nextIndex] });
  };
  
  const handleMachineSpeedChange = (speed: number) => {
    if (!machine) return;
    updateMachine(machine.id, { speed });
  };
  
  const handleRegisterShop = () => {
    setSubmittingRegistration(true);
    
    // Simulate API call
    setTimeout(() => {
      submitShopRegistration({
        shopkeeperId: currentUser.id,
        shopName: "New Juice Shop",
        address: "123 Example Street",
        location: { lat: 28.6139, lng: 77.2090 },
      });
      
      toast({
        title: "Registration submitted",
        description: "Your shop registration has been submitted for approval",
      });
      
      setSubmittingRegistration(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Shopkeeper Dashboard</h1>
        
        {userShop ? (
          <div className="grid md:grid-cols-12 gap-6">
            {/* Left column - Shop info and machine controls */}
            <div className="md:col-span-7 space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Shop className="h-5 w-5 text-primary" />
                    {userShop.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">Address</div>
                    <div>{userShop.address}</div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="font-semibold">{userShop.rating}★</div>
                  </div>
                  
                  {machine && (
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-2">Machine Controls</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant={machine.isCharging ? "default" : "outline"} 
                          size="sm"
                          onClick={toggleMachineCharging}
                        >
                          {machine.isCharging ? "Stop Charging" : "Start Charging"}
                        </Button>
                        
                        <Button 
                          variant={machine.isPaymentMachineOn ? "default" : "outline"} 
                          size="sm"
                          onClick={togglePaymentMachine}
                        >
                          {machine.isPaymentMachineOn ? "Payment Machine: ON" : "Payment Machine: OFF"}
                        </Button>
                        
                        <Button 
                          variant={machine.isLightOn ? "default" : "outline"} 
                          size="sm"
                          onClick={toggleLight}
                        >
                          {machine.isLightOn ? "Light: ON" : "Light: OFF"}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={cycleFanSpeed}
                        >
                          Fan: {machine.fanSpeed.toUpperCase()}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {machine && (
                <BatteryDisplay 
                  batteryPercentage={machine.batteryPercentage}
                  isCharging={machine.isCharging}
                  solarEfficiency={machine.solarEfficiency}
                  isPaymentMachineOn={machine.isPaymentMachineOn}
                  isLightOn={machine.isLightOn}
                  fanSpeed={machine.fanSpeed}
                />
              )}
            </div>
            
            {/* Right column - Orders */}
            <div className="md:col-span-5">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Glass className="h-5 w-5 text-primary" />
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shopOrders.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto">
                      {shopOrders.map(order => {
                        const sugarcanesNeeded = calculateSugarcanesNeeded(order.glassCount);
                        
                        return (
                          <div key={order.id} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-medium">Order #{order.id.slice(-5)}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(order.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <Badge 
                                variant={
                                  order.status === 'completed' ? 'default' :
                                  order.status === 'processing' ? 'secondary' :
                                  'outline'
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-1">
                                <Glass className="h-4 w-4 text-primary" />
                                <span>{order.glassCount} glass{order.glassCount > 1 ? 'es' : ''}</span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Sugarcane className="h-4 w-4 text-sugarcane" />
                                <span>{sugarcanesNeeded} sugarcane{sugarcanesNeeded > 1 ? 's' : ''}</span>
                              </div>
                            </div>
                            
                            {order.status === 'pending' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleProcessOrder(order)}
                                className="w-full"
                              >
                                Process Order
                              </Button>
                            )}
                            
                            {order.status === 'processing' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleCompleteOrder(order)}
                                className="w-full"
                              >
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      No orders yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold mb-2">You don't have a registered shop yet</h2>
            <p className="text-gray-600 mb-6">
              Register your shop to start using the solar-powered sugarcane juice system
            </p>
            <Button onClick={handleRegisterShop} disabled={submittingRegistration}>
              {submittingRegistration ? "Submitting..." : "Register Your Shop"}
            </Button>
          </div>
        )}
      </main>
      
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SolarJuice. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Shopkeeper;
