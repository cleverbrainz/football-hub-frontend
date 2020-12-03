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
import CheckSharpIcon from '@material-ui/icons/CheckSharp';

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

export default function CompanyPageBetaTable({ companies, handleSetCoachId }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email Address</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">Courses Running</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((el, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {el.name}
              </TableCell>
              <TableCell align="right">{el.email}</TableCell>
              <TableCell align="right">{el.main_contact_number}</TableCell>
              <TableCell align="right">{el.courses ? el.courses.length : '0'}</TableCell>
              <TableCell align="right">
                <DeleteForeverSharpIcon
                onClick={() => handleSetCoachId(el.coachId)}
                className={classes.icon} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
