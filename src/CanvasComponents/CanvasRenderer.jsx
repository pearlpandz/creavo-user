import { Stage, Layer, Text, Group, Rect, Transformer } from "react-konva";
import { useEffect, useMemo, useRef, useState } from "react";
import CanvasText from "./CanvasText";
import CanvasRectangleWithText from "./CanvasRectangleWithText";
import CanvasRectangle from "./CanvasRectangle";
import CanvasCircle from "./CanvasCircle";
import CanvasImage from "./CanvasImage";
import CanvasClippedImage from "./CanvasClippedImage";
import MultiPointLine from "./CanvasMultiPointLine";
import CanvasPolygon from "./CanvasPolygon";
import CanvasWedge from "./CanvasWedge";

const CanvasRenderer = ({ theme, selectedImg, template, businessDetails }) => {
  const [elements, setElements] = useState([]);
  const stageRef = useRef(null);
  const isEditable = false;
  const transformerRef = useRef(null);

  useEffect(() => {
    const updatedElements = template?.elements?.map((el) => {
      if (el?.type === "clip-image" || el?.type === "image") {
        if (el?.slug === "{{logo}}") {
          return {
            ...el,
            src: businessDetails?.logo
          };
        }
        if (el?.slug === "{{frame-img}}") {
          return {
            ...el,
            src: selectedImg
          };
        }
        if (el?.slug === "{{product-img1}}") {
          return {
            ...el,
            src: businessDetails?.products[0]
          };
        }
        if (el?.slug === "{{product-img2}}") {
          return {
            ...el,
            src: businessDetails?.products[1]
          };
        }
        if (el?.slug === "{{product-img3}}") {
          return {
            ...el,
            src: businessDetails?.products[2]
          };
        }
        if (el?.slug === "{{political-supporter-1}}") {
          return {
            ...el,
            src: "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg"
          };
        }
        if (el?.slug === "{{political-supporter-2}}") {
          return {
            ...el,
            src: "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg"
          };
        }
        if (el?.slug === "{{political-supporter-3}}") {
          return {
            ...el,
            src: "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg"
          };
        }
        if (el?.slug === "{{leader-image}}") {
          return {
            ...el,
            src: "https://img.freepik.com/free-photo/bohemian-man-with-his-arms-crossed_1368-3542.jpg"
          };
        }
      }
      if (el?.type === "text-box") {
        let obj = {
          ...el,
          bgColor: theme?.bgColor ?? el?.bgColor,
          textColor: theme?.textColor ?? el?.textColor,
        }
        if (el?.slug === "{{companyName}}") {
          obj['content'] = businessDetails?.companyName;   
        }
        if (el?.slug === "{{description}}") {
          obj['content'] = businessDetails?.description;
        }
        if (el?.slug === "{{content}}") {
          obj['content'] = `${businessDetails?.mobileNumber1} | ${businessDetails?.mobileNumber2} | ${businessDetails?.email} | ${businessDetails?.website}`;
        }
        return obj;
      }
      if(el?.type === "text") {
        if (el?.slug === "{{leader-name}}") {
          return {
            ...el,
            content: 'Test name of leader',
            textColor: theme?.textColor ?? el?.textColor,
          };
        }
        if (el?.slug === "{{leader-designation}}") {
          return {
            ...el,
            content: 'Ward Councillor',
            textColor: theme?.textColor ?? el?.textColor,
          };
        }
      }
      return {
        ...el,
        bgColor: theme?.bgColor ?? el?.bgColor,
        textColor: theme?.textColor ?? el?.textColor,
      };
    });
    setElements(updatedElements);
  }, [theme, template, businessDetails, selectedImg]);

  const downloadCanvas = () => {
    const dataURL = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const {width, height} = useMemo(() => {
    if(template?.category === 'product') {
      return {width: 500, height: 700}
    } else {
      return {width: 600, height: 600}

    }
  }, [template]); 

  return (
    <>
      <Stage
        width={width}
        height={height}
        ref={stageRef}
      >
        <Layer>
          {/* Background rectangle (white) */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="white"
            listening={false} // Prevents it from capturing mouse events
          />

          {elements?.map(el => {
            if (el.type === "image") {
              return <CanvasImage key={el.id} element={el} isEditable={isEditable} />;
            } else if (el.type === "text") {
              return <CanvasText key={el.id} element={el} isEditable={isEditable} />;
            } else if (el.type === "text-box") {
              return <CanvasRectangleWithText key={el.id} element={el} isEditable={isEditable} />;
            } else if (el.type === "rectangle") {
              return <CanvasRectangle key={el.id} element={el} isEditable={isEditable} />;
            } else if (el.type === "circle") {
              return <CanvasCircle key={el.id} element={el} isEditable={isEditable} />;
            } else if (el.type === "clip-image") {
              return <CanvasClippedImage key={el.id} element={el} isEditable={isEditable} />
            } else if (["polygon", "triangle"].includes(el.type)) {
              return <CanvasPolygon key={el.id} element={el} isEditable={isEditable} />
            } else if (el.type === "wedge") {
              return <CanvasWedge key={el.id} element={el} isEditable={isEditable} />
            } else if (el.type === "MultiPointLine") {
              return (
                <>
                  <MultiPointLine key={el.id} {...el} />
                  <Transformer ref={transformerRef} rotateEnabled={false} />
                </>
              );
            }
            return null;
          })}
        </Layer>
      </Stage>

      <button onClick={downloadCanvas} className="download-button">
        Download Image
      </button>
    </>
  );
};

export default CanvasRenderer;
