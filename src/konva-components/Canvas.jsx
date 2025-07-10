import React, { useRef, useEffect, forwardRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Text,
  Transformer,
  Image as KonvaImage,
  RegularPolygon,
  Group,
} from "react-konva";
import useImage from "use-image";
import Star from "./Star";
import Arc from "./Arc";
import Ellipse from "./Ellipse";
import Pen from "./Pen";

const GeneralShape = forwardRef((props, ref) => {
  const { shapeProps, onSelect, onContextMenu, onPointDrag, mode } = props;
  let KonvaShape;
  switch (shapeProps.type) {
    case "rect":
    case "square":
      KonvaShape = Rect;
      props.shapeProps.cornerRadius = [
        props.shapeProps.cornerRadiusTopLeft || 0,
        props.shapeProps.cornerRadiusTopRight || 0,
        props.shapeProps.cornerRadiusBottomRight || 0,
        props.shapeProps.cornerRadiusBottomLeft || 0,
      ];
      break;
    case "circle":
      KonvaShape = Circle;
      break;
    case "line":
      KonvaShape = Line;
      break;
    case "text":
      KonvaShape = Text;
      break;
    case "group":
      KonvaShape = Group;
      break;
    case "polygon":
      KonvaShape = RegularPolygon;
      break;
    case "star":
      KonvaShape = Star;
      break;
    case "arc":
      KonvaShape = Arc;
      break;
    case "ellipse":
      KonvaShape = Ellipse;
      break;
    case "pen":
      KonvaShape = Pen;
      break;
    default:
      return null;
  }

  return (
    <KonvaShape
      ref={ref}
      {...shapeProps}
      {...(shapeProps.type === "text"
        ? {
            fill: shapeProps.color,
            fontStyle:
              `${shapeProps.fontStyle} ${shapeProps.fontWeight}`.trim(),
            align: shapeProps.textAlign,
            textDecoration: shapeProps.textDecoration,
            lineHeight: shapeProps.lineHeight,
            padding: shapeProps.padding,
          }
        : {})}
      {...(shapeProps.type === "pen" && props.isSelected
        ? { activatePoints: true, onPointDrag: onPointDrag }
        : {})}
      onClick={(e) => {
        if (mode === "edit") {
          onSelect(shapeProps, e);
          e.cancelBubble = true;
        }
      }}
      onTap={(e) => {
        if (mode === "edit") {
          onSelect(shapeProps, e);
          e.cancelBubble = true;
        }
      }}
      onContextMenu={(e) => {
        if (mode === "edit") {
          onContextMenu(e, shapeProps.id);
        }
      }}
    />
  );
});

const ImageBasedShape = forwardRef((props, ref) => {
  const { shapeProps, onSelect, onContextMenu, mode } = props;
  const [image] = useImage(shapeProps.src, "anonymous");
  const videoRef = useRef(null);

  useEffect(() => {
    if (shapeProps.type === "video") {
      const video = document.createElement("video");
      video.src = shapeProps.src;
      video.loop = true;
      video.muted = true;
      video.autoplay = true;
      video.crossOrigin = "anonymous";
      video.addEventListener("timeupdate", () => {
        if (ref && ref.current) {
          ref.current.getLayer().batchDraw();
        }
      });
      videoRef.current = video;
    }
  }, [shapeProps.src, shapeProps.type, ref]);

  return (
    <KonvaImage
      ref={ref}
      {...shapeProps}
      image={shapeProps.type === "video" ? videoRef.current : image}
      onClick={(e) => {
        if (mode === "edit") {
          onSelect(shapeProps, e);
          e.cancelBubble = true;
        }
      }}
      onTap={(e) => {
        if (mode === "edit") {
          onSelect(shapeProps, e);
          e.cancelBubble = true;
        }
      }}
      onContextMenu={(e) => {
        if (mode === "edit") {
          onContextMenu(e, shapeProps.id);
        }
      }}
    />
  );
});

const Shape = forwardRef((props, ref) => {
  const { shapeProps, onPointDrag, isSelected, mode } = props;
  if (
    shapeProps.type === "image" ||
    shapeProps.type === "gif" ||
    shapeProps.type === "video"
  ) {
    return <ImageBasedShape ref={ref} {...props} mode={mode} />;
  }
  return (
    <GeneralShape
      ref={ref}
      {...props}
      onPointDrag={onPointDrag}
      isSelected={isSelected}
    />
  );
});

const ElementRenderer = ({
  element,
  elements,
  isSelected,
  onSelect,
  onChange,
  onContextMenu,
  currentTool,
  onRemovePoint,
  mode,
}) => {
  const handlePointDrag = (newPoints) => {
    onChange(element.id, { points: newPoints });
  };
  const shapeRef = useRef();
  const trRef = useRef();
  const maskRef = useRef();

  useEffect(() => {
    if (mode === "edit") {
      if (
        element.type === "group" &&
        isSelected &&
        trRef.current &&
        maskRef.current
      ) {
        trRef.current.nodes([maskRef.current]);
        trRef.current.getLayer().batchDraw();
      } else if (isSelected && trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [isSelected, element.type, mode]);

  const handleDragEnd = (e) => {
    if (mode === "edit") {
      onChange(element.id, { x: e.target.x(), y: e.target.y() });
    }
  };

  const handleTransformEnd = () => {
    if (mode === "edit") {
      if (element.type === "group") {
        const node = shapeRef.current;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        const groupChildren = elements.filter((el) => el.groupId === element.id);
        groupChildren.forEach((child) => {
          let updated = { ...child };

          updated.x = (child.x - element.x) * scaleX + element.x;
          updated.y = (child.y - element.y) * scaleY + element.y;

          if (child.width) updated.width = child.width * scaleX;
          if (child.height) updated.height = child.height * scaleY;
          if (child.radius)
            updated.radius = child.radius * Math.max(scaleX, scaleY);
          if (child.radiusX) updated.radiusX = child.radiusX * scaleX;
          if (child.radiusY) updated.radiusY = child.radiusY * scaleY;
          if (child.points) {
            updated.points = child.points.map((val, idx) =>
              idx % 2 === 0
                ? (val - element.x) * scaleX + element.x
                : (val - element.y) * scaleY + element.y
            );
          }

          onChange(child.id, updated);
        });

        // Update group position after scale
        onChange(element.id, {
          x: node.x(),
          y: node.y(),
          width: element.width * scaleX,
          height: element.height * scaleY,
          _version: Date.now(),
        });

        return;
      }

      // default case for single shape
      const node = shapeRef.current;
      if (!node) return;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();
      node.scaleX(1);
      node.scaleY(1);

      const updatedProps = {
        x: node.x(),
        y: node.y(),
        width: Math.max(5, (element.width || node.width()) * scaleX),
        height: Math.max(5, (element.height || node.height()) * scaleY),
        rotation: node.rotation(),
      };

      if (element.type === "ellipse") {
        updatedProps.radiusX = updatedProps.width / 2;
        updatedProps.radiusY = updatedProps.height / 2;
      }

      onChange(element.id, updatedProps);
    }
  };

  if (element.type === "group") {
    const groupChildren = elements.filter((el) => el.groupId === element.id);
    // Always get the latest mask from elements (not from groupChildren)
    const mask = elements.find(
      (el) => el.groupId === element.id && el.isClippingMask
    );

    if (!mask) return null;

    const clipFunc = (ctx) => {
      ctx.beginPath();
      if (mask.type === "rect" || mask.type === "square") {
        ctx.rect(mask.x, mask.y, mask.width, mask.height);
      } else if (mask.type === "circle") {
        ctx.arc(mask.x, mask.y, mask.radius, 0, Math.PI * 2);
      } else if (mask.type === "polygon") {
        const sides = mask.sides;
        const radius = mask.radius ?? 100;
        const centerX = mask.x;
        const centerY = mask.y;
        ctx.moveTo(
          centerX + radius * Math.cos(0),
          centerY + radius * Math.sin(0)
        );
        for (let i = 1; i <= sides; i++) {
          const angle = (i * 2 * Math.PI) / sides;
          ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
          );
        }
        ctx.closePath();
      } else if (mask.type === "star") {
        const points = mask.numPoints;
        const outerRadius = mask.outerRadius;
        const innerRadius = mask.innerRadius;
        const centerX = mask.x;
        const centerY = mask.y;
        ctx.moveTo(centerX, centerY - outerRadius);
        for (let i = 0; i < points; i++) {
          const outerAngle = (i * 2 * Math.PI) / points - Math.PI / 2;
          const innerAngle = outerAngle + Math.PI / points;
          ctx.lineTo(
            centerX + outerRadius * Math.cos(outerAngle),
            centerY + outerRadius * Math.sin(outerAngle)
          );
          ctx.lineTo(
            centerX + innerRadius * Math.cos(innerAngle),
            centerY + innerRadius * Math.sin(innerAngle)
          );
        }
        ctx.closePath();
      } else if (mask.type === "arc") {
        const centerX = mask.x;
        const centerY = mask.y;
        const innerRadius = mask.innerRadius;
        const outerRadius = mask.outerRadius;
        const angle = mask.angle;

        ctx.arc(
          centerX,
          centerY,
          outerRadius,
          0,
          (angle * Math.PI) / 180,
          false
        );
        ctx.arc(
          centerX,
          centerY,
          innerRadius,
          (angle * Math.PI) / 180,
          0,
          true
        );
        ctx.closePath();
      } else if (mask.type === "ellipse") {
        const centerX = mask.x;
        const centerY = mask.y;
        const radiusX = mask.radiusX;
        const radiusY = mask.radiusY;

        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
      } else if (mask.type === "pen") {
        const points = mask.points;
        if (points && points.length > 3) {
          ctx.moveTo(points[0], points[1]);
          for (let i = 2; i < points.length - 2; i += 2) {
            const xc = (points[i] + points[i + 2]) / 2;
            const yc = (points[i + 1] + points[i + 3]) / 2;
            ctx.quadraticCurveTo(points[i], points[i + 1], xc, yc);
          }
          // last segment
          ctx.lineTo(points[points.length - 2], points[points.length - 1]);

          if (mask.isClosed) {
            ctx.closePath();
          }
        }
      }
      ctx.clip();
    };

    return (
      <>
        <Group
          ref={shapeRef}
          {...element}
          draggable={mode === "edit" && isSelected}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onClick={(e) => {
            onSelect(element, e);
            e.cancelBubble = true;
          }}
          onTap={(e) => {
            onSelect(element, e);
            e.cancelBubble = true;
          }}
          onContextMenu={(e) => onContextMenu(e, element.id)}
          clipFunc={clipFunc}
        >
          {groupChildren.map((child) => (
            <Shape
              key={child.id}
              ref={child.isClippingMask ? maskRef : undefined}
              shapeProps={child}
              onSelect={() => onSelect(element)}
              onContextMenu={onContextMenu}
              mode={mode}
            />
          ))}
        </Group>
        {mode === "edit" && isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 5 || newBox.height < 5) return oldBox;
              return newBox;
            }}
            nodes={maskRef.current ? [maskRef.current] : []}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Shape
        ref={shapeRef}
        shapeProps={{
          ...element,
          draggable: mode === "edit" && isSelected,
          onDragEnd: handleDragEnd,
          onTransformEnd: handleTransformEnd,
          opacity: element.opacity,
          onPointDrag: handlePointDrag,
          isSelected: isSelected,
          onRemovePoint: onRemovePoint,
        }}
        onSelect={onSelect}
        onContextMenu={onContextMenu}
        mode={mode}
      />
      {mode === "edit" && isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};

const Canvas = ({
  elements,
  selectedElement,
  setSelectedElement,
  updateElement,
  stageRef,
  onContextMenu,
  canvasBackgroundColor,
  currentTool,
  onAddPoint,
  onRemovePoint,
  mode,
}) => {
  const handleStageClick = (e) => {
    if (mode === "edit") {
      if (
        e.target.name() === "canvas-background" ||
        e.target.nodeType === "Stage"
      ) {
        if (currentTool === "pen") {
          const pointerPosition = e.target.getStage().getPointerPosition();
          onAddPoint(pointerPosition);
        } else {
          setSelectedElement(null);
        }
      }
    }
  };

  const topLevelElements = elements.filter((el) => !el.groupId);

  return (
    <Stage
      width={600}
      height={600}
      onClick={handleStageClick}
      onTap={handleStageClick}
      onContextMenu={(e) => {
        let event = e;
        if (e?.evt) {
          event = e?.evt;
        }
        event.preventDefault();
        if (e.target !== e.target.getStage()) {
          onContextMenu(e, e.target.attrs.id);
        }
      }}
      ref={stageRef}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={600}
          height={600}
          fill={canvasBackgroundColor}
          name="canvas-background"
        />
        {topLevelElements.map((element) => (
          <ElementRenderer
            key={element.id}
            element={element}
            elements={elements}
            isSelected={selectedElement && selectedElement.id === element.id}
            onSelect={setSelectedElement}
            onChange={updateElement}
            onContextMenu={onContextMenu}
            currentTool={currentTool}
            onAddPoint={onAddPoint}
            onRemovePoint={onRemovePoint}
            mode={mode}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
