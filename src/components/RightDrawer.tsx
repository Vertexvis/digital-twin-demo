import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Drawer from "@material-ui/core/Drawer";
import ErrorTwoToneIcon from "@material-ui/icons/ErrorTwoTone";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import LayersIcon from "@material-ui/icons/Layers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import WarningTwoToneIcon from "@material-ui/icons/WarningTwoTone";
import React, { useState } from "react";
import { Properties } from "../lib/metadata";
import {
  Asset,
  FaultCode,
  formatValue,
  SensorMeta,
  SensorsToItemSuppliedIds,
} from "../lib/time-series";
import theme from "../lib/theme";
import { MetadataProperties } from "./MetadataProperties";
import { RightDrawerWidth } from "./Layout";

interface Props {
  readonly assets: {
    readonly list: string[];
    readonly onSelect: (asset: Asset) => Promise<void>;
    readonly selected: string;
  };
  readonly faults: {
    readonly list: FaultCode[];
    readonly onSelect: (timestamp: string) => Promise<void>;
    readonly selected?: string;
  };
  readonly properties: Properties;
  readonly selectedTs: string;
  readonly sensors: {
    readonly displayed: Set<string>;
    readonly list: SensorMeta[];
    readonly mapping?: SensorsToItemSuppliedIds;
    readonly onCheck: (id: string, checked: boolean) => Promise<void>;
    readonly onMappingChange: (
      mapping: SensorsToItemSuppliedIds
    ) => Promise<void>;
    readonly onSelect: (id: string) => Promise<void>;
    readonly selected: string;
  };
}

const useStyles = makeStyles(() => ({
  paper: {
    width: RightDrawerWidth,
  },
  title: {
    textTransform: "uppercase",
  },
}));

export function RightDrawer({
  assets,
  faults,
  properties,
  selectedTs,
  sensors,
}: Props): JSX.Element {
  const [mapping, setMapping] = useState(
    JSON.stringify(sensors.mapping, null, 2)
  );
  const { paper, title } = useStyles();

  return (
    <Drawer anchor="right" variant="permanent" classes={{ paper }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Sensors
          </Typography>
        </AccordionSummary>
        {sensors.list.length > 0 ? (
          <Box mb={2}>
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
                  {sensors.list.map((s) => {
                    const isSelected = s.id === sensors.selected;
                    const tsd = s.tsData[selectedTs] ?? {
                      color: "#fff",
                      value: 0,
                    };
                    return (
                      <TableRow
                        key={s.id}
                        onClick={() => sensors.onSelect(s.id)}
                        selected={isSelected}
                      >
                        <TableCell>
                          <Checkbox
                            color="primary"
                            checked={sensors.displayed.has(s.id)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              sensors.onCheck(s.id, e.target.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>{formatValue(tsd.value)}</TableCell>
                        <TableCell>
                          <Box
                            borderRadius={2}
                            height={"1rem"}
                            style={{ backgroundColor: tsd.color }}
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
          </Box>
        ) : (
          <Box mx={2} mb={2}>
            <Typography variant="body2">No data</Typography>
          </Box>
        )}
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Assets
          </Typography>
        </AccordionSummary>
        {assets.list.length > 0 ? (
          <Box mb={2}>
            <TableContainer>
              <Table padding="checkbox" size="small">
                <TableBody>
                  {assets.list.map((a) => {
                    const isSelected = a === assets.selected;
                    return (
                      <TableRow
                        key={a}
                        onClick={() => assets.onSelect(a as Asset)}
                        selected={isSelected}
                      >
                        <TableCell>
                          <LayersIcon />
                        </TableCell>
                        <TableCell>{a}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <Box mx={2} mb={2}>
            <Typography variant="body2">No data</Typography>
          </Box>
        )}
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Fault Codes
          </Typography>
        </AccordionSummary>
        {faults.list.length > 0 ? (
          <Box mb={2}>
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
                  {faults.list.map((f) => {
                    const isSelected = f.timestamp === faults.selected;
                    return (
                      <TableRow
                        key={f.id}
                        onClick={() => faults.onSelect(f.timestamp)}
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
          </Box>
        ) : (
          <Box mx={2} mb={2}>
            <Typography variant="body2">No data</Typography>
          </Box>
        )}
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Metadata Properties
          </Typography>
        </AccordionSummary>
        <MetadataProperties properties={properties} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Sensor Mapping
          </Typography>
        </AccordionSummary>
        <Box mx={2} mb={2}>
          <Box mb={2}>
            <TextField
              defaultValue={mapping}
              fullWidth
              multiline
              onChange={(e) => setMapping(e.target.value)}
              rowsMax={28}
              style={{
                fontFamily:
                  "Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace",
              }}
            />
          </Box>
          <Button
            onClick={() => {
              try {
                const upd: SensorsToItemSuppliedIds = JSON.parse(mapping);
                sensors.onMappingChange(upd);
              } catch (error) {
                // ignore
              }
            }}
            variant="contained"
          >
            Update Mapping
          </Button>
        </Box>
      </Accordion>
    </Drawer>
  );
}
