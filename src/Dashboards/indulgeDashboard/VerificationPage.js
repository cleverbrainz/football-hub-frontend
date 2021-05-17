import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Typography, Box, Button, TextField, Select, MenuItem } from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
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

const verificationOutcomes = {
  coachInfo: {
    1: {
      dbsDocumentationCheck: true,
      coachDocumentationCheck: true
    },
    2: {
      dbsDocumentationCheck: true,
      coachDocumentationCheck: false
    },
    3: {
      dbsDocumentationCheck: false,
      coachDocumentationCheck: true
    },
    4: {
      dbsDocumentationCheck: false,
      coachDocumentationCheck: false
    }
  },
  companyInfo: {
    1: {
      liabilityDocumentCheck: true,
      indemnityDocumentCheck: true,
      companyDetailsCheck: true
    },
    2: {
      liabilityDocumentCheck: false,
      indemnityDocumentCheck: true,
      companyDetailsCheck: true
    },
    3: {
      liabilityDocumentCheck: true,
      indemnityDocumentCheck: false,
      companyDetailsCheck: true
    },
    4: {
      liabilityDocumentCheck: false,
      indemnityDocumentCheck: false,
      companyDetailsCheck: true
    },
    5: {
      liabilityDocumentCheck: true,
      indemnityDocumentCheck: true,
      companyDetailsCheck: false
    },
    6: {
      liabilityDocumentCheck: false,
      indemnityDocumentCheck: true,
      companyDetailsCheck: false
    },
    7: {
      liabilityDocumentCheck: true,
      indemnityDocumentCheck: false,
      companyDetailsCheck: false
    },
    8: {
      liabilityDocumentCheck: false,
      indemnityDocumentCheck: false,
      companyDetailsCheck: false
    },


  }
}



const VerificationPage = () => {

  const [awaitingVerification, setAwaitingVerification] = useState([])
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const [verificationChoice, setVerificationChoice] = useState({})


  useEffect(() => {
    axios.get('/admin/awaitingVerification')
      .then(res => {
        console.log('resdata', res.data)
        setAwaitingVerification(res.data)
        for (const item of res.data) {
          const [id, user] = item
          setVerificationChoice({ ...verificationChoice, [id]: 0 })
        }
      })
      .catch(error => console.log(error))
  }, [stateRefreshInProgress])

  console.log(verificationChoice)

  const acceptDocuments = (event, [verificationId, userId], type) => {
    event.preventDefault()
    setStateRefreshInProgress(true)
    // const [verificationId, userId] = event.target.id.split('-')
    console.log(event.target)
    const currentVerification = awaitingVerification.filter(item => item[0] === verificationId)[0][1].verification
    console.log(currentVerification)
    const updatedVerification = { ...currentVerification, ...verificationOutcomes[type][verificationChoice[verificationId]] }
    console.log({updatedVerification})
    // const accepted = type === 'coachInfo' ? 'coachDocumentationCheck': 'companyDetailsCheck'

    const message = 'Documents verifed'
    axios.put(`/admin/awaitingVerification/${verificationId}`, 
    { type, updatedVerification, userId, message, verificationId })
      .then(setStateRefreshInProgress(false))
      .catch(setStateRefreshInProgress(false))
  }

  const classes = useStyles();

  const CoachVerificationRows = () => {

    return awaitingVerification.map(([id, user], i) => {
      if (user.type === 'coachInfo') {
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
            <a href={user.coachInfo.dbsCertificate}
              rel="noopener noreferrer"
              target='_blank'> Click to open </a>
             { user.verification.dbsDocumentationCheck && <CheckIcon /> }
          </TableCell>

          <TableCell align="right">
            <a href={user.coachInfo.coachingCertificate}
              rel="noopener noreferrer"
              target='_blank'> Click to open </a>
            { user.verification.coachDocumentationCheck && <CheckIcon /> }
          </TableCell>

          <TableCell align="right">
          <Select
            // label={sentence}
            id="select-level"
            value={verificationChoice[id]}
            // onChange={(e) => setCompanyInfo({ ...companyInfo, [item]: e.target.value })}
            onChange={event => setVerificationChoice({ ...verificationChoice, [id]: event.target.value })}
          >
              <MenuItem value={0} disabled={true}>Select documents for approval</MenuItem>
              <MenuItem value={1}>Approve DBS and coaching certificate</MenuItem>
              <MenuItem value={2}>Approve DBS only</MenuItem>
              <MenuItem value={3}>Approve coaching certificate only</MenuItem>
              <MenuItem value={4}>Approve neither</MenuItem>
          </Select>
            <button
              id={`${id}-${user.userId}`}
              onClick={event => acceptDocuments(event, [id, user.userId], 'coachInfo')}
              disabled={verificationChoice[id] === 0 ? true : false}>
              Verifiy Coach
           </button>
          </TableCell>
        </TableRow>
      )
    }
  })  
  }

  const CompanyVerificationRows = () => {

    return awaitingVerification.map(([id, user], i) => {
      if (user.type === 'companyInfo')
      return (

        <TableRow key={i}>
          <TableCell>
          <Link to={`/${user.userId}/profile`}>
            <h2>{user.name}</h2>
            </Link>
          </TableCell>

          <TableCell align="right">
              <h2>{user.company_registration_number}</h2>   
          </TableCell>

          <TableCell align="right">
            <h2>{user.vat_number}</h2>
            { user.verification.companyDetailsCheck && <CheckIcon /> }
          </TableCell>

          <TableCell align="right">
          <p>{user.public_liability_insurance}</p>
            <a href={user.documents.public_liability_insurance}
              rel="noopener noreferrer"
              target='_blank'> Click to open </a>
              { user.verification.liabilityDocumentCheck && <CheckIcon /> }
          </TableCell>

          <TableCell align="right">
      <p>{user.professional_indemnity_insurance}</p>
            <a href={user.documents.professional_indemnity_insurance}
              rel="noopener noreferrer"
              target='_blank'> Click to open </a>
              { user.verification.indemnityDocumentCheck && <CheckIcon /> }
          </TableCell>

          <TableCell align="right">
          <Select
            // label={sentence}
            id="select-level"
            value={verificationChoice[id]}
            // onChange={(e) => setCompanyInfo({ ...companyInfo, [item]: e.target.value })}
            onChange={event => setVerificationChoice({ ...verificationChoice, [id]: event.target.value })}
          >
              <MenuItem value={0} disabled={true}>Select documents for approval</MenuItem>
              <MenuItem value={1}>Approve company details, both certificates</MenuItem>
              <MenuItem value={2}>Approve company details, public indemnity certificate only</MenuItem>
              <MenuItem value={3}>Approve company details, public liability certificate only</MenuItem>
              <MenuItem value={4}>Approve company details, neither certificate</MenuItem>
              <MenuItem value={5}>Approve both certificates only</MenuItem>
              <MenuItem value={6}>Approve public indemnity certificate only</MenuItem>
              <MenuItem value={7}>Approve public liability certificate only</MenuItem>
              <MenuItem value={8}>Approve nothing</MenuItem>
          </Select>
            <button
              id={`${id}-${user.userId}`}
              onClick={event => acceptDocuments(event, [id, user.userId], 'companyInfo')}
              disabled={verificationChoice[id] === 0 ? true : false}>
              Verifiy Company
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
              <TableCell align="right">Company Name</TableCell>
              <TableCell align="right">Company Registration Number</TableCell>
              <TableCell align="right">VAT Number</TableCell>
              <TableCell align="right">PLI Document</TableCell>
              <TableCell align="right">Professional Indemnity Document</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          <CompanyVerificationRows />
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
};

export default VerificationPage;