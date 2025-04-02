
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import AuthForm from '@/components/AuthForm';
import { SolarPanel, Glass, Shop } from '@/components/Icons';
import { useAppContext } from '@/lib/context';

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'customer') {
        navigate('/customer');
      } else if (currentUser.role === 'shopkeeper') {
        navigate('/shopkeeper');
      } else if (currentUser.role === 'admin') {
        navigate('/admin');
      }
    }
  }, [currentUser, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary py-6 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
            <SolarPanel className="inline-block text-solar-light" />
            <span className="text-solar-light">Solar</span>Juice
          </h1>
          <p className="text-center mt-2 max-w-md mx-auto">
            The eco-friendly way to enjoy fresh sugarcane juice powered by solar energy
          </p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome to SolarJuice</h2>
            <p className="mb-6">
              Our innovative solar-powered sugarcane juice machines make delicious, 
              freshly pressed juice while being environmentally friendly.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <SolarPanel className="h-8 w-8 mx-auto text-solar" />
                  <h3 className="font-bold mt-2">Solar Powered</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Clean energy for a sustainable future
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <Glass className="h-8 w-8 mx-auto text-sugarcane" />
                  <h3 className="font-bold mt-2">Fresh Juice</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Freshly pressed sugarcane juice
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <Shop className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-bold mt-2">Find Shops</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Locate and order from nearby shops
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <AuthForm />
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SolarJuice. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
