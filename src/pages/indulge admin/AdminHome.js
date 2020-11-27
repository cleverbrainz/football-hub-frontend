import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Typography, Box, Divider, Button } from '@material-ui/core'

const AdminHome = () => {

  const [awaitingVerification, setAwaitingVerification] = useState([])
  useEffect(() => {
    axios.get('/admin/awaitingVerification')
      .then(res => {
        console.log('resdata', res.data)
        setAwaitingVerification(res.data)
      })
      .catch(error => console.log(error))
  },[])

  const acceptDocuments = event => {
    event.preventDefault()
    const [verificationId, userId] = event.target.id.split('-')
    console.log(event.target)
    const accepted = {
      coachDocumentationCheck: true,
      dbsDocumentationCheck: true,
      paymentCheck: true
    }
    const message = 'Documents verifed'
    axios.put(`/admin/awaitingVerification/${verificationId}`, { accepted, userId, message, verificationId })
      .then(console.log('hello accept'))
  }

  console.log(awaitingVerification)

  return (
    <div>
      <Typography style={{ margin: '50px 0', textAlign: 'center' }} component='div' >
        <Box
          fontSize={30} fontWeight="fontWeightBold" m={0}>
          Indulge Admin Panel
        </Box>
      </Typography>

      <div style={{display: 'flex', width: '100%', justifyContent: 'space-evenly'}}>
        <Link to='/admin/home'>
          <Button
            // className={classes.button}
            variant="contained" color="primary">
            Home page Edit
        </Button>
        </Link>


        <Link to='/admin/join'>
          <Button
            // className={classes.button}
            variant="contained" color="primary">
            Join us Edit
        </Button>
        </Link>
      </div>

      <div>
        <h1>Awaiting Verification</h1>
        {awaitingVerification.map(([id, user]) => {
          return (
            <div>
              <Link to={`/${user.userId}/profile`}><h2>{user.name}</h2></Link>
              <h4>Documents:</h4>
              <a href={user.documents.dbsCertificate} rel="noopener noreferrer" target='_blank'>DBS Certificate</a>
              <a href={user.documents.coachingCertificate} rel="noopener noreferrer" target='_blank'>Coaching Certificate</a>
              <button id={`${id}-${user.userId}`} onClick={event => acceptDocuments(event)}>Verify Documents</button>
            </div>
          )
        })}
      </div>

    </div>
  );
};

export default AdminHome;