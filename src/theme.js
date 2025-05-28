// src/theme.js
import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      text: "#000",
    },
    secondary: {
      main: "#9c27b0",
      text: "#222",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
      text: "#fff",
    },
    secondary: {
      main: "#ce93d8",
      text: "#eee",
    },
  },
});
