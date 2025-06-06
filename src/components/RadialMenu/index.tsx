import frisbee from '#images/frisbee.png';
import { useState } from 'react';
import './RadialMenu.scss';

export const RadialMenu = ({ slices = 6 }: { slices?: number}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [players, setPlayers] = useState<Array<string> | []>([
    'Whiteneck',
    'Bonus',
    'Gator',
    'Forrest',
    'Halleh',
    'Erica',
    'Annie',
  ])
  
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
          const angle = (index * 180) / (slices - 1) - 90;
          
          return (
            <div
              key={index}
              className={`pie-slice ${hoveredSlice === index ? 'hovered' : ''} ${selectedSlice === index ? 'selected' : ''}`}
              style={{
                transform: `rotate(${angle}deg) translateY(-90px)`
                // clipPath: clipPath
              }}
              onDragOver={(e) => {
                console.log('***hovered', index);
                e.preventDefault();
                setHoveredSlice(index);
              }}
              onDragLeave={() => setHoveredSlice(null)}
              onDrop={handleDrop}
            >
              {players?.length - 1 > index && 
                <span>{players[index]}</span>
              }
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