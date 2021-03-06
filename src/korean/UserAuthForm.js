import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom'
import { authorization, snackbar_messages } from './LanguageSkeleton'
import {
  Typography,
  Box,
  Button,
  FormControlLabel,
  Radio,
  Snackbar,
  Checkbox,
  Tooltip
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiAlert from '@material-ui/lab/Alert';
import auth from '../lib/auth'
import HelpIcon from '@material-ui/icons/Help';
import { firebaseApp } from '../lib/firebase';
import * as firebase from "firebase";
import { AuthContext } from '../lib/context';
import ReactPixel from 'react-facebook-pixel'

const options = {
  autoConfig: true, 
  debug: false,
};
ReactPixel.init('331288028562698', options);

const UserAuthForm = ({ locale, history }) => {


  const [forgottenPassword, setForgottenPassword] = useState(false)
  const [registrationOrLogin, setRegistrationOrLogin] = useState('login')
  const [isLoading, setIsLoading] = useState(false)
  const [checkedTermsConditions, setCheckedTermsConditions] = useState(false)
  const [registerDetails, setRegisterDetails] = useState({
    category: 'player',
    email: '',
    password: '',
    confirm_password: '',
    player_first_name: '',
    player_last_name: '',
  })
  const [message, setMessage] = useState(null)
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [phoneVerifyRequired, setPhoneVerifyRequired] = useState(false)
  const [hints, setHints] = useState([])
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationId, setVerificationId] = useState(null)
  const [resolver, setResolver] = useState({})
  const [captchad, setCaptchad] = useState(false)
  const captchaRef = useRef(null);
  const { recaptchaVerifier, phoneAuthProvider } = useContext(AuthContext)
  const appAuth = firebaseApp.auth()
  appAuth.languageCode = locale


  const setupRecaptcha = () => {
    window.recaptchaVerifier = recaptchaVerifier(
      'recaptcha-container',
      {
        'size': 'invisible',
        'callback': function (response) {
          console.log('captcha!')
          handleSolved()

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

  }, [])

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...(registrationOrLogin !== 'login' && {
        paddingTop: '90px',
      }),
      [theme.breakpoints.up('sm')]: {
        paddingTop: '0'
      },
    },
    main: {
      height: '63vh',
      display: 'flex',
      width: '85%',
      flexDirection: 'column',
      justifyContent: 'space-around',
      transform: 'translateY(5vh)',
      [theme.breakpoints.up('sm')]: {
        height: '54vh',
        width: 'auto',
        // textAlign: 'initial',
      },

    },
    boldText: {
      color: '#3100F7',

      [theme.breakpoints.up('sm')]: {
        '&:nth-of-type(1)': {
          transform: 'translate(-75px, -25px)'
        },
      },
    },
    form: {
      marginBottom: '20px',
      [theme.breakpoints.up('sm')]: {
        '&:nth-of-type(1)': {
          transform: 'translateX(80px)'
        },
      },
    },
    inputContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '15px 0'
    },
    inputP: {
      [theme.breakpoints.up('sm')]: {
        alignSelf: 'flex-end'
      }
    },
    link: {
      fontSize: '15px',
      textDecoration: 'underline'
    },
    button: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      transform: 'translateX(0)',
      marginTop: '20px',
      [theme.breakpoints.up('sm')]: {
        transform: 'translateX(32px)',
      },
    },
    progress: {
      position: 'absolute'
    },
    formFooter: {
      paddingBottom: '60px',
      [theme.breakpoints.up('sm')]: {
        transform: 'translateX(-30px)',
        paddingBottom: '0px',
      },
    },
    radio: {
      transform: 'translate(0px, 7px)',

      [theme.breakpoints.up('sm')]: {
        transform: 'translate(160px, 8px)',

      },

    },
    helper: {
      fontSize: '12px',
      transform: 'translate(0px, 0px )',
      [theme.breakpoints.up('sm')]: {
        transform: 'translate(182px, 0px)',
      },
    },
    password_help: {
      marginLeft: '10px',
      [theme.breakpoints.up('sm')]: {
        marginLeft: '0px',
        transform: 'translateX(90px)'
      },
    }

  }));



  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const handleRadioButtonChange = () => {
    const { category } = registerDetails
    setRegisterDetails({
      ...registerDetails,
      category: category === 'player' ? 'parent' : 'player'
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setRegisterDetails({ ...registerDetails, [name]: value })
  }

  const handleAfterRequestStates = (message) => {
    setMessage(message)
    setOpen(true)
    setIsLoading(false)
  }

  const handleSolved = () => {
    setCaptchad(true)
    setIsLoading(false)
  }

  const handleRecaptcha = () => {
    var cred = firebase.auth.PhoneAuthProvider.credential(
      verificationId, verificationCode);
    // console.log(cred)
    var multiFactorAssertion =
      firebase.auth.PhoneMultiFactorGenerator.assertion(cred);
    // Complete sign-in.

    resolver.resolveSignIn(multiFactorAssertion)
      .then(function (data) {
        // User successfully signed in with the second factor phone number.
        // console.log(data)
        axios.get(`/users/${data.user.uid}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
          .then(res => {
            // console.log(res.data)
            const { category } = res.data[0]
            handleAfterRequestStates({
              success: `${snackbar_messages['7a'][locale]} ${snackbar_messages['9'][locale]}`
            })

            setTimeout(async () => {
              if (category === 'player' || category === 'parent') {
                history.push(`/user/${auth.getUserId()}`)
              } else if (category === 'company') {
                history.push('/tester')
              } else {
                history.push('/testercoach')
              }
            }, 1000)
          })
      })
  }

  const frontendLogin = () => {

    const { email, password } = registerDetails
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .then(data => {
        if (data.user.emailVerified) {
        axios.get(`/users/${data.user.uid}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
          .then(res => {
            // console.log(res)
            const { category } = res.data[0]
            localStorage.setItem('category', category)

            handleAfterRequestStates({
              success: `${snackbar_messages['7a'][locale]} ${snackbar_messages['9'][locale]}`
            })

            setTimeout(async () => {
              if (category === 'admin') {
                history.push('/dashboard')
              } else if (['player', 'parent', 'test'].includes(category)) {
                history.push(`/user/${auth.getUserId()}`)
              } else if (category === 'company') {
                history.push('/tester')
              } else {
                history.push('/testercoach')
              }
            }, 1000)
          })
        } else {
            firebaseApp.auth().currentUser.sendEmailVerification().then(() => {
              
              firebaseApp.auth().signOut()
              handleAfterRequestStates({ error: `${snackbar_messages['10'][locale]}` })
              
            })
            }
      })
      .catch(error => {
        // console.log(error)
        if (error.code === 'auth/multi-factor-auth-required') {
          setResolver(error.resolver)
          setHints(error.resolver.hints[0])
          setPhoneVerifyRequired(true)
          // Ask user which second factor to use.
          if (error.resolver.hints[selectedIndex].factorId ===
            firebase.auth.PhoneMultiFactorGenerator.FACTOR_ID) {
            const phoneInfoOptions = {
              multiFactorHint: error.resolver.hints[selectedIndex],
              session: error.resolver.session
            };


            // Send SMS verification code
            return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, window.recaptchaVerifier)
              .then(function (verificationId) {

                setVerificationId(verificationId)

              }).catch(err => console.log(err))
          } else {
            // Unsupported second factor.
          }
        } else {
          // console.log(error)
          handleAfterRequestStates({
            error: snackbar_messages['7c'][locale]
          })
        }
      })
  }

  // function loginUser() {
  //   const { email, password } = registerDetails
  //   axios.post('/login', { email, password })
  //     .then(res => {
  //       const { application_fee_paid, token, stripeId, userId } = res.data
  //       const fee_needed = application_fee_paid === 'unpaid' && moment().isAfter(moment('03/20/2021'))

  //       auth.setToken(token)


  //       handleAfterRequestStates({
  //         success: `${snackbar_messages['7a'][locale]} ${snackbar_messages['9'][locale]}`
  //       })

  //       setTimeout(async () => {

  //         history.push({
  //           pathname: `/user/${userId}`,
  //           state: {
  //             application_fee_paid,
  //             stripeId,
  //             fee_needed
  //           }
  //         })
  //       }, 1000)

  //     })
  //     .catch(err => {
  //       console.log(err)
  //       handleAfterRequestStates({
  //         error: snackbar_messages['7c'][locale]
  //       })
  //     })
  // }

  function handleUserAuth(text) {
    const { email, password } = registerDetails
    setIsLoading(true)
    // console.log(text)
    switch (text) {

      case 'RESET PASSWORD':
      case '???????????? ?????????':
        axios.post('/resetpassword', { email })
          .then(res => handleAfterRequestStates({
            success: snackbar_messages['7d'][locale]
          }))
          .catch(err => handleAfterRequestStates({
            error: snackbar_messages['7c'][locale]
          }))

        break;

      case 'SIGN IN':
      case '?????????':
        // console.log(email, password)
        // loginUser()
        frontendLogin()
        break;

      case 'CREATE ACCOUNT':
      case '?????? ??????':
        if (!checkedTermsConditions) {
          handleAfterRequestStates({
            error: 'Please indicate that you have read and understood the Terms & Conditions'
          })
          return
        }        
        ReactPixel.trackCustom('Registration', 'User created an account');
        registerDetails.language = locale
        axios.post('/registerUserViaApplication', registerDetails)
          .then(res => {
            handleAfterRequestStates({
              success: snackbar_messages['7f'][locale]
            })
            setRegistrationOrLogin('login')
          })
          .catch(err => handleAfterRequestStates(err.response.data))

        break;

      case 'VERIFY CODE':
        // console.log(email, password)
        // loginUser()
        handleRecaptcha()
        break;

      default:
        break;
    }


  }

  const terms_paragraph = (
    locale === 'ko' ?  <p><a target='_blank' rel="noopener noreferrer" href='https://firebasestorage.googleapis.com/v0/b/football-hub-4018a.appspot.com/o/ftballer%20T%26C%20-%20Korean.pdf?alt=media&token=1a21f4d1-0f0a-44d9-b21d-b1d9273e6bb4'> ?????? </a> ?????? </p> 
    : <p> I agree to the <a target='_blank' rel="noopener noreferrer" href='https://firebasestorage.googleapis.com/v0/b/football-hub-4018a.appspot.com/o/Phase%201-%20Player%20consent%20to%20data%20collection_%20(1).pdf?alt=media&token=3ae116e8-b4dc-4da4-a3b8-d2eb063b4403'> Terms & Conditions </a> </p>
  );

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <main className={classes.main}>

        <Typography component='div' >
          <Box
            className={classes.boldText}
            fontSize={25} fontWeight="fontWeightBold" m={0}>
            {authorization['1a'][locale]} {registrationOrLogin === 'login' ? authorization['5ab'][locale] : authorization['5a'][locale]}
          </Box>
          {registrationOrLogin === 'login' && <>
            <Box
              className={classes.boldText}
              fontSize={16} fontWeight="fontWeightBold" m={0}>
              {registrationOrLogin === 'login' ? authorization['2a'][locale] : authorization['2b'][locale]}
            </Box>
            <Box
              fontSize={15} fontWeight="fontWeightRegular" m={0}>
              {registrationOrLogin === 'login' ?
                authorization['3a'][locale] :
                authorization['3b'][locale]}
            </Box>
          </>}
        </Typography>



        <form className={classes.form} >

          {(!forgottenPassword && registrationOrLogin !== 'login') && (
            <>
              <FormControlLabel
                checked={registerDetails.category === 'parent'}
                onClick={() => handleRadioButtonChange()}
                name='category'
                className={classes.radio}
                control={<Radio />}
                label={authorization['4a'][locale]} />

              {locale === 'ko' ? <p className={classes.helper}> <span style={{ color: 'red' }}> * </span> 14??? ????????? ???????????? ???????????????(?????????)??? ?????? ??? ????????? ????????? ?????????. </p> : <p className={classes.helper}> <span style={{ color: 'red' }}> * </span> If you are under 14, a guardian <strong> must </strong>
                register on your behalf </p>
              }

              {registerDetails.category === 'parent' &&
                <div class="field" className={classes.inputContainer}>
                  <p
                    className={classes.inputP}
                    // style={{ alignSelf: 'flex-end' }}
                    class="control">

                    <span style={{ color: 'red' }}>
                      *
                      </span>

                    {authorization['4b'][locale]}

                    <input
                      onChange={(e) => handleFormChange(e)}
                      name='guardian_first_name'
                      placeholder={locale === 'ko' ? '??????' : 'First Name'}
                      class='input'
                      style={{
                        marginLeft: 10,
                        transform: 'translateY(2px)',
                        width: '170px'
                      }}
                      type="text" />
                    <input
                      onChange={(e) => handleFormChange(e)}
                      placeholder={locale === 'ko' ? '???' : 'Last Name'}
                      name='guardian_last_name'
                      class='input'
                      style={{
                        marginLeft: 10,
                        transform: 'translateY(2px)',
                        width: '170px'
                      }}
                      type="text" />
                  </p>
                </div>
              }


              <div class="field" className={classes.inputContainer}>
                <p
                  className={classes.inputP}
                  class="control" >
                  <span
                    style={{ color: 'red' }}> *  </span>  {authorization['4c'][locale]}
                  <input
                    onChange={(e) => handleFormChange(e)}
                    placeholder={locale === 'ko' ? '??????' : 'First Name'}
                    name='player_first_name'
                    class='input'
                    style={{
                      marginLeft: 10,
                      transform: 'translateY(2px)',
                      width: '170px'
                    }}
                    type="text" />
                  <input
                    onChange={(e) => handleFormChange(e)}
                    placeholder={locale === 'ko' ? '???' : 'Last Name'}
                    name='player_last_name'
                    class='input'
                    style={{
                      marginLeft: 10,
                      transform: 'translateY(2px)',
                      width: '170px'
                    }}
                    type="text" />
                </p>
              </div>
            </>
          )}
          {!phoneVerifyRequired &&
            <div class="field" className={classes.inputContainer}>
              <p
                // style={{ alignSelf: 'flex-end' }}
                className={classes.inputP}
                class="control" >
                <span
                  style={{ color: 'red' }}> *  </span>  {authorization['4d'][locale]}
                <input
                  onChange={(e) => handleFormChange(e)}
                  class='input'
                  name='email'
                  style={{
                    marginLeft: 10,
                    transform: 'translateY(2px)',
                    width: '350px'
                  }}
                  type="email" />
              </p>
            </div>
          }

          {((!forgottenPassword && !phoneVerifyRequired) &&
            <>
              <div class="field" className={classes.inputContainer}>
                <p
                  className={classes.inputP}
                  style={{ position: 'relative' }}
                  class="control" >
                  <span
                    style={{ color: 'red' }}> *  </span> {authorization['4e'][locale]}
                  <input
                    onChange={(e) => handleFormChange(e)}
                    name='password'
                    class='input'
                    style={{
                      marginLeft: 10,
                      transform: 'translateY(2px)',
                      width: '350px'
                    }}
                    type="password" />

                  {registrationOrLogin !== 'login' &&
                    <Tooltip enterTouchDelay={1} title={<>
                      {authorization['9'][locale].split('/').map(x => <li> {x} </li>)}
                    </>}
                      placement="bottom-start">
                      <Button style={{ position: 'absolute', right: '-1rem', top: '0.23rem' }}> <HelpIcon /> </Button>
                    </Tooltip>}


                </p>

              </div>

              {registrationOrLogin !== 'login' && (
                <>
                  <div class="field" className={classes.inputContainer}>
                    <p
                      // style={{ alignSelf: 'flex-end' }}
                      className={classes.inputP}
                      class="control" >
                      <span
                        style={{ color: 'red' }}> *  </span>  {authorization['4f'][locale]}
                      <input
                        onChange={(e) => handleFormChange(e)}
                        name='confirm_password'
                        class='input'
                        style={{
                          marginLeft: 10,
                          transform: 'translateY(2px)',
                          width: '350px'
                        }}
                        type="password" />
                    </p>
                  </div>

                  <FormControlLabel
                    className={classes.radio}
                    onClick={() => setCheckedTermsConditions(!checkedTermsConditions)}
                    style={{ margin: '-30px -13px' }}
                    control={
                      <Checkbox
                        checked={checkedTermsConditions}
                        color="secondary"
                      />
                    }
                    label={terms_paragraph}
                  />

                </>
              )}

            </>
          )}
          {phoneVerifyRequired &&
            <div>

              <div class="field" className={classes.inputContainer}>
                <p
                  // style={{ alignSelf: 'flex-end' }}
                  className={classes.inputP}
                  class="control" >
                  <span
                    style={{ color: 'red' }}> *  </span>  {authorization['4g'][locale]}
                  <input
                    onChange={(e) => setVerificationCode(e.target.value)}
                    name='verificationCode'
                    class='input'
                    style={{
                      marginLeft: 10,
                      transform: 'translateY(2px)',
                      width: '350px'
                    }}
                    type="text" />
                </p>
              </div>

            </div>
          }

          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"
              disabled={isLoading}
              onClick={(e) => handleUserAuth(e.target.innerText)}
            // endIcon={<ArrowForwardIcon />}
            >
              {phoneVerifyRequired ? 'Verify Code' : !forgottenPassword ? registrationOrLogin === 'login' ? authorization['5b'][locale] :
                authorization['5a'][locale] : authorization['5c'][locale]}
              {isLoading && <CircularProgress size={30} className={classes.progress} />}
            </Button>

            <Link
              style={{ margin: '8px 0 0 15px ' }}
              onClick={() => setForgottenPassword(!forgottenPassword)}
              className={classes.link}>
              {!forgottenPassword ? registrationOrLogin === 'login' ? authorization['6'][locale] : '' : authorization['5b'][locale]} </Link>

          </div>

        </form>

        <Typography
          className={classes.formFooter}
          component='div'>
          <Box
            style={{ color: '#3100F7' }}
            fontSize={25} fontWeight="fontWeightBold" m={0}>
            {registrationOrLogin === 'login' ? authorization['7b'][locale] : authorization['7a'][locale]}
          </Box>
          <Box
            fontSize={14} fontWeight="fontWeightRegular" m={0}>
            {locale === 'ko' ? registrationOrLogin === 'login' ? authorization['8b'][locale] : authorization['8a'][locale] : ''} <Link className={classes.link}
              onClick={() => {
                setRegistrationOrLogin(registrationOrLogin === 'registration' ? 'login' : 'registration')
                registrationOrLogin === 'login' && setForgottenPassword(false)
              }}>
              {registrationOrLogin === 'login' ? authorization['1b'][locale].split(':')[1].trim()
                : authorization['5b'][locale]}</Link> {locale === 'en' ? registrationOrLogin === 'login' ? authorization['8b'][locale] : authorization['8a'][locale] : ''}
          </Box>
        </Typography>

      </main>


      {message && <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={closeSnackBar}>
        <Alert onClose={closeSnackBar} severity={message.success ? 'success' : 'error'}>
          {message.success ?
            message.success :
            message.error ?
              message.error : (
                Object.keys(message).map(x => <li> {message[x]} </li>)
              )}
        </Alert>
      </Snackbar>}
      <div id="recaptcha-container"></div>
    </div>


  );
};

export default UserAuthForm;