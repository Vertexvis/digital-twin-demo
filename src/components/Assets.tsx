import Box from "@material-ui/core/Box";
import LayersIcon from "@material-ui/icons/Layers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { Asset, Assets as AssetList } from "../lib/time-series";

export interface AssetProps {
  readonly selected: Asset;
  readonly onSelect: (asset: Asset) => void;
}

export function Assets({ selected, onSelect }: AssetProps): JSX.Element {
  return AssetList.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small">
        <TableBody>
          {AssetList.map((a) => {
            const isSelected = a === selected;
            return (
              <TableRow
                key={a}
                onClick={() => onSelect(a)}
                selected={isSelected}
              >
                <TableCell align="center">
                  <LayersIcon style={{ marginTop: "4px" }} color="action" />
                </TableCell>
                <TableCell>{a}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Box mx={2} mb={2}>
      <Typography variant="body2">No data</Typography>
    </Box>
  );
}
