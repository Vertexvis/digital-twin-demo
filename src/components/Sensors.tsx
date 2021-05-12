import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { formatValue, SensorMeta } from "../lib/time-series";

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
                onClick={() => {
                  onSelect(s.id);
                  // setSensor(s.id);
                  // if (shown.has(s.id) && keys.alt) {
                  //   flyToSuppliedId({
                  //     suppliedId: tsd.sensors[s.id].meta.itemSuppliedIds[0],
                  //     viewer,
                  //   });
                  // }
                }}
                selected={isSelected}
              >
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={shown.has(s.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      onCheck(s.id, e.target.checked);
                      // const upd = new Set(shown);
                      // e.target.checked ? upd.add(s.id) : upd.delete(s.id);
                      // setShown(upd);

                      // if (upd.size === 0) {
                      //   await showAndClearAll({ viewer });
                      // } else {
                      //   await applyAndShowOrHideBySensorId(
                      //     s.id,
                      //     e.target.checked,
                      //     shown.size === 0 && upd.size === 1
                      //   );
                      // }
                    }}
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
