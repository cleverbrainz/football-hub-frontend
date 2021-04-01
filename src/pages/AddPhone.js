import React, { useState, useEffect, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import VisibilityOffSharpIcon from '@material-ui/icons/VisibilityOffSharp';
import VisibilitySharpIcon from '@material-ui/icons/VisibilitySharp';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import auth from '../lib/auth'
import { AuthContext } from "../lib/context";
import { firebaseApp } from '../lib/firebase';
import {
  MenuItem,
  Select,
  Paper
} from '@material-ui/core'
import * as firebase from "firebase";

const AddPhone = ({location, history, locale}) => {

  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: location.pathname === '/admin/login' ? 'center' : 'center',
      height: `${window.innerHeight - 80}px`,
      width: '85vw', 
      margin: '0 auto',
      textAlign: 'center'
    },
    form: {
      width: '30%',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      height: '60%',
      justifyContent: 'space-evenly'
    },
    button: {
      position: 'relative'
    },
    progress: {
      position: 'absolute'
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: '80%',
      width: '90%'
    },
    back: {
      alignSelf: 'end',
      margin: '20px 20px'
    }
  }));


  const { user, setUserData, userData } = useContext(AuthContext);

  // console.log(user.user.multiFactor.enrolledFactors[0].phoneNumber)
  const [isLoading, setIsLoading] = useState(false)
  const [loginFields, setLoginFields] = useState({
    phoneNumber: user.user.multiFactor?.enrolledFactors[0]?.phoneNumber || '' ,
    verificationCode: '',
    verificationId: ''
  })
  const [verified, setVerified] = useState(user.user.multiFactor.enrolledFactors[0]?.factorId === 'phone' ? true : false)
  const [verificationUpdated, setVerificationUpdated] = useState(false)
  const [loginError, setLoginError] = useState('')
  const classes = useStyles();
  const [codeSent, setCodeSent] = useState(false)
  const appAuth = firebaseApp.auth()
  const currentUser = appAuth.currentUser
  
  appAuth.languageCode = locale

  console.log(history)



  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...loginFields, [name]: value }
    setLoginError('')
    setLoginFields(fields)
    console.log(loginFields)

  }

  function sendVerificationCode(e) {
    e.preventDefault()
    
    currentUser.multiFactor.getSession()
      .then(multiFactorSession => {

        const phoneAuthProvider = new firebase.auth.PhoneAuthProvider(appAuth);
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
              'recaptcha-container',
              {
                'size': 'normal',
                'callback': function (response) {
                  // reCAPTCHA solved, you can proceed with phoneAuthProvider.verifyPhoneNumber(...).
                  // ...
                  // handleRecaptcha()
                  console.log('captchadddd')

                },
                'expired-callback': function () {
                  // Response expired. Ask user to solve reCAPTCHA again.
                  // ...
                  // console.log('uh oh')
                },
                'hl': locale
              },
              firebaseApp);
        const phoneInfoOptions = {
          phoneNumber: loginFields.phoneNumber,
          session: multiFactorSession
        };
        return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
      }).then(function(verificationId) {
      setLoginFields({ ...loginFields, verificationId })
      setCodeSent(true)
    })
}

function confirmVerificationCode(e) {

  // console.log('render')
  // firebaseApp.auth().currentUser
  //   .reauthenticateWithPhoneNumber(loginFields.phoneNumber, recaptchaVerifier)
  //   .then((confirmationResult) => {
  //     console.log('egg')
  //     return confirmationResult.confirm(prompt('Enter your SMS code'));
  //   })
  //   .then((userCredential) => {
  //     // User successfully reauthenticated.
  //     console.log('reauthenticated')
  //   }).catch(err => console.log(err))

  e.preventDefault()
  const phoneAuthCredential =
    firebase.auth.PhoneAuthProvider.credential(loginFields.verificationId, loginFields.verificationCode);
  const multiFactorAssertion =
    firebase.auth.PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
  currentUser.multiFactor.enroll(multiFactorAssertion)
    .then(function() {
      // Second factor enrolled.
      console.log('secondFactorEnrolled')
      setVerificationUpdated(true)
      setCodeSent(false)
    });
}
    



  if (!user.user) return null
  return (
    <div className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
      <Button className={`${classes.button} ${classes.back}`} variant='outlined' onClick={() => history.goBack()}>Back</Button>
              <Typography variant='h4'> Verify Phone Number </Typography>
              <Typography variant='p'>
                Multi Factor Authentication is an optional extra layer of security that we recommend our users protect their accounts with.{<br/>}
                Once enabled, at login after entering your account details you will be sent a verification code to enter also.{<br/>}
                To use Multi Factor Authentication we need to verify your phone below.{<br/>}
                Please enter the phone number you want to use and you will be sent a verification code </Typography>
              
              
              {/* <Select value={locale} style={{ fontSize: '14px' }} onChange={(event) => {
              // setLang(event.target.value)
            }}>
              
              <MenuItem value={'en'}>English</MenuItem>
              <MenuItem value={'ko'}>Korean</MenuItem>
            </Select> */}
              <form
                autoComplete='off'
                onChange={(e) => handleFormChange(e)}
                onSubmit={!codeSent ? (e) => sendVerificationCode(e) : (e) => confirmVerificationCode(e)}
                className={classes.form}>
<FormControl variant="outlined">
                  <InputLabel htmlFor="component-outlined"> Phone Number </InputLabel>
                  <OutlinedInput
                    // error={emailErrors.some(code => code === loginError.code) ? true : false}
                    type='text'
                    name='phoneNumber' id="component-outlined" label='Email'
                    value={loginFields.phoneNumber}
                    disabled={verified || verificationUpdated}
                  />
                </FormControl>

                {/* {loginError && <p style={{ color: 'red', textAlign: 'center' }}> {loginError.message} </p>} */}
                <div id="recaptcha-container"></div>


{!verified && <FormControl variant="outlined">
  <InputLabel htmlFor="outlined-verification-code">Verification Code</InputLabel>
  <OutlinedInput
    id="outlined-verification-code"
    name='verificationCode'
    labelWidth={70}
    value={verificationUpdated ? 'Verified!' : loginFields.verificationCode}
    disabled={!codeSent}
  />
</FormControl> }

                <Button disabled={isLoading || verified || verificationUpdated}
                  className={classes.button} type='submit'
                  variant='outlined'
              color='primary'>
                { verified || verificationUpdated ? 'Verified' :
                  !codeSent ? 'Send Code' : 'Verify Code' 
                  
                }

        {isLoading && <CircularProgress size={30} className={classes.progress} />}
                </Button>
                {/* {loginError && <Typography>{loginError}</Typography>} */}
                {/* {location.pathname !== '/admin/login' && */}
                {/* <Link style={{ textAlign: 'center' }} to='/forgot_password'> Forgot password? </Link>} */}

              </form>

              {/* {location.pathname !== '/admin/login' && <Link to='/register'> Don't have an account? Sign up </Link>} */}
              </Paper>
            </div>
  )
}


export default AddPhone