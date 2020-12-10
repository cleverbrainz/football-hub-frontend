import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Typography, Box, Button, TextField } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: 'scroll',

  },
  icon: {
    color: "#EF5B5B",
    "&:hover": {
      cursor: "pointer",
    },
  }
});



const VerificationPage = () => {

  const [awaitingVerification, setAwaitingVerification] = useState([])
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)


  useEffect(() => {
    axios.get('/admin/awaitingVerification')
      .then(res => {
        console.log('resdata', res.data)
        setAwaitingVerification(res.data)
      })
      .catch(error => console.log(error))
  }, [!stateRefreshInProgress])

  const acceptDocuments = event => {
    event.preventDefault()
    setStateRefreshInProgress(true)
    const [verificationId, userId] = event.target.id.split('-')
    console.log(event.target)
    const accepted = {
      coachDocumentationCheck: true,
      dbsDocumentationCheck: true,
      paymentCheck: true
    }
    const message = 'Documents verifed'
    axios.put(`/admin/awaitingVerification/${verificationId}`, 
    { accepted, userId, message, verificationId })
      .then(setStateRefreshInProgress(false))
      .catch(setStateRefreshInProgress(false))
  }

  const classes = useStyles();

  const CoachVerificationRows = () => {

    return awaitingVerification.map(([id, user], i) => {
      return (

        <TableRow key={i}>
          <TableCell>
            <h2>{user.userId}</h2>
          </TableCell>

          <TableCell align="right">
            <Link to={`/${user.userId}/profile`}>
              <h2>{user.name}</h2>
            </Link>
          </TableCell>

          <TableCell align="right">
            <a href={user.documents.dbsCertificate}
              rel="noopener noreferrer"
              target='_blank'> Click to open </a>
          </TableCell>

          <TableCell align="right">
            <a href={user.documents.coachingCertificate}
              rel="noopener noreferrer"
              target='_blank'> Click to open </a>
          </TableCell>

          <TableCell align="right">
            <button
              id={`${id}-${user.userId}`}
              onClick={event => acceptDocuments(event)}>
              Verifiy Coach
           </button>
          </TableCell>
        </TableRow>
      )
    })
  }


  return (

    <div style={{ padding: '24px' }}>

      <Typography variant="h6" gutterBottom component="div">
        Pending Coach Verifications
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">User ID</TableCell>
              <TableCell align="right">Coach Name</TableCell>
              <TableCell align="right">DBS Document</TableCell>
              <TableCell align="right">Coaching Certificate</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <CoachVerificationRows />
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6"  style={{ marginTop: '30px' }} 
      gutterBottom component="div">
        Pending Company Verifications
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">User ID</TableCell>
              <TableCell align="right">Coach Name</TableCell>
              <TableCell align="right">DBS Document</TableCell>
              <TableCell align="right">Coaching Certificate</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* <CoachVerificationRows /> */}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
};

export default VerificationPage;