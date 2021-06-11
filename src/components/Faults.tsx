import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import ErrorTwoToneIcon from "@material-ui/icons/ErrorTwoTone";
import WarningTwoToneIcon from "@material-ui/icons/WarningTwoTone";

import theme from "../lib/theme";
import { Faults as FaultsList } from "../lib/time-series";
import { NoData } from "./NoData";

export interface FaultProps {
  readonly onSelect: (timestamp: string) => void;
  readonly selected: string;
}

export function Faults({ onSelect, selected }: FaultProps): JSX.Element {
  return FaultsList.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small">
        <TableBody>
          {FaultsList.map((f) => {
            const isSelected = f.timestamp === selected;
            return (
              <TableRow
                key={f.id}
                onClick={() => onSelect(f.timestamp)}
                selected={isSelected}
              >
                <TableCell align="center">
                  {f.severity === "warn" ? (
                    <WarningTwoToneIcon
                      style={{
                        color: theme.palette.warning.light,
                        marginTop: "4px",
                      }}
                    />
                  ) : (
                    <ErrorTwoToneIcon
                      style={{
                        color: theme.palette.error.light,
                        marginTop: "4px",
                      }}
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
    <NoData />
  );
}
