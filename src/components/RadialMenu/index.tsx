import frisbee from '#images/frisbee.png';
import { useState } from 'react';

export const RadialMenu = ({ slices = 6 }: { slices?: number}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)

    const img = new Image()
    img.src = ''
    e.dataTransfer.setDragImage(img, 0, 0)
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

  return (
    <div className='radial-menu-container'>
      {[...Array(slices)].map((_, index) => (
        <div
          key={index}
          className={`pie-slice slice-${index}}
            ${hoveredSlice === index ? 'hovered' : ''
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setHoveredSlice(index);
          }}
          onDragLeave={() => setHoveredSlice(null)}
          onDrop={handleDrop}
        />
      ))}
      <img 
        src={frisbee.uri}
        alt='frisbee'
        className={`frisbee ${isDragging ? 'hidden' : ''}`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </div>
  )
};

export default RadialMenu;