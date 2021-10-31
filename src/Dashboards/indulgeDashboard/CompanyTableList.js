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

import CheckSharpIcon from '@material-ui/icons/CheckSharp';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import moment from 'moment'


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



export default function CompanyTableList({ companies }) {

  function Row({ company }) {
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    const { userId, name, main_email, joined, verification } = company
    const { coachDocumentationCheck, companyDetailsCheck, paymentCheck } = verification

    function toDateTime(secs) {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(secs);
      return t;
    }





    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>


          <TableCell component="th" scope="row">
            {userId}
          </TableCell>
          <TableCell align="right">{name}</TableCell>
          <TableCell align="right">{main_email}</TableCell>
          <TableCell align="right">
            {moment(toDateTime(joined._seconds)).format('MMMM Do YYYY')}
          </TableCell>

        </TableRow>



        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={2}>
                <Typography variant="h6" gutterBottom component="div">
                  Verification Information
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">Payment Check</TableCell>
                      <TableCell align="right">Coach Doc Check</TableCell>
                      <TableCell align="right">Company Details Check</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>


                    <TableCell align="right">
                      {paymentCheck ? <CheckSharpIcon /> : <ClearSharpIcon />}
                    </TableCell>
                    <TableCell align="right">
                      {coachDocumentationCheck ? <CheckSharpIcon /> : <ClearSharpIcon />}
                    </TableCell>

                    <TableCell align="right">
                      {companyDetailsCheck ? <CheckSharpIcon /> : <ClearSharpIcon />}
                    </TableCell>

                  </TableBody>
                </Table>
              </Box>

              <Box margin={2}>
                <Typography variant="h6" gutterBottom component="div">
                  Additional Notes
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableBody>

                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and scrambled it to make a type
                      specimen book. It has survived not only five centuries, but also the leap into
                      electronic typesetting, remaining essentially unchanged. It was popularised in
                      the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
                      and more recently with desktop publishing software like Aldus PageMaker including
                      versions of Lorem Ipsum.</p>

                  </TableBody>
                </Table>
              </Box>


            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom component="div">
        Companies
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>User ID </TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right"> Email </TableCell>

              <TableCell align="right">Joined</TableCell>
              <TableCell align="right">Status</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {companies && companies.map((company, i) => {
              return <Row key={i} company={company} />
            }
            )}
          </TableBody>
        </Table>
      </TableContainer>


    </>
  );
}
