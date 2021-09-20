import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

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
    <Box mb={2}>
      <TableContainer>
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
                      sx={{
                        backgroundColor: td.color,
                        borderRadius: 2,
                        height: "1rem",
                        width: "1rem",
                      }}
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
