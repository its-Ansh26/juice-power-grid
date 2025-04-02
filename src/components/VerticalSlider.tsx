
import { useState } from 'react';
import { cn } from "@/lib/utils";

interface VerticalSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const VerticalSlider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  className
}: VerticalSliderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const height = rect.height;
    const y = e.clientY - rect.top;
    
    // Invert calculation since higher values are at the top
    const percentage = 1 - (y / height);
    const newValue = Math.round(min + percentage * (max - min));
    
    onChange(Math.max(min, Math.min(max, newValue)));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSliderClick(e);
    
    // Add mouse move and mouse up event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const slider = document.getElementById('vertical-slider');
    if (!slider) return;
    
    const rect = slider.getBoundingClientRect();
    const height = rect.height;
    const y = e.clientY - rect.top;
    
    // Invert calculation since higher values are at the top
    const percentage = 1 - (y / height);
    const newValue = Math.round(min + percentage * (max - min));
    
    onChange(Math.max(min, Math.min(max, newValue)));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Calculate the position of the handle
  const fillHeight = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-sm font-semibold mb-1">High</div>
      <div
        id="vertical-slider"
        className="relative h-48 w-8 bg-gray-200 rounded-full cursor-pointer"
        onMouseDown={handleMouseDown}
        onClick={handleSliderClick}
      >
        {/* Cone shape - wide at top, narrow at bottom */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[180px] border-l-transparent border-r-transparent border-t-gray-300/30" />
        </div>
        
        {/* Fill */}
        <div
          className="absolute top-0 left-0 right-0 bg-primary rounded-t-full transition-all"
          style={{ height: `${fillHeight}%` }}
        />
        
        {/* Handle */}
        <div
          className="absolute left-1/2 w-6 h-6 bg-white border-2 border-primary rounded-full -translate-x-1/2 shadow-md transition-all"
          style={{ top: `calc(${100 - fillHeight}% - 12px)` }}
        />
      </div>
      <div className="text-sm font-semibold mt-1">Low</div>
      <div className="mt-2 text-center">
        <div className="text-xl font-bold">{value}%</div>
        <div className="text-xs text-gray-500">Machine Speed</div>
      </div>
    </div>
  );
};

export default VerticalSlider;
