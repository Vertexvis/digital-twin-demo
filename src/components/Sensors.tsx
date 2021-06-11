import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
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

export function Sensors({
  list,
  onCheck,
  onSelect,
  selected,
  selectedTs,
  shown,
}: SensorProps): JSX.Element {
  return list.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small">
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
    <NoData />
  );
}
