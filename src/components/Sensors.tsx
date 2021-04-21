import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { Components } from "@vertexvis/viewer";
import { useRecoilState, useRecoilValue } from "recoil";
import { useKeyListener } from "../lib/key-listener";
import { flyToSuppliedId } from "../lib/scene-camera";
import {
  applyAndShowBySuppliedIds,
  hideBySuppliedId,
  showAndClearAll,
} from "../lib/scene-items";
import {
  sensorState,
  shownSensorsState,
  timeSeriesDataState,
  timestampState,
} from "../lib/state";
import { formatValue } from "../lib/time-series";

interface Props {
  readonly viewer: Components.VertexViewer | null;
}

export function Sensors({ viewer }: Props): JSX.Element {
  const keys = useKeyListener();
  const tsd = useRecoilValue(timeSeriesDataState);
  const timestamp = useRecoilValue(timestampState);
  const [shown, setShown] = useRecoilState(shownSensorsState);
  const [sensor, setSensor] = useRecoilState(sensorState);

  async function applyAndShowOrHideBySensorId(
    id: string,
    apply: boolean,
    all: boolean
  ): Promise<void> {
    const meta = tsd.sensors[id].meta;
    const color = meta.tsData[timestamp].color;
    const suppliedIds = meta.itemSuppliedIds;

    await (apply
      ? applyAndShowBySuppliedIds({
          all,
          group: { color, suppliedIds },
          viewer,
        })
      : hideBySuppliedId({ suppliedIds, viewer }));
  }

  return tsd.sensorsMeta.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small">
        <TableBody>
          {tsd.sensorsMeta.map((s) => {
            const isSelected = s.id === sensor;
            const td = s.tsData[timestamp] ?? {
              color: "#fff",
              value: 0,
            };
            return (
              <TableRow
                key={s.id}
                onClick={() => {
                  setSensor(s.id);
                  if (shown.has(s.id) && keys.alt) {
                    flyToSuppliedId({
                      suppliedId: tsd.sensors[s.id].meta.itemSuppliedIds[0],
                      viewer,
                    });
                  }
                }}
                selected={isSelected}
              >
                <TableCell>
                  <Checkbox
                    color="primary"
                    checked={shown.has(s.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      const upd = new Set(shown);
                      e.target.checked ? upd.add(s.id) : upd.delete(s.id);
                      setShown(upd);

                      if (upd.size === 0) {
                        await showAndClearAll({ viewer });
                      } else {
                        await applyAndShowOrHideBySensorId(
                          s.id,
                          e.target.checked,
                          shown.size === 0 && upd.size === 1
                        );
                      }
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
