
import React from "react";
import { Star as KonvaStar } from "react-konva";

const Star = (props) => {
  return (
    <KonvaStar
      {...props}
      sides={props.numPoints}
      innerRadius={props.innerRadius}
      outerRadius={props.outerRadius}
    />
  );
};

export default Star;
