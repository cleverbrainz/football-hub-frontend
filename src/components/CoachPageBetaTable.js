import React from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import auth from '../lib/auth'
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

export default function CoachPageBetaTable({ coaches, handleSetCoachId, handleChange }) {
  const classes = useStyles();

  console.log('table', coaches)

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">Email Address</TableCell>
            <TableCell align="right">Phone Number</TableCell>
            <TableCell align="right">Coaching Level</TableCell>
            <TableCell align="right">DBS Certificate</TableCell>
            <TableCell align="right">Coaching Certificate</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coaches.map((el, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
              {el.userId === auth.getUserId() ? <Link onClick={(event) => handleChange(event, 3)}>{el.coachInfo.name}</Link> :
              <Link to={`/${el.userId}/profile`}>{el.coachInfo.name}</Link>
              }
              </TableCell>
              <TableCell align="right">{el.userId}</TableCell>
              <TableCell align="right">{el.email}</TableCell>
              <TableCell align="right">{el.main_contact_number}</TableCell>
              <TableCell align="right">{el.coachInfo.coaching_level}</TableCell>
              <TableCell align="right">
              {el.verification.dbsDocumentationCheck ? <CheckSharpIcon style={{color: 'green'}} /> : <ClearSharpIcon style={{color: 'red'}} />}
              </TableCell>
              <TableCell align="right">
              {el.verification.coachDocumentationCheck ? <CheckSharpIcon style={{color: 'green'}} /> : <ClearSharpIcon style={{color: 'red'}} />}
              </TableCell>
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
