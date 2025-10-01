import React, { useRef, useState } from "react";
import { Box, Tooltip } from "@mui/material";

const CircleColorPicker = ({
    size = '80px',
    defaultColor = "#3498db",
    onChange,
    tooltip = "Pick a color",
}) => {
    const [color, setColor] = useState(defaultColor);
    const inputRef = useRef(null);

    const handleCircleClick = () => {
        inputRef.current?.click();
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <>
            <Tooltip title={tooltip}>
                <Box
                    onClick={handleCircleClick}
                    sx={{
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: "divider",
                        backgroundColor: color,
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                            transform: "scale(1.1)",
                            boxShadow: 3,
                        },
                    }}
                />
            </Tooltip>
            <input
                ref={inputRef}
                type="color"
                value={color}
                onChange={handleColorChange}
                style={{ display: "none" }}
            />
        </>
    );
};

export default CircleColorPicker;
