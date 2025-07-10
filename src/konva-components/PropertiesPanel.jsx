import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa";

const fontFamilies = [
  "Arial",
  "Verdana",
  "Helvetica",
  "Tahoma",
  "Trebuchet MS",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Lucida Console",
  "Impact",
  "Comic Sans MS",
];

const ColorPickerInput = ({ color, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation(); // Stop event propagation
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  return (
    <div className="color-picker-input">
      <div className="color-swatch" onClick={handleClick}>
        <div style={{ backgroundColor: color }} className="color" />
      </div>
      {displayColorPicker ? (
        <div className="color-picker-popover">
          <div className="color-picker-cover" onClick={handleClose} />
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      ) : null}
    </div>
  );
};

const sliderStyle = { width: "100px", marginLeft: "10px" };
const sectionTitleStyle = {
  fontWeight: "bold",
  fontSize: "14px" /* Increased font size */,
  letterSpacing: "1px",
  margin: "20px 0 10px 0" /* Adjusted margin for more space */,
  border: "none",
  background: "none",
  padding: 0,
  color: "#222",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "8px" /* Increased bottom margin for more vertical space */,
  gap: "10px" /* Increased gap for more horizontal space */,
};

const labelStyle = {
  minWidth: "40px" /* Adjusted min-width for better alignment */,
  fontSize: "13px" /* Increased font size */,
  color: "#444",
};

const inputStyle = {
  width: "50px" /* Slightly increased width */,
  fontSize: "13px" /* Increased font size */,
  padding: "4px 6px" /* Increased padding */,
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const PropertiesPanel = ({
  selectedElement,
  updateElement,
  // canvasBackgroundColor,
  // setCanvasBackgroundColor,
  templateObj,
  setTemplateObj,
  mode,
}) => {
  const handleChange = (e) => {
    if (mode === "view") return;
    const { name, value, type } = e.target;
    if (type === "number") {
      updateElement(selectedElement.id, {
        [name]: e?.target?.valueAsNumber ?? Number(value),
      });
    } else {
      updateElement(selectedElement.id, { [name]: value });
    }
  };

  const handleColorChange = (color, name) => {
    if (mode === "view") return;
    updateElement(selectedElement.id, { [name]: color });
  };

  const handleTemplateChange = (e) => {
    if (mode === "view") return;
    const { name, value } = e.target;
    setTemplateObj((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="properties-panel"
      style={{
        fontFamily: "inherit",
        fontSize: "13px" /* Adjusted font size */,
        padding: "12px 10px" /* Adjusted padding */,
        borderRight: "1px solid #ddd",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* TEMPLATE PROPERTIES SECTION */}
      <div style={sectionTitleStyle}>TEMPLATE PROPERTIES</div>
      <div style={rowStyle}>
        <span style={{ ...labelStyle, minWidth: '100px' }}>TEMPLATE NAME</span>
        <input
          type="text"
          name="name"
          value={templateObj?.name}
          onChange={handleTemplateChange}
          style={{ ...inputStyle, width: "120px" }}
        />
      </div>
      <div style={rowStyle}>
        <span style={{ ...labelStyle, minWidth: '100px' }}>CATEGORY</span>
        <select
          name="category"
          value={templateObj?.category}
          onChange={handleTemplateChange}
          style={{ ...inputStyle, width: "120px" }}
        >
          <option value="regular">Regular</option>
          <option value="political">Political</option>
          <option value="product">Product</option>
        </select>
      </div>
      <div style={rowStyle}>
        <span style={{ ...labelStyle, minWidth: '100px' }}>STATE</span>
        <select
          name="state"
          value={templateObj?.state}
          onChange={handleTemplateChange}
          style={{ ...inputStyle, width: "120px" }}
        >
          <option value="draft">Draft</option>
          <option value="production">Production</option>
        </select>
      </div>

      {selectedElement && (
        <>
          {/* TRANSFORM SECTION */}
          <div style={sectionTitleStyle}>TRANSFORM</div>
          <div style={{ ...rowStyle, marginBottom: "2px" }}>
            <span style={labelStyle}>W</span>
            <input
              type="number"
              name="width"
              value={selectedElement.width}
              onChange={handleChange}
              style={inputStyle}
            />
            <span style={labelStyle}>X</span>
            <input
              type="number"
              name="x"
              value={selectedElement.x}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>H</span>
            <input
              type="number"
              name="height"
              value={selectedElement.height}
              onChange={handleChange}
              style={inputStyle}
            />
            <span style={labelStyle}>Y</span>
            <input
              type="number"
              name="y"
              value={selectedElement.y}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>ROTATION</span>
            <input
              type="number"
              name="rotation"
              value={selectedElement.rotation || 0}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* APPEARANCE SECTION */}
          <div style={sectionTitleStyle}>APPEARANCE</div>
          {selectedElement.type === "text" && (
            <>
              <div style={rowStyle}>
                <span style={labelStyle}>FONT SIZE</span>
                <input
                  type="number"
                  name="fontSize"
                  value={selectedElement.fontSize}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>PADDING</span>
                <input
                  type="number"
                  name="padding"
                  value={selectedElement.padding}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>FONT FAMILY</span>
                <select
                  name="fontFamily"
                  value={selectedElement.fontFamily}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: "120px" }}
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>LINE HEIGHT</span>
                <input
                  type="number"
                  name="lineHeight"
                  value={selectedElement.lineHeight}
                  onChange={handleChange}
                  style={inputStyle}
                  step="0.1"
                />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>TEXT STYLE</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    style={{
                      ...inputStyle,
                      width: "auto",
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedElement.fontWeight === "bold" ? "#eee" : "#fff",
                    }}
                    onClick={() =>
                      updateElement(selectedElement.id, {
                        fontWeight:
                          selectedElement.fontWeight === "bold"
                            ? "normal"
                            : "bold",
                      })
                    }
                  >
                    <FaBold />
                  </button>
                  <button
                    style={{
                      ...inputStyle,
                      width: "auto",
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedElement.fontStyle === "italic"
                          ? "#eee"
                          : "#fff",
                    }}
                    onClick={() =>
                      updateElement(selectedElement.id, {
                        fontStyle:
                          selectedElement.fontStyle === "italic"
                            ? "normal"
                            : "italic",
                      })
                    }
                  >
                    <FaItalic />
                  </button>
                  <button
                    style={{
                      ...inputStyle,
                      width: "auto",
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedElement.textDecoration === "underline"
                          ? "#eee"
                          : "#fff",
                    }}
                    onClick={() =>
                      updateElement(selectedElement.id, {
                        textDecoration:
                          selectedElement.textDecoration === "underline"
                            ? "none"
                            : "underline",
                      })
                    }
                  >
                    <FaUnderline />
                  </button>
                  <button
                    style={{
                      ...inputStyle,
                      width: "auto",
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedElement.textDecoration === "line-through"
                          ? "#eee"
                          : "#fff",
                    }}
                    onClick={() =>
                      updateElement(selectedElement.id, {
                        textDecoration:
                          selectedElement.textDecoration === "line-through"
                            ? "none"
                            : "line-through",
                      })
                    }
                  >
                    <FaStrikethrough />
                  </button>
                </div>
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>ALIGNMENT</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    style={{
                      ...inputStyle,
                      width: "auto",
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedElement.textAlign === "left" ? "#eee" : "#fff",
                    }}
                    onClick={() =>
                      updateElement(selectedElement.id, { textAlign: "left" })
                    }
                  >
                    <FaAlignLeft />
                  </button>
                  <button
                    style={{
                      ...inputStyle,
                      width: "auto",
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedElement.textAlign === "center"
                          ? "#eee"
                          : "#fff",
                    }}
                    onClick={() =>
                      updateElement(selectedElement.id, { textAlign: "center" })
                    }
                  >
                    <FaAlignCenter />
                  </button>
                  <button
                    style={{
                      ...inputStyle,
                      width: "auto",
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedElement.textAlign === "right" ? "#eee" : "#fff",
                    }}
                    onClick={() =>
                      updateElement(selectedElement.id, { textAlign: "right" })
                    }
                  >
                    <FaAlignRight />
                  </button>
                  <button
                    style={{
                      ...inputStyle,
                      width: "auto",
                      padding: "4px 8px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedElement.textAlign === "justify"
                          ? "#eee"
                          : "#fff",
                    }}
                    onClick={() =>
                      updateElement(selectedElement.id, {
                        textAlign: "justify",
                      })
                    }
                  >
                    <FaAlignJustify />
                  </button>
                </div>
              </div>
            </>
          )}
          <div style={rowStyle}>
            <span style={labelStyle}>FILL</span>
            <ColorPickerInput
              color={selectedElement.fill}
              onChange={(color) => handleColorChange(color, "fill")}
            />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>STROKE</span>
            <ColorPickerInput
              color={selectedElement.stroke}
              onChange={(color) => handleColorChange(color, "stroke")}
            />
            <input
              type="number"
              name="strokeWidth"
              value={selectedElement.strokeWidth}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>COLOR</span>
            <ColorPickerInput
              color={selectedElement.color}
              onChange={(color) => handleColorChange(color, "color")}
            />
          </div>
          {(selectedElement.type === "rect" ||
            selectedElement.type === "square") && (
              <>
                <div style={rowStyle}>
                  <span style={labelStyle}>RADIUS</span>
                  <span
                    style={{
                      fontSize: "13px" /* Updated font size */,
                      color: "#888",
                      marginLeft: "8px",
                      flexShrink: 0,
                    }}
                  >
                    TL
                  </span>
                  <input
                    type="number"
                    name="cornerRadiusTopLeft"
                    value={selectedElement.cornerRadiusTopLeft || 0}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                  <span
                    style={{
                      fontSize: "13px" /* Updated font size */,
                      color: "#888",
                      flexShrink: 0,
                    }}
                  >
                    TR
                  </span>
                  <input
                    type="number"
                    name="cornerRadiusTopRight"
                    value={selectedElement.cornerRadiusTopRight || 0}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={rowStyle}>
                  <span style={{ minWidth: "40px" }}></span>
                  <span
                    style={{
                      fontSize: "13px" /* Updated font size */,
                      color: "#888",
                      marginLeft: "8px",
                      flexShrink: 0,
                    }}
                  >
                    BL
                  </span>
                  <input
                    type="number"
                    name="cornerRadiusBottomLeft"
                    value={selectedElement.cornerRadiusBottomLeft || 0}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                  <span
                    style={{
                      fontSize: "13px" /* Updated font size */,
                      color: "#888",
                      flexShrink: 0,
                    }}
                  >
                    BR
                  </span>
                  <input
                    type="number"
                    name="cornerRadiusBottomRight"
                    value={selectedElement.cornerRadiusBottomRight || 0}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </>
            )}
          <div style={rowStyle}>
            <span style={labelStyle}>OPACITY</span>
            <input
              type="range"
              name="opacity"
              min="0"
              max="1"
              step="0.01"
              value={selectedElement.opacity}
              onChange={handleChange}
              style={sliderStyle}
            />
            <span
              style={{
                fontSize: "13px" /* Updated font size */,
                minWidth: "28px",
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {selectedElement.opacity}
            </span>
          </div>

          {/* ATTRIBUTES SECTION */}
          <div style={sectionTitleStyle}>ATTRIBUTES</div>
          {selectedElement.type === "text" && (
            <>
              <div style={rowStyle}>
                <span style={labelStyle}>CONTENT</span>
                <input
                  type="text"
                  name="text"
                  value={selectedElement.text}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: "120px" }}
                />
              </div>
            </>
          )}
          <div style={rowStyle}>
            <span style={labelStyle}>SLUG</span>
            <input
              type="text"
              name="slug"
              value={selectedElement.slug || ""}
              onChange={handleChange}
              style={{ ...inputStyle, width: "120px" }}
            />
          </div>

          {selectedElement.type === "star" && (
            <>
              <div style={sectionTitleStyle}>STAR PROPERTIES</div>
              <div style={rowStyle}>
                <span style={labelStyle}>SPIKES</span>
                <input
                  type="number"
                  name="numPoints"
                  value={selectedElement.numPoints}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>INNER RADIUS</span>
                <input
                  type="number"
                  name="innerRadius"
                  value={selectedElement.innerRadius}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>OUTER RADIUS</span>
                <input
                  type="number"
                  name="outerRadius"
                  value={selectedElement.outerRadius}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {selectedElement.type === "arc" && (
            <>
              <div style={sectionTitleStyle}>ARC PROPERTIES</div>
              <div style={rowStyle}>
                <span style={labelStyle}>ANGLE</span>
                <input
                  type="range"
                  name="angle"
                  min="0"
                  max="360"
                  step="1"
                  value={selectedElement.angle}
                  onChange={handleChange}
                  style={sliderStyle}
                />
                <span
                  style={{
                    fontSize: "13px",
                    minWidth: "28px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {selectedElement.angle}
                </span>
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>INNER RADIUS</span>
                <input
                  type="range"
                  name="innerRadius"
                  min="0"
                  max="200"
                  step="1"
                  value={selectedElement.innerRadius}
                  onChange={handleChange}
                  style={sliderStyle}
                />
                <span
                  style={{
                    fontSize: "13px",
                    minWidth: "28px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {selectedElement.innerRadius}
                </span>
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>OUTER RADIUS</span>
                <input
                  type="range"
                  name="outerRadius"
                  min="0"
                  max="200"
                  step="1"
                  value={selectedElement.outerRadius}
                  onChange={handleChange}
                  style={sliderStyle}
                />
                <span
                  style={{
                    fontSize: "13px",
                    minWidth: "28px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {selectedElement.outerRadius}
                </span>
              </div>
            </>
          )}

          {selectedElement.type === "ellipse" && (
            <>
              <div style={sectionTitleStyle}>ELLIPSE PROPERTIES</div>
              <div style={rowStyle}>
                <span style={labelStyle}>RADIUS X</span>
                <input
                  type="number"
                  name="radiusX"
                  value={selectedElement.radiusX}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>RADIUS Y</span>
                <input
                  type="number"
                  name="radiusY"
                  value={selectedElement.radiusY}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {selectedElement.type === "polygon" && (
            <>
              <div style={sectionTitleStyle}>POLYGON PROPERTIES</div>
              <div style={rowStyle}>
                <span style={labelStyle}>SIDES</span>
                <input
                  type="number"
                  name="sides"
                  value={selectedElement.sides}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>
            </>
          )}

          {selectedElement.type === "pen" && (
            <>
              <div style={sectionTitleStyle}>PEN PROPERTIES</div>
              <div style={rowStyle}>
                <span style={labelStyle}>CLOSED</span>
                <input
                  type="checkbox"
                  name="isClosed"
                  checked={selectedElement.isClosed || false}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      isClosed: e.target.checked,
                    })
                  }
                />
              </div>
              {/* Bezier properties will go here */}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesPanel;