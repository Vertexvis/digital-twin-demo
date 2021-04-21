import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { useRecoilValue } from "recoil";
import { timeSeriesDataState, timestampState } from "../lib/state";
import { formatValue } from "../lib/time-series";

interface Props {
  readonly shown: Set<string>;
  readonly onCheck: (id: string, checked: boolean) => Promise<void>;
  readonly onSelect: (id: string) => Promise<void>;
  readonly selected: string;
}

export function Sensors({
  shown,
  onCheck,
  onSelect,
  selected,
}: Props): JSX.Element {
  const tsd = useRecoilValue(timeSeriesDataState);
  const timestamp = useRecoilValue(timestampState);

  return tsd.sensorsMeta.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Value</TableCell>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tsd.sensorsMeta.map((s) => {
            const isSelected = s.id === selected;
            const td = s.tsData[timestamp] ?? {
              color: "#fff",
              value: 0,
            };
            return (
              <TableRow
                key={s.id}
                onClick={() => onSelect(s.id)}
                selected={isSelected}
              >
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={shown.has(s.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onCheck(s.id, e.target.checked)}
                  />
                </TableCell>
                <TableCell>{formatValue(td.value)}</TableCell>
                <TableCell>
                  <Box
                    borderRadius={2}
                    height={"1rem"}
                    style={{ backgroundColor: td.color }}
                    width={"1rem"}
                  ></Box>
                </TableCell>
                <TableCell>{s.id}</TableCell>
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
