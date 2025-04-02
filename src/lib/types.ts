
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'shopkeeper' | 'admin';
}

export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  rating: number;
  machineId?: string;
  isApproved: boolean;
}

export interface Machine {
  id: string;
  shopId: string;
  batteryPercentage: number;
  solarEfficiency: number; // 0-1 based on weather and panel efficiency
  isCharging: boolean;
  speed: number; // 0-100 representing machine speed
  isPaymentMachineOn: boolean;
  isLightOn: boolean;
  fanSpeed: 'off' | 'low' | 'medium' | 'high';
}

export interface Order {
  id: string;
  customerId: string;
  shopId: string;
  glassCount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  timestamp: number;
}

export interface ShopRegistration {
  id: string;
  shopkeeperId: string;
  shopName: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  machineId?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}
