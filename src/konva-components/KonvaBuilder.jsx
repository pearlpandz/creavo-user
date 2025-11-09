import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import LayersPanel from "./LayersPanel";
import ContextMenu from "./ContextMenu";
import "./KonvaBuilder.css";
import { saveAs } from "file-saver";
import EditorTour from "../components/EditorTour"


function KonvaBuilder(props) {
  const { elements, setElements, handleSave, mode = "view", stageRef, templateObj,
    setTemplateObj } = props;
  const [selectedElement, setSelectedElement] = useState(null);
  const [showLayersPanel, setShowLayersPanel] = useState(mode === "edit");
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#ffffff");
  const [currentTool, setCurrentTool] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedElementsForClipping, setSelectedElementsForClipping] =
    useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);



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
  const actualType = props.mediaType === "gif" ? "gif" : "image";

  newElement = {
    ...baseProps,
    src: props.selectedImg || "https://frame-service.creavo.in/uploads/placeholder-image.jpg",
    width: 600,
    height: 600,
    x: 0,
    y: 0,
    mediaType: props.mediaType || "image",
    type: actualType,
    name: "frame-image",
    draggable: false,
    listening: false,
    zIndex: -1,
  };
} else if (type === "gif") {
  newElement = {
    ...baseProps,
    src: "https://media.giphy.com/media/3o7bu3hilQ0Q0Q0Q0/giphy.gif",
    width: 150,
    height: 150,
    mediaType: "gif", // ← ADD THIS
  };
} else if (type === "video") {
      newElement = {
        ...baseProps,
        src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        width: 320,
        height: 180,
        isPlaying: false,
        mediaType: "video",
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
  const hasVideo = elements.some(el => el.type === "video");

  if (hasVideo) {
    downloadAsVideo(); // Use the same video exporter
  } else {
    // Old PNG export
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `creavo-design-${Date.now()}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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

  

const downloadAsVideo = async () => {
  if (!stageRef.current) return;

  setIsExporting(true);
  setProgress(0);

  const stage = stageRef.current;
  const WIDTH = 1080;
  const HEIGHT = 1080;
  const scale = WIDTH / stage.width();

  // Clone stage for export
  const clonedStage = stage.clone();
  clonedStage.width(WIDTH);
  clonedStage.height(HEIGHT);
  clonedStage.scale({ x: scale, y: scale });

  // Find all video nodes
  const videoNodes = stage.find("Image").filter(node => {
    const img = node.image();
    return img && img.tagName === "VIDEO";
  });

  if (videoNodes.length === 0) {
    alert("No video found!");
    setIsExporting(false);
    return;
  }

  // UNLOCK AUDIO: Play all videos on user click (this is the magic)
  await Promise.all(
    videoNodes.map(node => {
      const v = node.image();
      v.muted = false;
      v.currentTime = 0;
      return v.play().catch(() => {});
    })
  );

  console.log("Audio unlocked! Starting recording in 600ms...");

  // Wait a bit then start recording
  setTimeout(() => startRecording(clonedStage, videoNodes), 600);
};

const startRecording = async (clonedStage, videoNodes) => {
  const WIDTH = 1080;
  const HEIGHT = 1080;

  // Create fresh video elements for recording
  const videoElements = videoNodes.map(origNode => {
    const origVideo = origNode.image();
    const v = document.createElement("video");
    v.src = origVideo.currentSrc || origVideo.src;
    v.crossOrigin = "anonymous";
    v.muted = false;
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";
    v.currentTime = 0;

    const cloneNode = clonedStage.findOne(`#${origNode.id()}`);
    if (cloneNode) cloneNode.image(v);
    return v;
  });

  // Wait for videos to be ready
  await Promise.all(
    videoElements.map(v => new Promise(r => {
      if (v.readyState >= 2) r();
      else v.onloadedmetadata = r;
    }))
  );

  let maxDuration = 5;
  videoElements.forEach(v => {
    if (v.duration && v.duration > maxDuration) maxDuration = v.duration;
  });

  const offscreen = document.createElement("canvas");
  offscreen.width = WIDTH;
  offscreen.height = HEIGHT;
  const ctx = offscreen.getContext("2d");

  const canvasStream = offscreen.captureStream(30);

  // Audio mixing
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") await audioContext.resume();

  const destination = audioContext.createMediaStreamDestination();
  let hasAudio = false;

  videoElements.forEach(v => {
    try {
      const source = audioContext.createMediaElementSource(v);
      source.connect(destination);
      hasAudio = true;
    } catch (e) {
      console.warn("Audio source failed", e);
    }
  });

  const finalStream = new MediaStream();
  canvasStream.getVideoTracks().forEach(t => finalStream.addTrack(t));
  if (hasAudio) destination.stream.getAudioTracks().forEach(t => finalStream.addTrack(t));

  let recorder;
  try {
    recorder = new MediaRecorder(finalStream, { mimeType: "video/mp4;codecs=avc1.42E01E,mp4a.40.2" });
  } catch {
    recorder = new MediaRecorder(finalStream, { mimeType: "video/webm;codecs=vp9,opus" });
  }

  const chunks = [];
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const ext = recorder.mimeType.includes("mp4") ? "mp4" : "webm";
    saveAs(new Blob(chunks, { type: recorder.mimeType }), `creavo-video-${Date.now()}.${ext}`);

    // Cleanup
    clonedStage.destroy();
    videoElements.forEach(v => { v.pause(); v.src = ""; });
    finalStream.getTracks().forEach(t => t.stop());
    audioContext.close();
    setIsExporting(false);
    setProgress(100);
  };

  recorder.start();
  videoElements.forEach(v => v.play().catch(() => {}));

  const startTime = performance.now();
  const render = (ts) => {
    const elapsed = (ts - startTime) / 1000;
    if (elapsed >= maxDuration) {
      recorder.stop();
      return;
    }

    setProgress(Math.min((elapsed / maxDuration) * 100, 99));

    ctx.fillStyle = canvasBackgroundColor;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    clonedStage.draw();
    ctx.drawImage(clonedStage.toCanvas(), 0, 0, WIDTH, HEIGHT);

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};


  return (
    <>
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
          <div class="download-button" style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
  onClick={() => {
  // console.log("ELEMENTS:", elements);
  // console.log("HAS VIDEO?", elements.some(el => el.type === "video"));
  // console.log("HAS mediaType video?", elements.some(el => el.mediaType === "video"));
  
  const hasVideo = elements.some(el => el.type === "video" || el.mediaType === "video");
  console.log("FINAL HAS VIDEO:", hasVideo);

  if (hasVideo) {
    downloadAsVideo();
  } else {
    // PNG fallback
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `creavo-design-${Date.now()}.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}}
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
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    height="28" 
    viewBox="0 0 24 24" 
    width="28" 
    fill="#fff"
  >
    <path d="M5 20h14v-2H5v2zm7-18c-1.1 0-2 .9-2 2v8.59l-2.29-2.3a.996.996 0 1 0-1.41 1.41l4 4c.39.39 1.02.39 1.41 0l4-4a.996.996 0 1 0-1.41-1.41L13 12.59V4c0-1.1-.9-2-2-2z" />
  </svg>
  {elements.some(el => el.type === "video" || el.mediaType === "video") 
  ? "Download MP4 Video" 
  : "Download PNG Image"}
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

      {isExporting && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      zIndex: 9999,
      color: "#fff",
      fontSize: "20px",
      fontWeight: 600,
    }}
  >
    <p style={{ marginBottom: 20 }}>Exporting Video... {Math.round(progress)}%</p>

    <div
      style={{
        width: "60%",
        maxWidth: 500,
        height: 20,
        background: "rgba(255,255,255,0.2)",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: `linear-gradient(90deg, #8CA2FF, #FF87C5)`,
          transition: "width 0.2s ease-out",
        }}
      />
    </div>
  </div>
)}
    </div>
    <EditorTour />
    </>
  );
}

export default KonvaBuilder;
