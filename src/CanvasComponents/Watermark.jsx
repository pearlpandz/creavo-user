import React from 'react';
import { Group, Text } from 'react-konva';

const Watermark = ({
    text = 'creavo.in',
    width,
    height,
    fontSize = 24,
    opacity = 0.1,
    rotation = -45,
    gap = 200, // distance between repetitions
}) => {
    const watermarks = [];

    // Calculate how many repetitions to draw across canvas
    for (let y = -gap; y < height + gap; y += gap) {
        for (let x = -gap; x < width + gap; x += gap) {
            watermarks.push(
                <Text
                    key={`${x}-${y}`}
                    text={text}
                    x={x}
                    y={y}
                    rotation={rotation}
                    fontSize={fontSize}
                    fill="black"
                    opacity={opacity}
                />
            );
        }
    }

    return <Group rotation={-25}>{watermarks}</Group>;
};

export default Watermark;
