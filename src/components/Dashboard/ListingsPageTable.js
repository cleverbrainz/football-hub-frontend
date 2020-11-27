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
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import CreateSharpIcon from '@material-ui/icons/CreateSharp';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll'
  },
  icon: {
    "&:hover": {
      cursor: "pointer",
    },
  }
});

export default function ListingsPageTable({ listings, handleSetCoachId,
handleSetListingToBeEdited }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Listing ID</TableCell>
            <TableCell align="right">Images</TableCell>
            <TableCell align="right">Services</TableCell>
            <TableCell align="right">Camps</TableCell>
            <TableCell align="right">Courses</TableCell>
            <TableCell align="right">Coaches</TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listings.map((el, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {el.listingId}
              </TableCell>
              <TableCell align="right">{el.images.length}</TableCell>
              <TableCell align="right">{el.services.length}</TableCell>
              <TableCell align="right">{el.camps.length}</TableCell>
              <TableCell align="right">{el.courses.length}</TableCell>
              <TableCell align="right">{el.coaches.length}</TableCell>
              <TableCell align="right">
                <CreateSharpIcon
                  onClick={() => handleSetListingToBeEdited(el)}
                  className={classes.icon}
                  style={{color: "green"}}
                />
              </TableCell>
              <TableCell align="right">
                <DeleteForeverSharpIcon
                  // onClick={() => handleSetCoachId(el.coachId)}
                  className={classes.icon} style={{color: "#EF5B5B"}} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
