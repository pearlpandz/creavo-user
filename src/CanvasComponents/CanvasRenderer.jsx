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
import placeholder from '/assets/placeholder.webp'
import Watermark from "./WaterMark";

const CanvasRenderer = ({ theme, selectedImg, template, profile }) => {
  const [elements, setElements] = useState([]);
  const stageRef = useRef(null);
  const isEditable = false;
  const transformerRef = useRef(null);
  const businessDetails = profile?.company_details ?? null;
  const politicalDetails = profile?.political ?? null;
  const productsDetails = useMemo(() => profile?.products ?? [], [profile?.products]);

  const showWatermark = useMemo(() => {
    return !profile?.license || profile?.day_downloads >= 3 || !profile?.is_verified;
  }, [profile?.license, profile?.day_downloads, profile?.is_verified]);

  useEffect(() => {
    const updatedElements = template?.elements?.map((el) => {
      if (el?.type === "clip-image" || el?.type === "image") {
        if (el?.slug === "{{logo}}") {
          return {
            ...el,
            src: businessDetails?.image
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
            src: productsDetails?.[0]?.image ?? placeholder
          };
        }
        if (el?.slug === "{{product-img2}}") {
          return {
            ...el,
            src: productsDetails?.[1]?.image ?? placeholder
          };
        }
        if (el?.slug === "{{product-img3}}") {
          return {
            ...el,
            src: productsDetails?.[2]?.image ?? placeholder
          };
        }
        if (el?.slug === "{{political-supporter-1}}") {
          return {
            ...el,
            src: politicalDetails?.supporters?.[0]?.image ?? placeholder
          };
        }
        if (el?.slug === "{{political-supporter-2}}") {
          return {
            ...el,
            src: politicalDetails?.supporters?.[1]?.image ?? placeholder
          };
        }
        if (el?.slug === "{{political-supporter-3}}") {
          return {
            ...el,
            src: politicalDetails?.supporters?.[2]?.image ?? placeholder
          };
        }
        if (el?.slug === "{{leader-image}}") {
          return {
            ...el,
            src: politicalDetails?.image ?? placeholder
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
          obj['content'] = businessDetails?.company_name;
        }
        if (el?.slug === "{{description}}") {
          obj['content'] = businessDetails?.description;
        }
        if (el?.slug === "{{content}}") {
          const concatWithPipe = (...values) => values.filter(Boolean).join(' | ');
          obj['content'] = concatWithPipe(
            businessDetails?.email,
            businessDetails?.primary_contact,
            businessDetails?.secondary_contact,
            businessDetails?.website,
            businessDetails?.address
          );
        }
        return obj;
      }
      if (el?.type === "text") {
        if (el?.slug === "{{leader-name}}") {
          return {
            ...el,
            content: politicalDetails?.leader_name,
            textColor: theme?.textColor ?? el?.textColor,
          };
        }
        if (el?.slug === "{{leader-designation}}") {
          return {
            ...el,
            content: politicalDetails?.leader_designation,
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
  }, [theme, template, businessDetails, selectedImg, productsDetails, politicalDetails]);

  const downloadCanvas = () => {
    const dataURL = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const { width, height } = useMemo(() => {
    if (template?.category === 'product') {
      return { width: 500, height: 700 }
    } else {
      return { width: 600, height: 600 }

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

          {showWatermark && <Watermark
            text="creavo.in"
            width={width}
            height={height}
            opacity={0.2}
            fontSize={32}
            rotation={0}
            gap={180}
          />}
        </Layer>
      </Stage>

      <button onClick={downloadCanvas} className="download-button">
        Download Image
      </button>
    </>
  );
};

export default CanvasRenderer;
