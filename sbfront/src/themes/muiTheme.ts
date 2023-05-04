import { createTheme } from "@mui/material";
import theme from "./themes";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: theme.accent,
    },
    secondary: {
      main: theme.sc,
    },
    error: {
      main: theme.red,
    },
    background: {
      default: theme.bg,
    },
  },
});

export default muiTheme;
