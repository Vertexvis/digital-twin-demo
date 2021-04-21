import Box from "@material-ui/core/Box";
import ErrorTwoToneIcon from "@material-ui/icons/ErrorTwoTone";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import WarningTwoToneIcon from "@material-ui/icons/WarningTwoTone";
import { useRecoilState } from "recoil";
import { Faults as FaultsList } from "../lib/time-series";
import theme from "../lib/theme";
import { timestampState } from "../lib/state";

export function Faults(): JSX.Element {
  const [ts, setTs] = useRecoilState(timestampState);

  return FaultsList.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Fault</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {FaultsList.map((f) => {
            const isSelected = f.timestamp === ts;
            return (
              <TableRow
                key={f.id}
                onClick={() => setTs(f.timestamp)}
                selected={isSelected}
              >
                <TableCell>
                  {f.severity === "warn" ? (
                    <WarningTwoToneIcon
                      style={{ color: theme.palette.warning.light }}
                    />
                  ) : (
                    <ErrorTwoToneIcon
                      style={{ color: theme.palette.error.light }}
                    />
                  )}
                </TableCell>
                <TableCell>{f.title}</TableCell>
                <TableCell>{f.timestamp.substring(11, 19)}</TableCell>
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
