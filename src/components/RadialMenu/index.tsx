import React, { useRef, useState } from "react";
import "./RadialMenu.scss";

interface Position {
  x: number,
  y: number,
};

interface DragRef {
  startX: number,
  startY: number,
};

interface RadialMenuProps {
  slices?: number,
};


export const RadialMenu: React.FC<RadialMenuProps> = ({ slices = 6 }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const dragRef = useRef<DragRef>({ startX: 0, startY: 0 });
  const [players, setPlayers] = useState<Array<string> | []>([
    "Whiteneck",
    "Bonus",
    "Gator",
    "Forrest",
    "Halleh",
    "Erica",
    "Annie",
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    }

    e.preventDefault();
  }

  const handleMouseUp = () => {
    setIsDragging(false);
  } 

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragRef.current.startX;
    const newY = e.clientY - dragRef.current.startY;

    setPosition({ x: newX, y: newY });
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    console.log("***dragging start");
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    handleDrop();
  };

  const handleDrop = () => {
    if (hoveredSlice !== null) {
      setSelectedSlice(hoveredSlice);
    }
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, position]);

  return (
    <div className="radial-menu-container">
        <div className="semicircle-container">
          {[...Array(slices)].map((_, index) => {
            const angle = (index * 180) / (slices - 1) - 90;

            return (
              <div
                key={index}
                className={`pie-slice ${
                  hoveredSlice === index ? "hovered" : ""
                } ${selectedSlice === index ? "selected" : ""}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-90px)`,
                  // clipPath: clipPath
                }}
                onDragOver={(e) => {
                  console.log("***hovered", index);
                  e.preventDefault();
                  setHoveredSlice(index);
                }}
                onDragLeave={() => setHoveredSlice(null)}
                onDrop={handleDrop}
              >
                {players?.length - 1 > index && <span>{players[index]}</span>}
              </div>
            );
          })}
      </div>
      <div
        className={`frisbee-container ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Frisbee Disc */}
        <div className="frisbee-disc">
          {/* Frisbee Ring Pattern */}
          <div className="frisbee-ring-outer"></div>
          <div className="frisbee-ring-inner"></div>
          
          {/* Center Text */}
          <div className="frisbee-text-container">
            <span className="frisbee-text">
              FRISBEE
            </span>
          </div>
        </div>
        
        {/* Drop Shadow */}
        <div className="frisbee-shadow"></div>
      </div>
      {/* <div
        className="frisbee-container"
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <img
          src={frisbee.uri}
          alt="frisbee"
          className={`frisbee ${isDragging ? "hidden" : ""}`}
        />
        <div className="label">Text</div>
      </div> */}
    </div>
  );
};

export default RadialMenu;
