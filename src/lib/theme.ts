import { createMuiTheme } from "@material-ui/core/styles";
import { blue, orange } from "@material-ui/core/colors";

export default createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: orange[500] },
  },
});
