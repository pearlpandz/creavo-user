import { useRef } from "react";
import { RegularPolygon } from "react-konva";
import TransformerComponent from "./TransformerComponent";

// Circle Component
const CanvasPolygon = ({ element, isSelected, onSelect, onChange, isEditable = true }) => {
    const shapeRef = useRef();

    const handleTransformEnd = (e) => {
        const node = shapeRef.current;

        const node1 = e.target;
        const newWidth = node1.width() * node1.scaleX();
        const newHeight = node1.height() * node1.scaleY();

        // Reset scale to avoid accumulation
        node.scaleX(1);
        node.scaleY(1);

        onChange({
            ...element,
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: newHeight,
        });
    }

    const handleDragEnd = (e) => {
        onChange({ ...element, x: e.target.x(), y: e.target.y() });
    }

    return (
        <>
            <RegularPolygon
                ref={shapeRef}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                opacity={element.opacity / 100}
                fill={element.bgColor}
                strokeEnabled={element.strokeWidth > 0}
                stroke={element.strokeColor ?? 'red'}
                strokeWidth={element.strokeWidth}
                sides={element.sides}
                lineJoin={element?.lineJoin}
                draggable={isEditable}
                onDragEnd={isEditable ? handleDragEnd : null}
                onClick={isEditable ? onSelect : null}
                onTap={isEditable ? onSelect : null}
                onTransformEnd={isEditable ? handleTransformEnd : null}
            />
            <TransformerComponent shapeRef={shapeRef} isSelected={isSelected} />
        </>
    );
};

export default CanvasPolygon;