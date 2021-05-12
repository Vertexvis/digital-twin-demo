import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { Properties } from "../lib/metadata";

export interface MetadataProps {
  readonly properties: Properties;
}

export function MetadataProperties({ properties }: MetadataProps): JSX.Element {
  const propKeys = Object.keys(properties);

  return propKeys.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small" style={{ whiteSpace: "nowrap" }}>
        <TableBody>
          {propKeys.map((k) => (
            <TableRow key={k}>
              <TableCell>{k}</TableCell>
              <TableCell>{properties[k]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Box mx={2} mb={2}>
      <Typography variant="body2">No data</Typography>
    </Box>
  );
}
