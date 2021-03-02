import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import {
  Typography,
  Box,
  Button,
  FormControlLabel,
  Radio,
  Snackbar
} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import EmailSharpIcon from '@material-ui/icons/EmailSharp';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiAlert from '@material-ui/lab/Alert';
import auth from '../lib/auth'
import { useStripe } from "@stripe/react-stripe-js";

const UserAuthForm = ({ locale, history }) => {
  const stripe = useStripe()
  const [forgottenPassword, setForgottenPassword] = useState(false)
  const [registrationOrLogin, setRegistrationOrLogin] = useState('login')
  const [isLoading, setIsLoading] = useState(false)
  const [registerDetails, setRegisterDetails] = useState({
    category: 'player',
    email: '',
    password: '',
    confirm_password: '',
    player_name: ''
  })
  const [message, setMessage] = useState(null)
  const [open, setOpen] = useState(false)

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
      color: 'orange',

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
      [theme.breakpoints.up('sm')]: {
        transform: 'translateX(-30px)'
      },
    },
    radio: {
      transform: 'translate(0px, 7px)',
      [theme.breakpoints.up('sm')]: {
        transform: 'translate(160px, 8px)',
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

  function loginUser() {
    const { email, password, player_name } = registerDetails
    axios.post('/login', { email, password })
      .then(res => {
        const { application_fee_paid, token, stripeId, applications } = res.data
        const fee_needed = application_fee_paid === 'unpaid'

        console.log(res.data[0])
        auth.setToken(token)

        handleAfterRequestStates({
          success: `User has logged in. Redirecting to ${fee_needed ? 'payment' : 'application'}...`
        })

        setTimeout(async () => {

          if (application_fee_paid === 'unpaid') {
            let checkout = await axios.post('/korean-application-fee', {
              stripeId,
              email
            })
            const session = await checkout.data

            const result = await stripe.redirectToCheckout({
              sessionId: session.id,
            })

            if (result.error) {
              handleAfterRequestStates({ error: 'Could not redirect you to payment. Please try again.' })
            }
          } else {
            const { benfica_application } = applications
            if (benfica_application && benfica_application.submitted) {
              history.push('/success=true')
            } else {
              history.push('/application')
            }

          }

        }, 1000);

      })
      .catch(err => handleAfterRequestStates({
        error: 'Invalid credentials'
      }))
  }

  function handleUserAuth(text) {
    const { email, password, player_name } = registerDetails
    setIsLoading(true)
    switch (text) {

      case 'Reset Password':
        axios.post('/resetpassword', { email })
          .then(res => handleAfterRequestStates({
            success: 'An email has been sent to your inbox to reset your password.'
          }))
          .catch(err => handleAfterRequestStates({
            error: 'Invalid credentials'
          }))

        break;

      case 'Sign In':
        console.log(email, password)
        loginUser()
        break;

      case 'Create Account':

        axios.post('/registerUserViaApplication', registerDetails)
          .then(async res => {
            handleAfterRequestStates({
              success: 'An email has been sent to your inbox to validate your email address.'
            })
            setRegistrationOrLogin('login')
          })
          .catch(err => handleAfterRequestStates(err.response.data))

        break;

      default:
        break;
    }


  }


  const classes = useStyles()

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Typography component='div' >
          <Box
            className={classes.boldText}
            fontSize={20} fontWeight="fontWeightBold" m={0}>
            Indulge Benfica Camp: {registrationOrLogin === 'login' ? 'Sign In' : 'Create an Account'}
          </Box>
          <Box
            className={classes.boldText}
            fontSize={16} fontWeight="fontWeightBold" m={0}>
            {registrationOrLogin === 'login' ? 'Already have an account?' : 'Not a registered player yet?'}
          </Box>
          <Box
            fontSize={15} fontWeight="fontWeightRegular" m={0}>
            Enter your {registrationOrLogin === 'login' ?
              'email address and password (both are case-sensitive).' :
              'details to create your account (fields are case-sensitive).'}
          </Box>
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
                label="I am a parent registering for my child" />

              {registerDetails.category === 'parent' &&
                <div class="field" className={classes.inputContainer}>
                  <p
                    style={{ alignSelf: 'flex-end' }}
                    class="control" >
                    <span
                      style={{ color: 'red' }}> *  </span> Parent Name:
          <input
                      onChange={(e) => handleFormChange(e)}
                      name='parent_name'
                      class='input'
                      style={{
                        marginLeft: 10,
                        transform: 'translateY(2px)',
                        width: '350px'
                      }}
                      type="text" />
                  </p>
                </div>
              }


              <div class="field" className={classes.inputContainer}>
                <p
                  style={{ alignSelf: 'flex-end' }}
                  class="control" >
                  <span
                    style={{ color: 'red' }}> *  </span> Player Name:
              <input
                    onChange={(e) => handleFormChange(e)}
                    name='player_name'
                    class='input'
                    style={{
                      marginLeft: 10,
                      transform: 'translateY(2px)',
                      width: '350px'
                    }}
                    type="text" />
                </p>
              </div>
            </>
          )}

          <div class="field" className={classes.inputContainer}>
            <p
              style={{ alignSelf: 'flex-end' }}
              class="control" >
              <span
                style={{ color: 'red' }}> *  </span> Email Address:
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

          {(!forgottenPassword &&
            <>
              <div class="field" className={classes.inputContainer}>
                <p
                  style={{ alignSelf: 'flex-end' }}
                  class="control" >
                  <span
                    style={{ color: 'red' }}> *  </span> Password:
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
                </p>
              </div>

              {registrationOrLogin !== 'login' && (
                <div class="field" className={classes.inputContainer}>
                  <p
                    style={{ alignSelf: 'flex-end' }}
                    class="control" >
                    <span
                      style={{ color: 'red' }}> *  </span> Confirm Password:
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
              )}

            </>
          )}

          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"
              disabled={isLoading}
              onClick={(e) => handleUserAuth(e.target.innerHTML)}
            // endIcon={<ArrowForwardIcon />}
            >
              {!forgottenPassword ? registrationOrLogin === 'login' ? 'Sign In' : 'Create Account' : 'Reset Password'}
              {isLoading && <CircularProgress size={30} className={classes.progress} />}
            </Button>

            <Link
              style={{ margin: '8px 0 0 15px ' }}
              onClick={() => setForgottenPassword(!forgottenPassword)}
              className={classes.link}>
              {!forgottenPassword ? registrationOrLogin === 'login' ? 'Forgot your password?' : '' : 'Sign In'} </Link>

          </div>

        </form>

        <Typography
          className={classes.formFooter}
          component='div'>
          <Box
            style={{ color: 'orange' }}
            fontSize={16} fontWeight="fontWeightBold" m={0}>
            {registrationOrLogin === 'login' ? 'Not a registered player yet?' : 'Already have an account?'}
          </Box>
          <Box
            fontSize={14} fontWeight="fontWeightRegular" m={0}>
            <Link className={classes.link}
              onClick={() => {
                setRegistrationOrLogin(registrationOrLogin === 'registration' ? 'login' : 'registration')
                registrationOrLogin === 'login' && setForgottenPassword(false)
              }}>
              {registrationOrLogin === 'login' ? 'Create an account' : 'Sign in'}</Link> to
continue your application for the Indulge Benfica Camp.
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

    </div>


  );
};

export default UserAuthForm;