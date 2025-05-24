import { useRef } from "react";
import { Group, Rect, Text } from "react-konva";
import TransformerComponent from "./TransformerComponent";

// Rectangle Text Component
const CanvasRectangleWithText = ({ element, isSelected, onSelect, onChange, isEditable = true }) => {
  const shapeRef = useRef();
  const textRef = useRef();


  const handleDragEnd = (e) => {
    onChange({ ...element, x: e.target.x(), y: e.target.y() });
  }

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const newWidth = node.width() * node.scaleX();
    const newHeight = node.height() * node.scaleY();
    node.scaleX(1); // Reset scale after applying transformation
    node.scaleY(1);
    onChange({
      ...element,
      width: newWidth,
      height: newHeight
    });
  }

  return (
    <Group
      x={element.x}
      y={element.y}
      draggable={isEditable}
      onClick={isEditable ? onSelect : null}
      onTap={isEditable ? onSelect : null}
      onDragEnd={isEditable ? handleDragEnd : null}
    >
      {/* Rectangle */}
      <Rect
        ref={shapeRef}
        width={element.width}
        height={element.height}
        fill={element.bgColor}
        cornerRadius={element.radius}
        // cornerRadius={5} // it should be parameterize
        draggable={isEditable}
        onTransformEnd={isEditable ? handleTransformEnd : null}
      />

      {/* Linked Text */}

      <Text
        // x={(shapeRef.current?.width() - textRef.current?.width() + shapeRef.current?.x()) / 2}
        x={shapeRef.current && textRef.current
          ? shapeRef.current.x() + shapeRef.current.width() - textRef.current.width()
          : 0}
        y={shapeRef.current && textRef.current
          ? shapeRef.current.y() + shapeRef.current.height() - textRef.current.height()
          : 0}
        ref={textRef}
        text={element.content}
        fontSize={element.fontSize}
        fill={element.textColor}
        width={element.width}
        height={element.height}
        align={element.align ?? "center"}  // should be parameterize
        verticalAlign="middle"
        wrap="word"
        padding={element.padding}
        onClick={isEditable ? onSelect : null}
      />

      <TransformerComponent shapeRef={shapeRef} isSelected={isSelected} />
    </Group>
  );
};

export default CanvasRectangleWithText;