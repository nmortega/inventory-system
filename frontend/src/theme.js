import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // ✅ This turns on dark mode
    primary: {
      main: "#90caf9", // Light blue
    },
    secondary: {
      main: "#f48fb1", // Pink
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
