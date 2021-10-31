import React, { useState, useEffect, useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import VisibilityOffSharpIcon from '@material-ui/icons/VisibilityOffSharp';
import VisibilitySharpIcon from '@material-ui/icons/VisibilitySharp';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import auth from '../../lib/auth'
import { AuthContext } from "../../lib/context";
import { firebaseApp } from '../../lib/firebase';
import {
  MenuItem,
  Select,
  Paper
} from '@material-ui/core'
import { verification } from '../../korean/LanguageSkeleton'
import * as firebase from "firebase";
import PhoneDropDown from '../../korean/PhoneDropdown';

const AddPhone = ({ location, history, locale }) => {

  const useStyles = makeStyles((theme) => ({
    container: {
      boxSizing: 'border-box',
      width: '80%',
      margin: '0 auto',
      height: '70vh',
      minHeight: '800px',
      // paddingTop: '110px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px rgb(0 0 0 / 20%)',
      borderRadius: '5px',
      boxShadow: 'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 10%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px;'

    },
    form: {
      margin: '10px auto',
      // width: '60%',
      // minWidth: '300px',
      // maxWidth: '600px',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '600px',
      justifyContent: 'center',
      
    },
    button: {
      marginTop: '10px',
      position: 'relative',
      backgroundColor: 'rgb(49, 1, 247)',
      color: 'white',
      fontSize: '12px',
      letterSpacing: '2px',
      height: '50px',
      '&:hover': {
        color: 'black'
      }
    },
    disabledButton: {
      marginTop: '10px',
      position: 'relative',
      color: 'rgb(49, 1, 247)',
      backgroundColor: 'white',
      fontSize: '12px',
      letterSpacing: '2px',
      height: '50px',
      '&:hover': {
        opacity: '0.8'
      }
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
      margin: '90px 20px 0px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold'
    },
    verificationCodeWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    verificationCode: {
      height: '2px',
      width: '100%',
      transition: '0.5s'
    },
    verificationCodeSent: {
      height: '50px',
      width: '100%',
      transition: '0.5s'
    }
  }));


  const { user, setUserData, userData, phoneAuthProvider, recaptchaVerifier } = useContext(AuthContext);

  // console.log(user.user.multiFactor.enrolledFactors[0].phoneNumber)
  const [isLoading, setIsLoading] = useState(false)
  const [loginFields, setLoginFields] = useState({
    phoneNumber: user.user.multiFactor?.enrolledFactors[0]?.phoneNumber ? user.user.multiFactor?.enrolledFactors[0]?.phoneNumber.slice(3) : '',
    countryCode: user.user.multiFactor?.enrolledFactors[0]?.phoneNumber ? user.user.multiFactor?.enrolledFactors[0]?.phoneNumber.slice(1, 3) : '',
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

  const setupRecaptcha = () => {
    window.recaptchaVerifier = recaptchaVerifier(
      'recaptcha-container',
      {
        'size': 'invisible',
        'callback': function (response) {
          console.log('captcha!')
          // handleRecaptch()  
        },
        'expired-callback': function () {
          console.log('captcha expired')
        },
        'hl': locale
      });
  
      window.recaptchaVerifier.render()
  }

  useEffect(() => { 
    setupRecaptcha()
    
  },[])



  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...loginFields, [name]: value }
    setLoginError('')
    setLoginFields(fields)
    // console.log(loginFields)

  }

  function sendTestVerification(e) {
    e.preventDefault()
    setCodeSent(true)
  }

  function sendVerificationCode(e) {
    e.preventDefault()

    currentUser.multiFactor.getSession()
      .then(multiFactorSession => {

        
        // window.recaptchaVerifier = recaptchaVerifier(
        //   'recaptcha-container',
        //   {
        //     'size': 'invisible',
        //     'callback': function (response) {
        //       // reCAPTCHA solved, you can proceed with phoneAuthProvider.verifyPhoneNumber(...).
        //       // ...
        //       // handleRecaptcha()
        //       console.log('captchadddd')

        //     },
        //     'expired-callback': function () {
        //       // Response expired. Ask user to solve reCAPTCHA again.
        //       // ...
        //       // console.log('uh oh')
        //     },
        //     'hl': locale
        //   },
        //   firebaseApp);
        const phoneInfoOptions = {
          phoneNumber: ['+', loginFields.countryCode, loginFields.phoneNumber].join(''),
          session: multiFactorSession
        };
        return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, window.recaptchaVerifier);
      }).then(function (verificationId) {
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
      .then(function () {
        // Second factor enrolled.
        // console.log('secondFactorEnrolled')
        setVerificationUpdated(true)
        setCodeSent(false)
      });
  }




  if (!user.user) return null
  return (
    <div className={classes.container}>

      {/* <Paper elevation={3} className={classes.paper}> */}
      <Button className={`${classes.button} ${classes.back}`} variant='outlined' onClick={() => history.push(`/user/${auth.getUserId()}`)}>{verification['1e'][locale]}</Button>

      <div style={{width:'90%', margin: '0 auto'}}>
      <Typography component='div' >
        <Box
          fontSize={20}
          align='center'
          fontWeight="fontWeightBold" mb={2}>
          {verification['1a'][locale]}
           </Box>

        <Box
          fontSize={14}
          align='center'
          fontWeight="fontWeightRegular" mb={3}>
          {verification['1b'][locale].split(' / ').join("\n")}
           </Box>
      </Typography>

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
          // onSubmit={!codeSent ? (e) => sendTestVerification(e) : (e) => confirmVerificationCode(e)}
          className={classes.form}>
                    <div className={classes.field}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span> {verification['1f'][locale]}
               </label>
              </div>
              <div className="field has-addons" style={{marginBottom: '10px'}}>
              {verified ? 
              <p class="control is-expanded">
              <input
                name='phoneNumber'
                value={['+', loginFields.countryCode, loginFields.phoneNumber].join('')}
                disabled={verified}
                class="input" type="tel" placeholder='123456789' />
            </p>         
               :
               <>
                <p class="control">
                <a class="button" disabled={verified}  >
                  <select disabled={verified} value={loginFields.countryCode} id="countryCode" name="countryCode"> 
                    <PhoneDropDown locale={locale} />
                  </select>
                </a>
                </p>
                <p class="control is-expanded">
                  <input
                    name='phoneNumber'
                    value={loginFields.phoneNumber}
                    disabled={verified}
                    class="input" type="tel" placeholder='123456789' />
                    </p>              
                    </>
                  }
              </div>
            </div>

          {/* {loginError && <p style={{ color: 'red', textAlign: 'center' }}> {loginError.message} </p>} */}
          


          {!verified && <FormControl variant="outlined">
            <div className={classes.verificationCodeWrapper}>
            {codeSent && <InputLabel htmlFor="outlined-verification-code">{verification['1c'][locale]}</InputLabel>}
            <OutlinedInput
              id="outlined-verification-code"
              label='Verification Code'
              name='verificationCode'
              labelWidth={70}
              className={!codeSent ? classes.verificationCode: classes.verificationCodeSent}
              value={verificationUpdated ? verification['1d'][locale].split(' / ')[2] : loginFields.verificationCode}
              disabled={!codeSent} />
              </div>
          </FormControl>}


        {/* // <FormControl variant="outlined">
        //   <InputLabel htmlFor="outlined-verification-code">Verification Code</InputLabel>
        //   <OutlinedInput
        //     id="outlined-verification-code"
        //     label='Verification Code'
        //     name='verificationCode'
        //     labelWidth={70}
        //     value={verificationUpdated ? 'Verified!' : loginFields.verificationCode}
        //     disabled={!codeSent}
        //   />
        // </FormControl> */}

        <Button disabled={isLoading || verified || verificationUpdated}
          className={verified ? classes.disabledButton : classes.button} type='submit'
          variant='outlined'
          classes={{disabled: classes.disabledButton}}
          >
          {verified || verificationUpdated ? verification['1d'][locale].split(' / ')[2] :
            !codeSent ? verification['1d'][locale].split(' / ')[0] : verification['1d'][locale].split(' / ')[1] }

          {isLoading && <CircularProgress size={30} className={classes.progress} />}
        </Button>
        {/* {loginError && <Typography>{loginError}</Typography>} */}
        {/* {location.pathname !== '/admin/login' && */}
        {/* <Link style={{ textAlign: 'center' }} to='/forgot_password'> Forgot password? </Link>} */}

      </form>

      {/* {location.pathname !== '/admin/login' && <Link to='/register'> Don't have an account? Sign up </Link>} */}
      {/* </Paper> */}
      
    </div>
    <div id="recaptcha-container"></div>
    </div>
  )
}


export default AddPhone