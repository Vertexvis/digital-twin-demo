import Box from "@material-ui/core/Box";
import LayersIcon from "@material-ui/icons/Layers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { useRecoilState } from "recoil";
import { Assets as AssetList } from "../lib/time-series";
import { assetState } from "../lib/state";

export function Assets(): JSX.Element {
  const [asset, setAsset] = useRecoilState(assetState);

  return AssetList.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small">
        <TableBody>
          {AssetList.map((a) => {
            const isSelected = a === asset;
            return (
              <TableRow
                key={a}
                onClick={() => setAsset(a)}
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
