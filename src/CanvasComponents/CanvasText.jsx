import { useEffect, useRef, useState } from "react";
import { Text } from "react-konva";
import { Html } from "react-konva-utils";
import TransformerComponent from "./TransformerComponent";

// Text Component
const CanvasText = ({ element, isSelected, onSelect, onChange, stageRef, isEditable = true }) => {
  const textNodeRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(element.content);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && stageRef?.current) {
      const textNode = textNodeRef.current;
      const stage = stageRef.current;
      const stageBox = stage.container().getBoundingClientRect();
      const textBox = textNode.getClientRect();

      Object.assign(inputRef.current.style, {
        position: "absolute",
        top: `${stageBox.top + textBox.y}px`,
        left: `${stageBox.left + textBox.x}px`,
        width: `${textBox.width}px`,
        height: `${textBox.height}px`,
        fontSize: `${element.fontSize}px`,
        color: element.color,
        background: "transparent",
        border: "none",
        outline: "none",
        textAlign: "center",
        zIndex: "1000",
      });

      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [element.color, element.fontSize, isEditing, stageRef]);

  const handleDblClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleInputBlur = () => {
    onChange({ ...element, content: text });
    setIsEditing(false);
  };

  const handleTransformEnd = () => {
    const node = textNodeRef.current;
    onChange({
      ...element,
      x: node.x(),
      y: node.y(),
      width: node.width() * node.scaleX() > 600 ? 600 : node.width() * node.scaleX(),
      height: node.height() * node.scaleY() > 600 ? 600 : node.height() * node.scaleY(),
      fontSize: node.fontSize(),
    });
  }

  const handleDragEnd = (e) => {
    onChange({ ...element, x: e.target.x(), y: e.target.y() });
  }

  return (
    <>
      {isEditing ? (
        <Html>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
          />
        </Html>
      ) : (
        <Text
          ref={textNodeRef}
          text={element.content}
          x={element.x}
          y={element.y}
          fontSize={element.fontSize}
          fill={element.textColor}
          width={element.width > 600 ? 600 : element.width}
          height={element.height > 600 ? 600 : element.height}
          align={element?.align || "center"} // should be parameterized
          wrap="word"
          draggable={isEditable}
          onClick={isEditable ? onSelect : null}
          onDblClick={isEditable ? handleDblClick : null}
          onTap={isEditable ? handleDblClick : null} // Mobile support
          onTransformEnd={isEditable ? handleTransformEnd : null}
          onDragEnd={isEditable ? handleDragEnd : null}
        />
      )}
      <TransformerComponent shapeRef={textNodeRef} isSelected={isSelected} />
    </>
  );
};

export default CanvasText;