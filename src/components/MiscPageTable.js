import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import moment from 'moment'
import { toDate } from 'date-fns';
import CreateSharpIcon from '@material-ui/icons/CreateSharp';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    }
  },
  icons: {
    "&:hover": {
      cursor: "pointer",
    },
  }
});



export default function MiscPageTable({ 
  getData,
  classes,
  handleEditService, 
  handleMiscDeletion,
  services }) {

  return (
    <>
      <Typography variant="h6" gutterBottom component="div">
        Services
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell>ID </TableCell>
              <TableCell align="right"> Service Name </TableCell>
              <TableCell align="right">Service Description </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services && services.map((el, i) => (
              <TableRow key={i}>
                <TableCell align="right">{el.serviceId}</TableCell>
                <TableCell align="right">{el.name}</TableCell>
                <TableCell align="right">{el.description}</TableCell>
                <TableCell align="right">
                  <CreateSharpIcon
                    style={{ color: '#709995' }}
                    onClick={() => handleEditService(el)}
                    className={classes.icon}
                  />
                </TableCell>
                <TableCell align="right">
                  <DeleteForeverSharpIcon
                    onClick={() => handleMiscDeletion(el.serviceId, 'service')}
                    className={classes.icon} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
