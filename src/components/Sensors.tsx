import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

import { formatValue, SensorMeta } from "../lib/time-series";
import { NoData } from "./NoData";

export interface SensorProps {
  readonly list: SensorMeta[];
  readonly onCheck: (sensorId: string, checked: boolean) => Promise<void>;
  readonly onSelect: (sensorId: string) => Promise<void>;
  readonly selected: string;
  readonly selectedTs: string;
  readonly shown: Set<string>;
}

const useStyles = makeStyles(() => ({ root: { overflowX: "hidden" } }));

export function Sensors({
  list,
  onCheck,
  onSelect,
  selected,
  selectedTs,
  shown,
}: SensorProps): JSX.Element {
  const { root } = useStyles();

  return list.length > 0 ? (
    <Box mb={2}>
      <TableContainer classes={{ root }}>
        <Table size="small">
          <TableBody>
            {list.map((s) => {
              const isSelected = s.id === selected;
              const td = s.tsData[selectedTs] ?? {
                color: "#fff",
                value: 0,
              };
              return (
                <TableRow
                  key={s.id}
                  onClick={() => onSelect(s.id)}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
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
                  <TableCell>{s.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  ) : (
    <NoData />
  );
}
