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
  }
}));



const IntroductionPage = ({ handleComponentChange }) => {
  const classes = useStyles()
  const boxes = [
    {name: 'Company Details', state: 'companyInfo', component: 'Contact', page: 0 }, {name: 'Locations', state:'locations', component: 'Locations', page: 1 }, {name:'Coaches', state: 'coaches', component: 'Coaches', page: 1 },
    {name: 'Services', state: 'services', component: 'Misc', page: 1 }, {name: 'Age Groups', state:'ageDetails', component: 'Misc', page: 1 }, {name:'Courses/Camps', state: 'courses', component: 'Sessions', page: 1 }
  ]
  const [checkState, setCheckState] = useState(null)

  const { user, userData, setUserData } = useContext(AuthContext)
  console.log(user)

  const checkReducer = (toCheck) => {
    const test = Object.values(toCheck).reduce((acc, curr) => {
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
      ageDetails: false,
      courses: false
    }
    for (const type of Object.keys(newState)) {
      const check = toCheck[type]
      console.log(check)
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
      ) : console.log('undefined') 

      console.log(newState)
    }
    // setUserData({ ...userData, verification: { ...userData.verification, setup: test } })
    if (checkReducer(newState)) {
      console.log('all good!')
      axios.patch(`/users/${userData.userId}`, { userId: userData.userId, updates: { verification: { ...userData.verification, setup: true }}}, { headers: { authorization: `Bearer ${auth.getToken()}` }})
        .then(res => {
          console.log(res)
          setCheckState({ ...newState })
        })
        .catch(err => console.log(err))
    } else {
      setCheckState({ ...newState })
    }
  }


  
  useEffect(() => {
    const getData = async () => {
      const userCall = await axios.get(`/users/${auth.getUserId()}`)
      const userRes = await userCall.data[0]
      await introductionCheck(userRes)
      setUserData(userRes)
      console.log(userRes)
    }

    getData()
  },[])


  if (!checkState) return null
  return (
    <div className={classes.root}>
      <div className={classes.headerBox}>
        <Paper  className={classes.paper}>
      <Typography variant="h3">
        Welcome to ftballer.com
      </Typography>
      <Typography variant="h6">
        In order for your listing to appear on our public website you need to complete the following sections. You can always come back to a section to complete it later.
        We will need to verify some of your details such as insurance, coaching certificates and identity, so please submit these when prompted.
      </Typography>
      </Paper>
      </div>
      <Grid container spacing={3} className={classes.gridContainer}>
        <Grid item xs={12}>
          <Paper className={classes.paper}><div className={classes.titleBox}>
              <Typography variant="h4">Do you want to take online payments?</Typography>{ userData.stripe_account ? <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box> : <Box className={`${classes.roundBox} ${classes.outstanding}`} border={1} borderRadius="50%">1</Box> }
              </div>
              <Typography variant="p" >Taking payments online automates a lot of the process on ftballer.com and is simpler for your customers as well.</Typography>
              <div className={classes.titleBox}>
              {/* <Typography variant="p">Powered by Stripe</Typography> */}
              <a href="https://stripe.com/gb">
                <img alt="Powered by Stripe" style={{maxWidth: "80%"}} src='https://i.imgur.com/VzVZXkr.png'/>
              </a>
              <Button variant="contained" color="primary">Go to Stripe Dashboard</Button>
              {/* <Button variant="contained" color="secondary">Go to Stripe Dashboard</Button> */}
              </div>
            </Paper>
        </Grid>
        { boxes.map((item, index) => {
          return (
          <Grid item xs={4}>
            <Paper className={`${classes.paper} ${classes.linkbox}`} onClick={(event) => handleComponentChange(item.component, item.page)}>
              <div className={classes.titleBox}>
              <Typography variant="h4">{item.name}</Typography>
              {!checkState[item.state]? <Box className={`${classes.roundBox} ${classes.outstanding}`} border={1} borderRadius="50%">{index + 2}</Box> :
               <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box>
              }
              </div>
              <Typography variant="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec pellentesque tristique lacus eu bibendum. Pellentesque et lacinia elit.</Typography>
              {/* <Link to={item.url}><Button variant="contained" color="primary">Click here</Button></Link> */}
              {/* <Button onClick={(event) => handleComponentChange(item.component, item.page)}>Click Here</Button> */}
            </Paper>
          </Grid>)
        }) }
                <Grid item xs={12}>
          <Paper className={classes.paper}><div className={classes.titleBox}>
              <Typography variant="h4">Create your first listing</Typography>{ userData.verification.setup ? <Box className={`${classes.roundBox} ${classes.complete}`} border={1} borderRadius="50%">✓</Box> : <Box className={`${classes.roundBox} ${classes.outstanding}`} border={1} borderRadius="50%">8</Box> }
              </div>
              <Typography variant="p" >Once you've finished setting up your account click here to create your first listing!</Typography>
              <div className={classes.titleBox}>
              {/* <Typography variant="p">Powered by Stripe</Typography> */}
              <div></div>
              <Button variant="contained" color="primary" onClick={(event) => handleComponentChange('Listings', 1)} disabled={!checkReducer(checkState)}>Create your first listing</Button>
              {/* <Button variant="contained" color="secondary">Go to Stripe Dashboard</Button> */}
              </div>
            </Paper>
        </Grid>
      </Grid>
    </div>
  )


}

export default IntroductionPage