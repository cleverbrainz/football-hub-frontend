import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll'
  },
  icon: {
    color: "#EF5B5B",
    "&:hover": {
      cursor: "pointer",
    },
  }
});

export default function CoachPageBetaTable({ locations, handleSetLocationId }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Venue</TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Full Address</TableCell>
            <TableCell align="right">Latitude</TableCell>
            <TableCell align="right">Longitude</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {locations.map((el, i) => (
            <TableRow key={i}>
              <TableCell align="right">{el.venue}</TableCell>
              <TableCell align="right">{el.locationId}</TableCell>
              <TableCell align="right">{el.fullAddress}</TableCell>
              <TableCell align="right">{el.latitude}</TableCell>
              <TableCell align="right">{el.longitude}</TableCell>
              <TableCell align="right">
                <DeleteForeverSharpIcon
                onClick={() => handleSetLocationId(el.locationId)}
                className={classes.icon} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
