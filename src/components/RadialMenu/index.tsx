import frisbee from '#images/frisbee.png';
import { useState } from 'react';
import './RadialMenu.scss';

export const RadialMenu = ({ slices = 6 }: { slices?: number}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    console.log('***yup', );

    // const img = new Image()
    // img.src = ''
    // e.dataTransfer.setDragImage(img, 0, 0)
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
      {/* <div>{slices}</div> */}
      <img 
        src={frisbee.uri}
        alt='frisbee'
        // className={`frisbee ${isDragging ? 'hidden' : ''}`}
        // draggable
        // onDragStart={() => setIsDragging(true)}
        // onDragEnd={handleDragEnd}
      />
      {/* <Image 
        source={{ uri: frisbee.uri }} 
        style={{ width: 100, height: 100 }}
        
      /> */}

    </div>
  )
};

export default RadialMenu;