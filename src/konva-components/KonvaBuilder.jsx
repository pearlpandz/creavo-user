import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import LayersPanel from "./LayersPanel";
import ContextMenu from "./ContextMenu";
import "./KonvaBuilder.css";

function KonvaBuilder(props) {
  const { elements, setElements, handleSave, mode = "view", stageRef, templateObj,
    setTemplateObj, handleClick } = props;
  const [selectedElement, setSelectedElement] = useState(null);
  const [showLayersPanel, setShowLayersPanel] = useState(mode === "edit");
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#ffffff");
  const [currentTool, setCurrentTool] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedElementsForClipping, setSelectedElementsForClipping] =
    useState([]);

  const addElement = (type) => {
    if (mode === "view") return;
    const baseProps = {
      id: uuidv4(),
      type,
      x: 50,
      y: 50,
      stroke: "#000000",
      strokeWidth: 2,
      opacity: 100,
      slug: "",
    };

    let newElement;
    if (type === "pen") {
      newElement = {
        ...baseProps,
        points: [],
        fill: "#333333",
        stroke: "#000000",
        strokeWidth: 2,
        isClosed: false,
      };
      setCurrentTool("pen");
    } else if (type === "text") {
      newElement = {
        ...baseProps,
        text: "New Text",
        fill: "#333333",
        strokeWidth: 0, // for text stroke not required
        width: 200,
        height: 30,
        fontSize: 20,
        fontFamily: "Arial",
        lineHeight: 1.2,
        padding: 0,
        color: "#333333",
        fontWeight: "normal",
        fontStyle: "normal",
        textDecoration: [],
        textAlign: "left",
      };
    } else if (type === "image") {
      newElement = {
        ...baseProps,
        src: "https://frame-service.creavo.in/uploads/placeholder-image.jpg",
        width: 150,
        height: 150,
      };
    } else if (type === "gif") {
      newElement = {
        ...baseProps,
        src: "https://media.giphy.com/media/3o7bu3hilQ0Q0Q0Q0/giphy.gif",
        width: 150,
        height: 150,
      };
    } else if (type === "video") {
      newElement = {
        ...baseProps,
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        width: 320,
        height: 180,
        isPlaying: false,
      };
    } else if (type === "line") {
      newElement = {
        ...baseProps,
        points: [0, 0, 100, 0],
        fill: "#aabbcc",
        width: 100,
        height: 0,
      };
    } else if (type === "square") {
      newElement = {
        ...baseProps,
        fill: "#aabbcc",
        width: 100,
        height: 100,
        cornerRadiusTopLeft: 0,
        cornerRadiusTopRight: 0,
        cornerRadiusBottomLeft: 0,
        cornerRadiusBottomRight: 0,
      };
    } else if (type === "rect") {
      newElement = {
        ...baseProps,
        fill: "#aabbcc",
        width: 100,
        height: 100,
        cornerRadiusTopLeft: 0,
        cornerRadiusTopRight: 0,
        cornerRadiusBottomLeft: 0,
        cornerRadiusBottomRight: 0,
      };
    } else if (type === "polygon") {
      newElement = {
        ...baseProps,
        fill: "#aabbcc",
        sides: 6,
        radius: 100,
        width: 100,
        height: 100,
      };
    } else if (type === "star") {
      newElement = {
        ...baseProps,
        fill: "#aabbcc",
        numPoints: 5,
        outerRadius: 50,
        innerRadius: 15,
        width: 100,
        height: 100,
      };
    } else if (type === "arc") {
      newElement = {
        ...baseProps,
        fill: "#aabbcc",
        innerRadius: 30,
        outerRadius: 50,
        angle: 60,
        width: 100,
        height: 100,
      };
    } else if (type === "circle") {
      newElement = {
        ...baseProps,
        fill: "#aabbcc",
        radius: 50,
        width: 100,
        height: 100,
      };
    } else if (type === "ellipse") {
      newElement = {
        ...baseProps,
        fill: "#aabbcc",
        radiusX: 50,
        radiusY: 50,
        width: 100,
        height: 100,
      };
    } else {
      newElement = { ...baseProps, fill: "#aabbcc", width: 100, height: 100 };
    }
    setElements([...elements, newElement]);
    setSelectedElement(newElement);
  };

  const updateElement = (id, properties) => {
    if (mode === "view") return;
    setElements(
      elements.map((el) => {
        if (el.id === id) {
          const updatedEl = { ...el, ...properties };
          if (
            updatedEl.type === "line" &&
            (properties.width !== undefined || properties.height !== undefined)
          ) {
            updatedEl.points = [0, 0, updatedEl.width, updatedEl.height];
          } else if (
            updatedEl.type === "square" &&
            properties.width !== undefined
          ) {
            updatedEl.height = updatedEl.width;
            updatedEl.cornerRadiusTopLeft = el.cornerRadiusTopLeft;
            updatedEl.cornerRadiusTopRight = el.cornerRadiusTopRight;
            updatedEl.cornerRadiusBottomLeft = el.cornerRadiusBottomLeft;
            updatedEl.cornerRadiusBottomRight = el.cornerRadiusBottomRight;
          } else if (
            updatedEl.type === "polygon" &&
            properties.sides !== undefined
          ) {
            // No specific Konva property to update based on sides directly here,
            // Konva.RegularPolygon will use the 'sides' prop directly.
            // Ensure 'radius' is also passed if it's a property that affects rendering.
          }
          return updatedEl;
        }
        return el;
      })
    );
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement((prev) => ({ ...prev, ...properties }));
    }
  };

  const deleteElement = (idToDelete) => {
    if (mode === "view") return;
    setElements(elements.filter((el) => el.id !== idToDelete));
    if (selectedElement && selectedElement.id === idToDelete) {
      setSelectedElement(null);
    }
    setContextMenu(null);
  };

  const duplicateElement = (idToDuplicate) => {
    if (mode === "view") return;
    const elementToDuplicate = elements.find((el) => el.id === idToDuplicate);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: uuidv4(),
        x: elementToDuplicate.x + 10,
        y: elementToDuplicate.y + 10,
      };
      setElements([...elements, newElement]);
      setSelectedElement(newElement);
    }
    setContextMenu(null);
  };

  const applyClippingMask = () => {
    if (mode === "view") return;
    if (selectedElementsForClipping.length !== 2) return;

    const [id1, id2] = selectedElementsForClipping;
    const el1 = elements.find((e) => e.id === id1);
    const el2 = elements.find((e) => e.id === id2);

    const shape =
      el1.type !== "image" && el1.type !== "gif" && el1.type !== "video"
        ? el1
        : el2;
    const content = el1 === shape ? el2 : el1;

    if (!shape || !content) return;

    const groupId = uuidv4();
    const newGroup = {
      id: groupId,
      type: "group",
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
    };

    const updatedElements = elements.map((el) => {
      if (el.id === shape.id) {
        return {
          ...el,
          groupId: groupId,
          isClippingMask: true,
          // x and y adjustments for group
          x: el.x - newGroup.x,
          y: el.y - newGroup.y,
        };
      }
      if (el.id === content.id) {
        return {
          ...el,
          groupId: groupId,
          // x and y adjustments for group
          x: el.x - newGroup.x,
          y: el.y - newGroup.y,
        };
      }
      return el;
    });

    setElements([...updatedElements, newGroup]);
    setSelectedElementsForClipping([]);
    setContextMenu(null);
  };

  const releaseClippingMask = (elementId) => {
    if (mode === "view") return;
    const element = elements.find((el) => el.id === elementId);
    if (!element || !element.groupId) return;

    const groupId = element.groupId;
    const group = elements.find((el) => el.id === groupId);

    const updatedElements = elements
      .map((el) => {
        if (el.groupId === groupId) {
          const { groupId, isClippingMask, ...rest } = el;
          console.log(groupId, isClippingMask);
          return { ...rest, x: el.x + group.x, y: el.y + group.y };
        }
        return el;
      })
      .filter((el) => el.id !== groupId);

    setElements(updatedElements);
    setContextMenu(null);
  };

  const handleContextMenu = (e, elementId) => {
    let event = e;
    if (e?.evt) {
      event = e?.evt;
    }
    event.preventDefault();
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      elementId: elementId,
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleCanvasClick = () => {
    setContextMenu(null);
  };

  const handleSelectElement = (element, event) => {
    if (mode === "view") return;

    if (!element) {
      setSelectedElement(null);
      setSelectedElementsForClipping([]);
      return;
    }

    const isMultiSelect =
      event && (event.ctrlKey || event.metaKey || event.shiftKey);

    if (isMultiSelect) {
      setSelectedElementsForClipping((prev) => {
        if (prev.includes(element.id)) {
          // Deselect if already selected
          return prev.filter((id) => id !== element.id);
        } else {
          // Select if not already selected
          return [...prev, element.id];
        }
      });
    } else {
      // Single select: clear all previous and select current
      setSelectedElementsForClipping([element.id]);
    }
    setSelectedElement(element); // Always set the last clicked as the primary selected element
  };

  const onAddPoint = (pointerPosition) => {
    if (mode === "view") return;
    if (selectedElement && selectedElement.type === "pen") {
      const newPoints = [
        ...selectedElement.points,
        pointerPosition.x,
        pointerPosition.y,
      ];
      updateElement(selectedElement.id, { points: newPoints });
    } else {
      // If not in pen mode, just select the element
      setSelectedElement((prev) => {
        if (prev && prev.id === selectedElement.id) {
          return prev; // Already selected
        }
        return selectedElement; // Select the current element
      });
    }
  };

  const onRemovePoint = (indexToRemove) => {
    if (mode === "view") return;
    if (selectedElement && selectedElement.type === "pen") {
      const newPoints = selectedElement.points.filter(
        (_, index) => index / 2 !== indexToRemove
      );
      updateElement(selectedElement.id, { points: newPoints });
    }
  };

  const onReorderElements = (result) => {
    if (mode === "view") return;
    // eslint-disable-next-line no-unused-vars
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    const newElements = Array.from(elements);
    const draggedElement = newElements.find((el) => el.id === draggableId);

    if (!draggedElement) {
      return;
    }

    // Remove the dragged element from its original position
    const currentElements = newElements.filter((el) => el.id !== draggableId);

    // Update the groupId of the dragged element
    draggedElement.groupId =
      destination.droppableId === "root" ? undefined : destination.droppableId;

    let absoluteInsertIndex = 0;

    if (destination.droppableId === "root") {
      // If moving to root, find the correct absolute index among top-level elements
      const topLevelElements = currentElements.filter((el) => !el.groupId);
      if (destination.index < topLevelElements.length) {
        const elementBefore = topLevelElements[destination.index];
        absoluteInsertIndex = currentElements.indexOf(elementBefore);
      } else {
        // Insert at the end of top-level elements
        absoluteInsertIndex = currentElements.length;
      }
    } else {
      // If moving into a group, find the group element and its children
      const groupElement = currentElements.find(
        (el) => el.id === destination.droppableId
      );
      if (groupElement) {
        const groupIndex = currentElements.indexOf(groupElement);
        const groupChildren = currentElements.filter(
          (el) => el.groupId === destination.droppableId
        );

        if (destination.index < groupChildren.length) {
          const elementBefore = groupChildren[destination.index];
          absoluteInsertIndex = currentElements.indexOf(elementBefore);
        } else {
          // Insert at the end of the group's children
          absoluteInsertIndex = groupIndex + groupChildren.length + 1;
        }
      } else {
        // Fallback: if group not found, treat as top-level (shouldn't happen if droppableId is valid)
        const topLevelElements = currentElements.filter((el) => !el.groupId);
        if (destination.index < topLevelElements.length) {
          const elementBefore = topLevelElements[destination.index];
          absoluteInsertIndex = currentElements.indexOf(elementBefore);
        } else {
          absoluteInsertIndex = currentElements.length;
        }
      }
    }

    // Insert the dragged element at the calculated absolute index
    currentElements.splice(absoluteInsertIndex, 0, draggedElement);

    setElements(currentElements);
  };

  const exportCanvas = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveTemplate = () => {
    handleSave(elements);
  };

  const loadTemplate = () => {
    const template = prompt("Paste template JSON here:");
    try {
      const parsedTemplate = JSON.parse(template);
      setElements(parsedTemplate);
      setSelectedElement(null);
    } catch (e) {
      alert("Invalid JSON template!", e);
    }
  };

  const toggleLayersPanel = () => {
    setShowLayersPanel(!showLayersPanel);
  };

  return (
    <div className="konva-builder">
      <div className="main-container">
        {mode === "edit" && (
          <Toolbar
            addElement={addElement}
            exportCanvas={exportCanvas}
            saveTemplate={saveTemplate}
            loadTemplate={loadTemplate}
            toggleLayersPanel={toggleLayersPanel}
            mode={mode}
          />
        )}
        {mode === "edit" && showLayersPanel && (
          <LayersPanel
            elements={elements}
            selectedElement={selectedElement}
            setSelectedElement={handleSelectElement}
            onContextMenu={handleContextMenu}
            selectedElementsForClipping={selectedElementsForClipping}
            onReorderElements={onReorderElements}
            updateElement={updateElement}
            mode={mode}
          />
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Canvas
          elements={elements}
          selectedElement={selectedElement}
          setSelectedElement={handleSelectElement}
          updateElement={updateElement}
          stageRef={stageRef}
          onContextMenu={handleContextMenu}
          canvasBackgroundColor={canvasBackgroundColor}
          currentTool={currentTool}
          onAddPoint={onAddPoint}
          onRemovePoint={onRemovePoint}
          mode={mode}
        />
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={handleClick}
              style={{
                padding: '8px 16px',
                fontWeight: 'bold',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                justifyContent: 'center'
              }}
            >
              {/* Download Icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                fill="#fff"
                style={{ display: 'inline-block', verticalAlign: 'middle' }}
              >
                <path d="M5 20h14v-2H5v2zm7-18c-1.1 0-2 .9-2 2v8.59l-2.29-2.3a.996.996 0 1 0-1.41 1.41l4 4c.39.39 1.02.39 1.41 0l4-4a.996.996 0 1 0-1.41-1.41L13 12.59V4c0-1.1-.9-2-2-2z" />
              </svg>
              Download Image
            </button>
          </div>
        </div>
        {mode === "edit" && (
          <PropertiesPanel
            selectedElement={selectedElement}
            updateElement={updateElement}
            canvasBackgroundColor={canvasBackgroundColor}
            setCanvasBackgroundColor={setCanvasBackgroundColor}
            templateObj={templateObj}
            setTemplateObj={setTemplateObj}
            mode={mode}
          />
        )}
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          elementId={contextMenu.elementId}
          onDelete={() => deleteElement(contextMenu.elementId)}
          onDuplicate={() => duplicateElement(contextMenu.elementId)}
          onApplyClippingMask={applyClippingMask}
          onReleaseClippingMask={() =>
            releaseClippingMask(contextMenu.elementId)
          }
          canApplyClippingMask={selectedElementsForClipping.length === 2}
          isElementClipped={
            !!elements.find((el) => el.id === contextMenu.elementId)?.groupId
          }
          onClose={() => setContextMenu(null)}
          mode={mode}
        />
      )}
    </div>
  );
}

export default KonvaBuilder;
