import { createMuiTheme } from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";
import blue from "@material-ui/core/colors/blue";

export default createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: orange[500] },
  },
});
