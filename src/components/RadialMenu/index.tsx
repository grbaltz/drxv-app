import React, { useEffect, useRef, useState } from "react";
import "./RadialMenu.scss";

interface Position {
  x: number;
  y: number;
}

interface DragRef {
  startX: number;
  startY: number;
}

interface RadialMenuProps {
  slices?: number;
}

const RADIUS = 150;
const CENTER = { x: 200, y: 200 };
const HOVER_RADIUS = 20;

export const RadialMenu: React.FC<RadialMenuProps> = ({ slices = 6 }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const dragRef = useRef<DragRef>({ startX: 0, startY: 0 });
  const frisbeeRef = useRef<HTMLDivElement>(null);
  const [players, setPlayers] = useState<Array<string> | []>([
    "Whiteneck",
    "Bonus",
    "Gator",
    "Forrest",
    "Halleh",
    "Erica",
    "Annie",
  ]);

  // new
  const svgRef = useRef<SVGSVGElement>(null);

  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angle: number
  ) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (
    cx: number,
    cy: number,
    r: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${cx} ${cy}`,
      `L ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const svg = svgRef.current;
    const frisbee = frisbeeRef.current;
    if (!svg || !frisbee) return;

    // dragging position logic
    const newX = e.clientX - dragRef.current.startX;
    const newY = e.clientY - dragRef.current.startY;

    // center of frisbee
    const frisbeeRect = frisbee.getBoundingClientRect();
    const centerX = frisbeeRect.left + frisbeeRect.width / 2;
    const centerY = frisbeeRect.top + frisbeeRect.height / 2;

    setPosition({ x: newX, y: newY });

    const pt = svg.createSVGPoint();
    // pt.x = e.clientX;
    // pt.y = e.clientY;
    pt.x = centerX;
    pt.y = centerY;

    const localPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    // const elements = document.elementsFromPoint(e.clientX, e.clientY);

    let hoveredIndex = {};
    for (let angle = 0; angle < 360; angle += 22.5) {
      const rad = (angle * Math.PI) / 180;
      const hoverX = centerX + HOVER_RADIUS * Math.cos(rad);
      const hoverY = centerY + HOVER_RADIUS * Math.sin(rad);

      const elements = document.elementsFromPoint(hoverX, hoverY);
      const sliceEl = elements.find((el) => el.classList.contains("pie-slice"));

      if (sliceEl) {
        const index = parseInt(sliceEl.getAttribute("data-index") ?? "", 10);
        if (!isNaN(index)) {
          if (!hoveredIndex[index]) {
            hoveredIndex[index] = 1;
          } else {
            hoveredIndex[index]++;
          }
        }
      }
    }

    if (Object.keys(hoveredIndex)?.length > 0) {
      const mostHovered = Object.keys(hoveredIndex)?.reduce((a, b) =>
        hoveredIndex[a] > hoveredIndex[b] ? a : b
      );
      const i = hoveredIndex[mostHovered] >= 7 ? mostHovered : null;
      console.log('***i', i);
      setHoveredSlice(!i ? null : Number(i));
    } else {
      setHoveredSlice(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const anglePerSlice = 180 / slices;
  const slicePaths = Array.from({ length: slices }).map((_, index) => {
    const startAngle = index * anglePerSlice;
    const endAngle = startAngle + anglePerSlice;
    const path = describeArc(CENTER.x, CENTER.y, RADIUS, startAngle, endAngle);

    return (
      <path
        key={index}
        className="pie-slice"
        data-index={index}
        d={path}
        fill={hoveredSlice === index ? "#f00" : "#0af"}
        stroke="#000"
        strokeWidth="1"
      />
    );
  });

  const labelElements = players.slice(0, slices).map((player, index) => {
    const anglePerSlice = 180 / slices;
    const startAngle = index * anglePerSlice;
    const endAngle = (index + 1) * anglePerSlice;
    // const midAngle = (index + 0.5) * anglePerSlice;

    const midRadius = RADIUS * 0.7; // You can tweak this
    const labelAngle = (startAngle + endAngle) / 2;
    const labelPos = polarToCartesian(
      CENTER.x,
      CENTER.y,
      midRadius,
      labelAngle
    );
    const labelRotation = labelAngle;

    return (
      <text
        key={index}
        x={labelPos.x}
        y={labelPos.y}
        fill="#fff"
        fontSize="12"
        textAnchor="middle"
        alignmentBaseline="middle"
        transform={`rotate(${labelRotation} ${labelPos.x} ${labelPos.y})`}
      >
        {player}
      </text>
    );
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    };

    e.preventDefault();
  };

  const handleMouseUp = () => {
    // swap the names and attribute a catch
    if (isDragging && hoveredSlice !== null) {
      const lastPlayer = players[players.length - 1];
      const swapPlayer = players[hoveredSlice];

      const newPlayers = players.map((player, index) => {
        if (index === hoveredSlice) return lastPlayer;
        if (index === (players.length - 1)) return swapPlayer;
        return player;
      })

      setPlayers(newPlayers);
    }
    
    setIsDragging(false);
    setHoveredSlice(null);
    setPosition({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, position]);

  return (
    <div className="radial-menu-container">
      <svg
        ref={svgRef}
        width="100%"
        height="400px" // previously 50vh
        viewBox="0 0 400 400"
        className="radial-menu-svg"
        style={{ transform: "rotate(-90deg)" }}
      >
        {slicePaths}
        {labelElements}
      </svg>
      <div
        ref={frisbeeRef}
        className={`frisbee-container ${isDragging ? "dragging" : ""}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="frisbee-disc">
          <div className="frisbee-ring-outer"></div>
          <div className="frisbee-ring-inner"></div>

          <div className="frisbee-text-container">
            <span className="frisbee-text">{players[players?.length - 1]}</span>
          </div>
        </div>

        <div className="frisbee-shadow"></div>
      </div>
    </div>
  );
};

export default RadialMenu;
