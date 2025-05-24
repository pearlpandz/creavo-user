import { Stage, Layer, Text, Group, Rect } from "react-konva";
import { useEffect, useMemo, useRef, useState } from "react";
import CanvasText from "./CanvasText";
import CanvasRectangleWithText from "./CanvasRectangleWithText";
import CanvasRectangle from "./CanvasRectangle";
import CanvasCircle from "./CanvasCircle";
import CanvasImage from "./CanvasImage";
import CanvasClippedImage from "./CanvasClippedImage";

const CanvasRenderer = ({ theme, selectedImg, template, businessDetails }) => {
  const [elements, setElements] = useState([]);
  const stageRef = useRef(null);
  const isEditable = false;

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
            src: selectedImg?.urls?.small
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
        if (el?.slug === "{{companyName}}") {
          return {
            ...el,
            content: businessDetails?.companyName,
            color: theme?.background,
            textColor: theme?.color,
          };
        }
        if (el?.slug === "{{description}}") {
          return {
            ...el,
            content: businessDetails?.description,
            color: theme?.background,
            textColor: theme?.color,
          };
        }
        if (el?.slug === "{{content}}") {
          return {
            ...el,
            content: `${businessDetails?.mobileNumber1} | ${businessDetails?.mobileNumber2} | ${businessDetails?.email} | ${businessDetails?.website}`,
            color: theme?.background,
            textColor: theme?.color,
          };
        }
      }
      if(el?.type === "text") {
        if (el?.slug === "{{leader-name}}") {
          return {
            ...el,
            content: 'Test name of leader',
            textColor: theme?.color,
          };
        }
        if (el?.slug === "{{leader-designation}}") {
          return {
            ...el,
            content: 'Ward Councillor',
            textColor: theme?.color,
          };
        }
      }
      return {
        ...el,
        color: theme?.background,
        textColor: theme?.color,
      };
    });
    console.log(updatedElements);
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
