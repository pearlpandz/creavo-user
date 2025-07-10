import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaCaretDown, FaCaretRight, FaLayerGroup, FaPlusCircle } from "react-icons/fa";
import { MdDragHandle } from "react-icons/md";

const getLayerIcon = (type) => {
  switch (type) {
    case "rect":
      return "⬛";
    case "square":
      return "🟦";
    case "circle":
    case "ellipse":
      return "🔵";
    case "line":
      return "➖";
    case "text":
      return "🅰️";
    case "image":
      return "🖼️";
    case "gif":
      return "🎞️";
    case "video":
      return "🎥";
    case "polygon":
      return "🔺";
    case "group":
      return "📁";
    case "star":
      return "⭐";
    case "pen":
      return "✍️";
    default:
      return "❓";
  }
};

const Layer = ({ element, index, children, updateElement, mode, ...props }) => {
  return (
    <Draggable key={element.id} draggableId={element.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            // Add z-index to the dragging item to ensure it's on top
            zIndex: snapshot.isDragging ? 9999 : "auto",
          }}
        >
          <li
            onClick={(e) => mode === "edit" && props.setSelectedElement(element, e)}
            onContextMenu={(e) => mode === "edit" && props.onContextMenu(e, element.id)}
            className={`
              layer-item
              ${props.selectedElement?.id === element.id ? "selected-layer" : ""
              }
              ${props.selectedElementsForClipping.includes(element.id)
                ? "multi-selected-layer"
                : ""
              }
              ${snapshot.isDragging ? "dragging" : ""}
            `}
          >
            <span className="drag-handle" {...(mode === "edit" ? provided.dragHandleProps : {})}>
              <MdDragHandle />
            </span>
            {element.type === "group" && (
              <span
                className="collapse-toggle"
                onClick={(e) => {
                  if (mode === "edit") {
                    e.stopPropagation(); // Prevent selecting the group when toggling
                    updateElement(element.id, {
                      isCollapsed: !element.isCollapsed,
                    });
                  }
                }}
              >
                {element.isCollapsed ? <FaCaretRight /> : <FaCaretDown />}
              </span>
            )}
            <span className="layer-icon">{getLayerIcon(element.type)}</span>
            {element.slug
              ? element.slug
              : `${element.type} -  ${element.id.substring(0, 4)}`}
            {element.isClippingMask && (
              <span className="clip-indicator"> (Mask)</span>
            )}
          </li>
          {children && !element.isCollapsed && (
            <Droppable droppableId={element.id} type="group-child">
              {(provided) => (
                <ul
                  className="nested-layers"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {children}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
};

const LayersPanel = ({
  elements,
  onReorderElements,
  updateElement,
  mode,
  ...props
}) => {
  const onDragEnd = (result) => {
    onReorderElements(result);
  };

  const renderLayer = (element, index) => {
    if (element.type === "group") {
      const children = elements.filter((e) => e.groupId === element.id);
      return (
        <Layer
          key={element.id}
          element={element}
          index={index}
          updateElement={updateElement}
          mode={mode}
          {...props}
        >
          {children.map((child, childIndex) => (
            <Layer
              key={child.id}
              element={child}
              index={childIndex}
              updateElement={updateElement}
              mode={mode}
              {...props}
            />
          ))}
        </Layer>
      );
    }

    if (!element.groupId) {
      return (
        <Layer key={element.id} element={element} index={index} mode={mode} {...props} />
      );
    }

    return null;
  };

  const topLevelElements = elements.filter((el) => !el.groupId);

  return (
    <div className="layers-panel">
      <h3>Layers</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="root" type="top-level">
          {(provided) => (
            <ul
              className="layers-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {topLevelElements.map((element, index) =>
                renderLayer(element, index)
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      {topLevelElements.length === 0 && (
        <div className="no-layers-message">
          <FaLayerGroup size={50} color="#ccc" />
          <p>No layers yet. Add elements from the toolbar!</p>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
