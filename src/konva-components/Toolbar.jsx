import {
  FaRegSquare,
  FaRegCircle,
  FaRegFolder,
  FaRegStar,
} from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import { LuRectangleHorizontal } from "react-icons/lu";
import { FiMinus } from "react-icons/fi";
import { FaPen } from "react-icons/fa";
import {
  IoImageOutline,
  IoLayersOutline,
  IoSaveOutline,
  IoTextOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import { GiFilmStrip } from "react-icons/gi";
import { LiaDrawPolygonSolid } from "react-icons/lia";
import { TbCircleDashed, TbOvalVertical } from "react-icons/tb";

const Toolbar = ({
  addElement,
  exportCanvas,
  saveTemplate,
  loadTemplate,
  toggleLayersPanel,
  mode,
}) => {
  const futureOptions = false;
  return (
    <div className="toolbar">
      {mode === "edit" && (
        <button onClick={() => addElement("rect")} title="Add Rectangle">
          <LuRectangleHorizontal />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("square")} title="Add Square">
          <FaRegSquare />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("circle")} title="Add Circle">
          <FaRegCircle />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("line")} title="Add Line">
          <FiMinus />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("pen")} title="Add Pen">
          <FaPen />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("polygon")} title="Add Polygon">
          <LiaDrawPolygonSolid />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("star")} title="Add Star">
          <FaRegStar />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("arc")} title="Add Arc">
          <TbCircleDashed />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("ellipse")} title="Add Ellipse">
          <TbOvalVertical />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("text")} title="Add Text">
          <IoTextOutline />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={() => addElement("image")} title="Add Image">
          <IoImageOutline />
        </button>
      )}
      {futureOptions && mode === "edit" && (
        <button onClick={() => addElement("gif")} title="Add GIF">
          <GiFilmStrip />
        </button>
      )}
      {futureOptions && mode === "edit" && (
        <button onClick={() => addElement("video")} title="Add Video">
          <IoVideocamOutline />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={exportCanvas} title="Download PNG">
          <MdFileDownload />
        </button>
      )}
      {futureOptions && mode === "edit" && (
        <button onClick={saveTemplate} title="Save Template">
          <IoSaveOutline />
        </button>
      )}
      {futureOptions && mode === "edit" && (
        <button onClick={loadTemplate} title="Load Template">
          <FaRegFolder />
        </button>
      )}
      {mode === "edit" && (
        <button onClick={toggleLayersPanel} title="Toggle Layers Panel">
          <IoLayersOutline />
        </button>
      )}
    </div>
  );
};

export default Toolbar;
