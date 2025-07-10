
import React from "react";
import { Arc as KonvaArc } from "react-konva";

const Arc = (props) => {
  return (
    <KonvaArc
      {...props}
      angle={props.angle}
      innerRadius={props.innerRadius}
      outerRadius={props.outerRadius}
    />
  );
};

export default Arc;
