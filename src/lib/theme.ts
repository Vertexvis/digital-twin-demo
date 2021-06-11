import { blue, orange } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: orange[500] },
  },
});
