import React, { useRef, useState, useEffect } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";

const MoreColorPicker = ({
  defaultColor = "#000000",
  onChange,
}) => {
  const inputRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  useEffect(() => {
    setSelectedColor(defaultColor);
  }, [defaultColor]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    onChange?.(color);
  };

  return (
    <>
      <Tooltip title="Choose your preferred color">
        <Box
          onClick={handleClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            border: "1px dashed #ccc",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          {/* Selected color indicator */}
          <Box
            sx={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: selectedColor,
              border: "1px solid #999",
            }}
          />

          <PaletteOutlinedIcon fontSize="small" />
          <Typography variant="body2">More</Typography>
        </Box>
      </Tooltip>

      <input
        ref={inputRef}
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        style={{ display: "none" }}
      />
    </>
  );
};

export default MoreColorPicker;
