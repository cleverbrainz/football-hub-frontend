import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { Button } from '@material-ui/core';
import { AuthContext } from '../../lib/context';
import axios from 'axios'
import auth from '../../lib/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
  },
  linkbox: {
    cursor: 'pointer'
  },
  titleBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '20px'
  },
  roundBox: {
    width: '30px',
    height: '30px',
    textAlign: 'center',
    lineHeight: '30px',
    fontSize: "20px",
    fontWeight: "600"
  },
  headerBox: {
    paddingBottom: '20px'
  },
  gridContainer: {
    margin: '100 auto'
  },
  outstanding: {
    color: 'white',
    backgroundColor: 'red'
  },
  complete: {
    color: 'white',
    backgroundColor: 'green'
  },
  pending: {
    color: 'white',
    backgroundColor: 'orange'
  },
  paymentButtonContainer: { 
    marginTop: '20px',   
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '20px',
    [theme.breakpoints.up("sm")]: {
      display: 'flex',
    },
  },
  registerButton: {
    padding: '5px 20px',
    fontSize: '12pt',
    backgroundColor: '#02a7f0',
    borderRadius: '5px',
    color: 'white',
    "&:hover": {
      backgroundColor: '#02a7f0',
    },
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', 
    marginTop: '40px',
    marginBottom: '40px'
  }
}));

const IntroductionPage = ({ handleComponentChange }) => {
  const classes = useStyles()
  const boxes = [
    {name: 'Company Details', state: 'companyInfo', component: 'Contact', page: 0 , details: 'Provide your company details'}, 
    {name: 'Locations', state:'locations', component: 'Locations', page: 1, details: 'Enter locations of your courses'}, 
    {name:'Coaches', state: 'coaches', component: 'Coaches', page: 1, details: 'Add and invite your coaches to join'},
    {name: 'Services', state: 'services', component: 'Misc', page: 1, details:'Add the services you offer'}, 
    // {name: 'Age Groups', state:'ageDetails', component: 'Misc', page: 1 },
    {name:'Courses/Camps', state: 'courses', component: 'Sessions', page: 1, details:'Enter your course and camp dates'}
  ]
  const [checkState, setCheckState] = useState(null)
  const { user, userData, setUserData } = useContext(AuthContext)

  const checkReducer = (toCheck) => {
    const test = Object.values(toCheck).reduce((acc, curr) => {
      if (curr === 'pending') return false
      return acc && curr 
      }, true)
    return test
  }

  const introductionCheck = (toCheck) => {

    const newState = {
      companyInfo: false,
      locations: false,
      coaches: false,
      services: false,
      // ageDetails: false,
      courses: false
    }
    for (const type of Object.keys(newState)) {
      const check = toCheck[type]

      check ? Array.isArray(check) ? (
        check.length > 0 ? newState[type] = true :
        console.log('empty array')
      ) 
      : (
        type === 'courses' ? (
          check.active.length > 0 || check.past.length > 0 ?  newState[type] = true :
          console.log('empty object')
        ) : (Object.keys(check).length > 0 ? newState[type] = true :
        console.log('empty object'))
      ) : type === 'companyInfo' ? ( [toCheck.verification.companyDetailsCheck, toCheck.verification.indemnityDocumentCheck, toCheck.verification.liabilityDocumentCheck].reduce((pre, cu) => pre && cu, true) ? newState[type] = true : toCheck.verificationId?.companyInfo ? newState[type] = 'pending' : newState[type]= false ) : console.log('undefined') 

      // console.log(newState)
    }
    // setUserData({ ...userData, verification: { ...userData.verification, setup: test } })
    if (checkReducer(newState)) {
      // console.log('all good!')
      // console.log({userData, auth: auth.getUserId()})
      axios.patch(`/users/${userData.userId}`, { userId: userData.userId, updates: { verification: { ...userData.verification, setup: true }}}, { headers: { authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {        
        setCheckState({ ...newState })                 
      })
      .catch(err => console.log(err))
    } else {
      setCheckState({ ...newState })
    }
  }

  const getData = async () => {
    // const userCall = await axios.get(`/users/${auth.getUserId()}`) 
    
    axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {        
        const userCall = res
        const userRes = userCall.data[0]
        introductionCheck(userRes)
        setUserData(userRes)        
      })
      .catch(err => console.log(err))
    // const userRes = await userCall.data[0]
    // await introductionCheck(userRes)
    // setUserData(userRes)
  }
  
  useEffect(() => {  
    getData()
  },[])

  const handleIgnoreStripe = () => {
    axios.patch(`/users/${auth.getUserId()}`, { updates: { stripeAccount: 'not using' }, userId: auth.getUserId()}, { headers: { authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {       
        getData()               
      })
      .catch(err => console.log(err))
  }

  if (!checkState) return null
  return (
    <div className={classes.root} style={{backgroundColor: '#fafafa'}}>
      <div className={classes.headerBox}>
        <Paper  className={classes.paper}>
          <Typography variant="h4">
            Welcome to ftballer.com
          </Typography>
          <Typography variant="subtitle1">
            Please set up your account so that you can get your listing live
          </Typography>
        </Paper>
      </div>
      <Grid container spacing={3} className={classes.gridContainer}>        
        { boxes.map((item, index) => {
          return (
          <Grid item lg={4} sm={6} xs={12} key={index}>
            <Paper className={`${classes.paper} ${classes.linkbox}`} onClick={(event) => handleComponentChange(item.component, item.page)}>
              <div className={classes.titleBox}>
                <Typography variant="h5">{item.name}</Typography>
                {!checkState[item.state]? <Box className={`${classes.roundBox} ${classes.outstanding}`} border={1} borderRadius="50%">{index + 1}</Box> :
                checkState[item.state] === 'pending' ? <Box className={`${classes.roundBox} ${classes.pending}`} border={1} borderRadius="50%"><span role="img" aria-label="hourglass emoji">⌛</span></Box> : <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box>
                }
              </div>
              <Typography variant="subtitle1">{item.details}</Typography>
              {/* <Link to={item.url}><Button variant="contained" color="primary">Click here</Button></Link> */}
              {/* <Button onClick={(event) => handleComponentChange(item.component, item.page)}>Click Here</Button> */}
            </Paper>
          </Grid>)
        }) }
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <div className={classes.titleBox}>
              <Typography variant="h5">Online payments</Typography>{ userData.stripe_account || userData.stripeAccount ? <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box> : <Box className={`${classes.roundBox} ${classes.outstanding}`} border={1} borderRadius="50%">6</Box> }
            </div>
            <Typography variant="subtitle1" >Taking payments online automates a lot of the process on ftballer.com and is simpler for your customers as well.</Typography>
            <div className={classes.paymentButtonContainer}>
              {/* <Typography variant="p">Powered by Stripe</Typography> */}
              <a xs={12} href="https://stripe.com/gb">
                <img alt="Powered by Stripe" style={{maxWidth: "65%"}} src='https://i.imgur.com/VzVZXkr.png'/>
              </a>
              <div xs={12}>
                { !userData.stripe_account && !userData.stripeAccount ?
                <>
                <Button variant="contained" color="default" onClick={() => handleIgnoreStripe()}>Not Now</Button>
                <Button variant="contained" color="primary" onClick={() => handleComponentChange('Subscription', 0)}>Yes I Need This -{'>'}</Button>
                </>
                :
                <Button variant="contained" color="primary" onClick={() => handleComponentChange('Subscription', 0)}>Go To Stripe Dashboard</Button>
                }
              </div>
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <div className={classes.titleBox}>
              <Typography variant="h4">Create your first listing</Typography>{ userData.verification.setup ? <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box> : <Box className={`${classes.roundBox} ${classes.outstanding}`} border={1} borderRadius="50%">7</Box> }
            </div>
            <Typography variant="subtitle1" >Once you've finished setting up your account click here to create your first listing!</Typography>
            <div className={classes.titleBox}>
              {/* <Typography variant="p">Powered by Stripe</Typography> */}
              <div></div>
              <Button variant="contained" color="primary" onClick={(event) => handleComponentChange('Listings', 1)} disabled={!checkReducer(checkState)}>Create your first listing</Button>
              {/* <Button variant="contained" color="secondary">Go to Stripe Dashboard</Button> */}
            </div>
          </Paper>
        </Grid>
      </Grid>
      <div className={classes.buttonContainer}>
        <Button className={classes.registerButton} onClick={(event) => handleComponentChange('Contact', 0)}>
          Start Now         
        </Button>
      </div>
    </div>
  )
}

export default IntroductionPage