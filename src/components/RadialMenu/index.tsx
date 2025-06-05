import frisbee from '#images/frisbee.png';
import { useState } from 'react';
import './RadialMenu.scss';

export const RadialMenu = ({ slices = 6 }: { slices?: number}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    console.log('***dragging start');
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    handleDrop()
  }

  const handleDrop = () => {
    if (hoveredSlice !== null) {
      setSelectedSlice(hoveredSlice)
    }
    setIsDragging(false)
  }

  const anglePerSlice = 180 / slices;
  const gapAngle = 3; // 3 degrees gap between slices

  return (
    <div className='radial-menu-container'>
      <div className="semicircle-container">
        {[...Array(slices)].map((_, index) => {
          // Calculate start and end angles for this slice
          const startAngle = (index * anglePerSlice + (index * gapAngle)) - 90; // Start from left (-90°)
          const endAngle = startAngle + anglePerSlice;
          
          // Convert to radians for calculations
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const radius = 120;
          const centerX = 150;
          const centerY = 150;
          
          const x1 = centerX + radius * Math.cos(startRad);
          const y1 = centerY + radius * Math.sin(startRad);
          const x2 = centerX + radius * Math.cos(endRad);
          const y2 = centerY + radius * Math.sin(endRad);
          
          // Create clip-path for hit detection
          const clipStartRad = (startAngle + 90) * (Math.PI / 180); // Adjust for clip-path coordinate system
          const clipEndRad = (endAngle + 90) * (Math.PI / 180);
          
          const clipPath = `polygon(50% 100%, ${50 + 50 * Math.cos(clipStartRad)}% ${50 + 50 * Math.sin(clipStartRad)}%, ${50 + 50 * Math.cos(clipEndRad)}% ${50 + 50 * Math.sin(clipEndRad)}%)`;
          
          // Create SVG path for perfect pie slice
          const pathData = [
            `M ${centerX} ${centerY}`, // Move to center
            `L ${x1} ${y1}`, // Line to start of arc
            `A ${radius} ${radius} 0 0 1 ${x2} ${y2}`, // Arc to end point
            'Z' // Close path back to center
          ].join(' ');
          
          return (
            <div
              key={index}
              className={`pie-slice-container ${hoveredSlice === index ? 'hovered' : ''} ${selectedSlice === index ? 'selected' : ''}`}
              style={{
                clipPath: clipPath
              }}
              onDragOver={(e) => {
                console.log('***hovered', index);
                e.preventDefault();
                setHoveredSlice(index);
              }}
              onDragLeave={() => setHoveredSlice(null)}
              onDrop={handleDrop}
            >
              <svg
                width="300"
                height="150"
                viewBox="0 0 300 150"
                className="pie-slice-svg"
                style={{ pointerEvents: 'none' }}
              >
                <path
                  d={pathData}
                  className="pie-slice"
                  style={{ pointerEvents: 'none' }}
                />
              </svg>
            </div>
          );
        })}
      </div>
      <img 
        src={frisbee.uri}
        alt='frisbee'
        className={`frisbee ${isDragging ? 'hidden' : ''}`}
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </div>
  )
};

export default RadialMenu;