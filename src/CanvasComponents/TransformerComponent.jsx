import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

// Reusable Transformer Component
const TransformerComponent = ({ shapeRef, isSelected }) => {
    const transformerRef = useRef();
    useEffect(() => {
      if (isSelected) {
        transformerRef.current.nodes([shapeRef.current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }, [isSelected, shapeRef]);
  
    return isSelected ? <Transformer ref={transformerRef} /> : null;
  };

export default TransformerComponent; 