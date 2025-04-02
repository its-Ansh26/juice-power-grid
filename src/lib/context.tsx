
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Shop, Machine, Order, ShopRegistration } from './types';

// Mock data for the application
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '2', name: 'Shop Owner 1', email: 'shop1@example.com', role: 'shopkeeper' },
  { id: '3', name: 'Shop Owner 2', email: 'shop2@example.com', role: 'shopkeeper' },
  { id: '4', name: 'Customer 1', email: 'customer1@example.com', role: 'customer' },
  { id: '5', name: 'Customer 2', email: 'customer2@example.com', role: 'customer' },
];

const mockShops: Shop[] = [
  {
    id: '1',
    name: 'Green Juice Haven',
    ownerId: '2',
    location: { lat: 28.6139, lng: 77.2090 },
    address: '123 Green St, Delhi',
    rating: 4.5,
    machineId: '1',
    isApproved: true,
  },
  {
    id: '2',
    name: 'Solar Sips',
    ownerId: '3',
    location: { lat: 28.6229, lng: 77.2080 },
    address: '456 Solar Ave, Delhi',
    rating: 4.2,
    machineId: '2',
    isApproved: true,
  }
];

const mockMachines: Machine[] = [
  {
    id: '1',
    shopId: '1',
    batteryPercentage: 75,
    solarEfficiency: 0.8,
    isCharging: true,
    speed: 70,
    isPaymentMachineOn: true,
    isLightOn: false,
    fanSpeed: 'medium',
  },
  {
    id: '2',
    shopId: '2',
    batteryPercentage: 45,
    solarEfficiency: 0.6,
    isCharging: true,
    speed: 60,
    isPaymentMachineOn: true,
    isLightOn: true,
    fanSpeed: 'low',
  }
];

const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '4',
    shopId: '1',
    glassCount: 2,
    status: 'completed',
    timestamp: Date.now() - 86400000,
  },
  {
    id: '2',
    customerId: '5',
    shopId: '1',
    glassCount: 1,
    status: 'processing',
    timestamp: Date.now() - 3600000,
  }
];

const mockRegistrations: ShopRegistration[] = [
  {
    id: '1',
    shopkeeperId: '3',
    shopName: 'Eco Juice Corner',
    address: '789 Eco Blvd, Delhi',
    location: { lat: 28.6329, lng: 77.2195 },
    machineId: '3',
    status: 'pending',
    timestamp: Date.now() - 172800000,
  }
];

// App Context Type
interface AppContextType {
  currentUser: User | null;
  users: User[];
  shops: Shop[];
  machines: Machine[];
  orders: Order[];
  registrations: ShopRegistration[];
  login: (email: string, password: string, role: 'customer' | 'shopkeeper' | 'admin') => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: 'customer' | 'shopkeeper') => Promise<boolean>;
  updateMachine: (machineId: string, updates: Partial<Machine>) => void;
  createOrder: (customerId: string, shopId: string, glassCount: number) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  submitShopRegistration: (registration: Omit<ShopRegistration, 'id' | 'status' | 'timestamp'>) => string;
  approveShopRegistration: (registrationId: string) => void;
  rejectShopRegistration: (registrationId: string) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
  selectedShop: Shop | null;
  setSelectedShop: (shop: Shop | null) => void;
  getShopById: (shopId: string) => Shop | undefined;
  getMachineByShopId: (shopId: string) => Machine | undefined;
}

// Creating the context with a default value
const AppContext = createContext<AppContextType>({
  currentUser: null,
  users: [],
  shops: [],
  machines: [],
  orders: [],
  registrations: [],
  login: () => Promise.resolve(false),
  logout: () => {},
  signup: () => Promise.resolve(false),
  updateMachine: () => {},
  createOrder: () => '',
  updateOrderStatus: () => {},
  submitShopRegistration: () => '',
  approveShopRegistration: () => {},
  rejectShopRegistration: () => {},
  userLocation: null,
  setUserLocation: () => {},
  selectedShop: null,
  setSelectedShop: () => {},
  getShopById: () => undefined,
  getMachineByShopId: () => undefined,
});

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [shops, setShops] = useState<Shop[]>(mockShops);
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [registrations, setRegistrations] = useState<ShopRegistration[]>(mockRegistrations);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Simulate battery changes and solar charging
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(machine => {
        // Update battery based on charging status and usage
        let batteryChange = 0;
        if (machine.isCharging) {
          // Add charge based on solar efficiency
          batteryChange += 0.05 * machine.solarEfficiency;
        }
        
        // Subtract battery usage based on appliances
        if (machine.isPaymentMachineOn) batteryChange -= 0.001;
        if (machine.isLightOn) batteryChange -= 0.002;
        
        // Fan usage based on speed
        if (machine.fanSpeed === 'low') batteryChange -= 0.003;
        else if (machine.fanSpeed === 'medium') batteryChange -= 0.005;
        else if (machine.fanSpeed === 'high') batteryChange -= 0.008;
        
        // Ensure battery stays within 0-100%
        const newBattery = Math.max(0, Math.min(100, machine.batteryPercentage + batteryChange));
        
        return {
          ...machine,
          batteryPercentage: newBattery,
        };
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string, role: 'customer' | 'shopkeeper' | 'admin'): Promise<boolean> => {
    // In a real app, you would validate the credentials against a database
    const user = users.find(user => user.email === email && user.role === role);
    
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const signup = async (name: string, email: string, password: string, role: 'customer' | 'shopkeeper'): Promise<boolean> => {
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const updateMachine = (machineId: string, updates: Partial<Machine>) => {
    setMachines(prev => prev.map(machine => 
      machine.id === machineId ? { ...machine, ...updates } : machine
    ));
  };

  const createOrder = (customerId: string, shopId: string, glassCount: number): string => {
    const orderId = `order-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      customerId,
      shopId,
      glassCount,
      status: 'pending',
      timestamp: Date.now(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const submitShopRegistration = (registration: Omit<ShopRegistration, 'id' | 'status' | 'timestamp'>): string => {
    const registrationId = `reg-${Date.now()}`;
    const newRegistration: ShopRegistration = {
      ...registration,
      id: registrationId,
      status: 'pending',
      timestamp: Date.now(),
    };
    
    setRegistrations(prev => [...prev, newRegistration]);
    return registrationId;
  };

  const approveShopRegistration = (registrationId: string) => {
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) return;
    
    // Update registration status
    setRegistrations(prev => prev.map(reg => 
      reg.id === registrationId ? { ...reg, status: 'approved' } : reg
    ));
    
    // Create a new shop
    const newShop: Shop = {
      id: `shop-${Date.now()}`,
      name: registration.shopName,
      ownerId: registration.shopkeeperId,
      location: registration.location,
      address: registration.address,
      rating: 0,
      machineId: registration.machineId,
      isApproved: true,
    };
    
    setShops(prev => [...prev, newShop]);
    
    // Create a new machine if not provided
    if (!registration.machineId) {
      const newMachine: Machine = {
        id: `machine-${Date.now()}`,
        shopId: newShop.id,
        batteryPercentage: 100,
        solarEfficiency: 0.7,
        isCharging: true,
        speed: 50,
        isPaymentMachineOn: true,
        isLightOn: false,
        fanSpeed: 'off',
      };
      
      setMachines(prev => [...prev, newMachine]);
    }
  };

  const rejectShopRegistration = (registrationId: string) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === registrationId ? { ...reg, status: 'rejected' } : reg
    ));
  };

  const getShopById = (shopId: string) => {
    return shops.find(shop => shop.id === shopId);
  };

  const getMachineByShopId = (shopId: string) => {
    return machines.find(machine => machine.shopId === shopId);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      shops,
      machines,
      orders,
      registrations,
      login,
      logout,
      signup,
      updateMachine,
      createOrder,
      updateOrderStatus,
      submitShopRegistration,
      approveShopRegistration,
      rejectShopRegistration,
      userLocation,
      setUserLocation,
      selectedShop,
      setSelectedShop,
      getShopById,
      getMachineByShopId,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);
