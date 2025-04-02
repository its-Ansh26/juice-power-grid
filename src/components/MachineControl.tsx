
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Machine } from '@/lib/types';
import BatteryDisplay from './BatteryDisplay';
import VerticalSlider from './VerticalSlider';
import { Fan, Lightbulb, PaymentMachine } from './Icons';

interface MachineControlProps {
  machine: Machine;
  updateMachine: (machineId: string, updates: Partial<Machine>) => void;
}

const MachineControl = ({ machine, updateMachine }: MachineControlProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSpeedChange = (speed: number) => {
    updateMachine(machine.id, { speed });
  };

  const toggleCharging = () => {
    updateMachine(machine.id, { isCharging: !machine.isCharging });
  };

  const togglePaymentMachine = () => {
    updateMachine(machine.id, { isPaymentMachineOn: !machine.isPaymentMachineOn });
  };

  const toggleLight = () => {
    updateMachine(machine.id, { isLightOn: !machine.isLightOn });
  };

  const cycleFanSpeed = () => {
    const speeds: Array<'off' | 'low' | 'medium' | 'high'> = ['off', 'low', 'medium', 'high'];
    const currentIndex = speeds.indexOf(machine.fanSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    updateMachine(machine.id, { fanSpeed: speeds[nextIndex] });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Machine Control</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Minimize" : "Expand"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isExpanded ? (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3">
              <VerticalSlider 
                value={machine.speed} 
                onChange={handleSpeedChange} 
                className="mx-auto"
              />
            </div>
            <div className="md:w-2/3">
              <BatteryDisplay 
                batteryPercentage={machine.batteryPercentage}
                isCharging={machine.isCharging}
                solarEfficiency={machine.solarEfficiency}
                isPaymentMachineOn={machine.isPaymentMachineOn}
                isLightOn={machine.isLightOn}
                fanSpeed={machine.fanSpeed}
              />
              
              <div className="grid grid-cols-3 gap-3 mt-4">
                <Button 
                  variant={machine.isCharging ? "default" : "outline"} 
                  size="sm"
                  onClick={toggleCharging}
                  className="flex flex-col items-center py-3 h-auto"
                >
                  <span className={`h-5 w-5 ${machine.isCharging ? 'text-primary-foreground' : 'text-primary'}`}>⚡</span>
                  <span className="mt-1 text-xs">
                    {machine.isCharging ? "Stop Charging" : "Start Charging"}
                  </span>
                </Button>
                
                <Button 
                  variant={machine.isPaymentMachineOn ? "default" : "outline"} 
                  size="sm"
                  onClick={togglePaymentMachine}
                  className="flex flex-col items-center py-3 h-auto"
                >
                  <PaymentMachine className={`h-5 w-5 ${machine.isPaymentMachineOn ? 'text-primary-foreground' : 'text-primary'}`} />
                  <span className="mt-1 text-xs">
                    {machine.isPaymentMachineOn ? "Payment: ON" : "Payment: OFF"}
                  </span>
                </Button>
                
                <Button 
                  variant={machine.isLightOn ? "default" : "outline"} 
                  size="sm"
                  onClick={toggleLight}
                  className="flex flex-col items-center py-3 h-auto"
                >
                  <Lightbulb className={`h-5 w-5 ${machine.isLightOn ? 'text-primary-foreground' : 'text-primary'}`} />
                  <span className="mt-1 text-xs">
                    {machine.isLightOn ? "Light: ON" : "Light: OFF"}
                  </span>
                </Button>
                
                <Button 
                  variant={machine.fanSpeed !== 'off' ? "default" : "outline"} 
                  size="sm"
                  onClick={cycleFanSpeed}
                  className="flex flex-col items-center py-3 h-auto col-start-2"
                >
                  <Fan className={`h-5 w-5 ${machine.fanSpeed !== 'off' ? 'text-primary-foreground animate-spin-slow' : 'text-primary'}`} />
                  <span className="mt-1 text-xs">
                    Fan: {machine.fanSpeed.toUpperCase()}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {machine.speed}%
              </div>
              <span className="font-medium">Speed</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-1 ${machine.isCharging ? 'text-green-600' : 'text-gray-400'}`}>
                <span className="h-4 w-4">⚡</span>
                <span className="text-sm">{machine.isCharging ? 'Charging' : 'Off'}</span>
              </div>
              
              <div className={`flex items-center gap-1 ${machine.isPaymentMachineOn ? 'text-green-600' : 'text-gray-400'}`}>
                <PaymentMachine className="h-4 w-4" />
              </div>
              
              <div className={`flex items-center gap-1 ${machine.isLightOn ? 'text-green-600' : 'text-gray-400'}`}>
                <Lightbulb className="h-4 w-4" />
              </div>
              
              <div className={`flex items-center gap-1 ${machine.fanSpeed !== 'off' ? 'text-green-600' : 'text-gray-400'}`}>
                <Fan className={`h-4 w-4 ${machine.fanSpeed !== 'off' ? 'animate-spin-slow' : ''}`} />
                <span className="text-xs">{machine.fanSpeed !== 'off' ? machine.fanSpeed : ''}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MachineControl;
