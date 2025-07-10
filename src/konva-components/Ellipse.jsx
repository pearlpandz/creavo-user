
import React from "react";
import { Ellipse as KonvaEllipse } from "react-konva";

const Ellipse = (props) => {
  return (
    <KonvaEllipse
      {...props}
      radiusX={props.radiusX}
      radiusY={props.radiusY}
    />
  );
};

export default Ellipse;
