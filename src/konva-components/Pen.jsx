/* eslint-disable no-unused-vars */
import { useMemo, useRef } from "react";
import { Circle, Line } from "react-konva";

export default function Pen({
  points,
  activatePoints,
  isSelected,
  onPointDrag,
  onChange,
  isClosed,
  currentTool,
  onAddPoint,
  onRemovePoint,
  ...rest
}) {
  const shapeRef = useRef();
  const {
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    bgColor,
    strokeColor,
    strokeWidth,
    opacity = 100,
    ...otherRest
  } = rest;
  const konvaOpacity = opacity / 100;

  const mappedPoints = useMemo(() => {
    if (!points) return [];
    const mappedPoints = [];
    for (let i = 0; i < points.length; i += 2) {
      mappedPoints.push({
        x: points[i] * scaleX,
        y: points[i + 1] * scaleY,
      });
    }
    return mappedPoints;
  }, [points, scaleX, scaleY]);

  const hoverRef = useRef(null);

  // useEffect(() => {
  //   document.body.style.cursor = "default";
  // }, [activatePoints]);

  const handleDragEnd = (e) => {
    const { onClick, draggable, ...element } = rest;
    onChange({
      ...element,
      x: e.target.x(),
      y: e.target.y(),
      isSelected: true,
    });
  };

  const handleTransformEnd = (e) => {
    let node = e.target;
    const newWidth = node.width() * node.scaleX();
    const newHeight = node.height() * node.scaleY();

    const { onClick, draggable, ...element } = rest;
    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: newWidth,
      height: newHeight,
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    });
  };

  const handleClick = (e) => {
    if (e.evt.button === 0) {
      if (currentTool === "pen") {
        const pointerPosition = e.target.getStage().getPointerPosition();
        onAddPoint(pointerPosition);
      } else {
        rest.onSelect(e.evt.shiftKey || e.evt.ctrlKey);
      }
    }
  };

  const handleTap = (e) => {
    if (e.evt.button === 0) {
      if (currentTool === "pen") {
        const pointerPosition = e.target.getStage().getPointerPosition();
        onAddPoint(pointerPosition);
      } else {
        rest.onSelect(e.evt.shiftKey || e.evt.ctrlKey);
      }
    }
  };

  const handlePointMouseOver = (e) => {
    e.target.setAttr("fill", "#eee");
    document.body.style.cursor = "pointer";
    hoverRef?.current?.setAttrs({
      x: x + e.target.x(),
      y: y + e.target.y(),
      visible: true,
    });
  };

  const handlePointMouseOut = (e) => {
    e.target.setAttr("fill", "white");
    document.body.style.cursor = "default";
    hoverRef?.current?.setAttrs({
      visible: false,
    });
  };

  const handlePointDragMove = (e, index) => {
    const newX = e.target.x() - x;
    const newY = e.target.y() - y;

    const newPoints = [...(points || [])];
    newPoints[index * 2] = newX;
    newPoints[index * 2 + 1] = newY;
    onPointDrag(newPoints);

    hoverRef?.current?.setAttrs({
      x: e.target.x(),
      y: e.target.y(),
      visible: true,
    });
  };

  return (
    <>
      <Line
        ref={shapeRef}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        points={points}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        fill={bgColor}
        opacity={konvaOpacity}
        onClick={handleClick}
        onTap={handleTap}
        closed={isClosed}
        {...otherRest}
      />
      {isSelected &&
        mappedPoints.map((point, index) => {
          return (
            <Circle
              x={x + point.x}
              y={y + point.y}
              radius={5}
              fill="white"
              stroke="#8986E3"
              strokeWidth={1}
              draggable
              onMouseOver={handlePointMouseOver}
              onMouseOut={handlePointMouseOut}
              onDragMove={(e) => handlePointDragMove(e, index)}
              onClick={(e) => {
                if (e.evt.altKey) {
                  onRemovePoint(index);
                }
              }}
            />
          );
        })}
    </>
  );
}
