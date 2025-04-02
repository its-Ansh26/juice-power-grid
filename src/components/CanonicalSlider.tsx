
import { useState, useRef, useEffect } from 'react';

interface CanonicalSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  color?: string;
}

const CanonicalSlider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  label = 'Speed',
  color = '#4CAF50'
}: CanonicalSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate angle based on value
  const calculateAngle = (val: number) => {
    // Map value to angle (225 to -45 degrees, for a 270-degree arc)
    const mapped = ((val - min) / (max - min)) * 270;
    return 225 - mapped;
  };
  
  // Calculate coordinates for the handle
  const calculateCoordinates = (angle: number) => {
    // Convert angle to radians
    const radians = (angle * Math.PI) / 180;
    
    // Calculate handle position (90px radius)
    const radius = 85;
    const x = 100 + radius * Math.cos(radians);
    const y = 100 + radius * Math.sin(radians);
    
    return { x, y };
  };
  
  // Convert mouse position to value
  const handleToValue = (clientX: number, clientY: number) => {
    if (!sliderRef.current) return value;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate angle from center to mouse
    let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    
    // Adjust angle to match our scale (225 to -45 degrees)
    if (angle < -45 && angle > -225) {
      angle = -45;
    } else if (angle > -45) {
      angle = -45;
    } else if (angle < -225) {
      angle = -225;
    }
    
    // Map angle back to value
    const mappedValue = ((225 - angle) / 270) * (max - min) + min;
    
    return Math.max(min, Math.min(max, Math.round(mappedValue)));
  };
  
  // Handle mouse/touch events
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    const newValue = handleToValue(clientX, clientY);
    onChange(newValue);
  };
  
  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const newValue = handleToValue(clientX, clientY);
    onChange(newValue);
  };
  
  const handleEnd = () => {
    setIsDragging(false);
  };
  
  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };
  
  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };
  
  // Set up event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);
  
  // Calculate handle position
  const angle = calculateAngle(value);
  const { x, y } = calculateCoordinates(angle);
  
  // Calculate gradient based on value
  const gradientRotation = 225 - (value / (max - min)) * 270;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        ref={sliderRef}
        className="canonical-slider"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          background: `conic-gradient(from ${gradientRotation}deg, ${color}, #FFC107)`
        }}
      >
        <div 
          className="canonical-slider-handle"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            backgroundColor: color
          }}
        />
        <div className="canonical-slider-value">
          {value}%
        </div>
      </div>
      <div className="text-sm font-medium mt-2">{label}</div>
    </div>
  );
};

export default CanonicalSlider;
