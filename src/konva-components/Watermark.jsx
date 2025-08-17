import React from 'react';
import { Layer, Text } from 'react-konva';

const Watermark = ({ width, height }) => {
  const watermarkText = 'Creavo';
  const textWidth = 120;
  const textHeight = 80;

  const watermarks = [];
  for (let y = 0; y < height; y += textHeight) {
    for (let x = 0; x < width; x += textWidth) {
      watermarks.push(
        <Text
          key={`watermark-${x}-${y}`}
          text={watermarkText}
          x={x}
          y={y}
          fontSize={24}
          fontFamily="Arial"
          fill="rgba(0, 0, 0, 0.1)"
          rotation={-30}
          listening={false}
        />
      );
    }
  }

  return <Layer>{watermarks}</Layer>;
};

export default Watermark;
