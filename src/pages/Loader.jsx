import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

const Loader = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate('/')
        }, 2500);
    }, [])

    return (
        <Box
            minHeight="calc(100vh - 65px)"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            bgcolor="#fafbfc"
        >
            <Box
                mb={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {/* animation: "spin 1.2s linear infinite" */}
                <img
                    src="creavo.svg"
                    alt="Logo"
                    style={{
                        width: 100,
                        height: 100,
                    }}
                />
            </Box>
            <Typography
                variant="h6"
                color="text.primary"
                fontWeight={500}
                letterSpacing={0.5}
            >
                Updating preferences...
            </Typography>
        </Box>
    )
};

export default Loader;
