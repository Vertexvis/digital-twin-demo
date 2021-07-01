import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";

import { Metadata } from "../lib/metadata";
import { NoData } from "./NoData";

export interface MetadataProps {
  readonly metadata?: Metadata;
}

const useStyles = makeStyles(() => ({ root: { overflowX: "hidden" } }));

export function MetadataProperties({ metadata }: MetadataProps): JSX.Element {
  const { root } = useStyles();
  if (metadata == null) return <NoData />;

  const propKeys = Object.keys(metadata.properties);
  if (propKeys.length === 0) return <NoData />;

  return (
    <TableContainer classes={{ root }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1">{metadata.partName}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {propKeys.map((k) => (
            <TableRow key={k}>
              <TableCell>
                <Typography variant="subtitle2">{k}</Typography>
                <Typography variant="body2">
                  {metadata.properties[k]}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
