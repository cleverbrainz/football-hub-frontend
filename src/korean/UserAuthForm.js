import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import {
  Typography,
  Grid,
  Fab,
  Box,
  Switch,
  Card,
  CardActions,
  CardContent,
  Button,
  InputAdornment,
  FormControl,
  Input,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import EmailSharpIcon from '@material-ui/icons/EmailSharp';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';



const UserAuthForm = ({ locale }) => {
  const [forgottenPassword, setForgottenPassword] = useState(false)
  const [registrationOrLogin, setRegistrationOrLogin] = useState('login')
  const [registerDetails, setRegisterDetails] = useState({
    category: 'player'
  })

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
      display: 'flex',
      justifyContent: 'center',
      transform: 'translateX(0)',
      marginTop: '20px',
      [theme.breakpoints.up('sm')]: {
        transform: 'translateX(32px)',
      },
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

  function handleRadioButtonChange() {
    const { category } = registerDetails
    if (category === 'parent') {
      setRegisterDetails({ ...registerDetails, category: 'player' })
    } else {
      setRegisterDetails({ ...registerDetails, category: 'parent' })
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



        <form className={classes.form} action="">

          {(!forgottenPassword && registrationOrLogin !== 'login') && (
            <>
              <FormControlLabel
                checked={registerDetails.category === 'parent'}
                onClick={handleRadioButtonChange}
                className={classes.radio}
                value="parent" control={<Radio />}
                label="I am a parent registering for my child" />

              {registerDetails.category === 'parent' &&
                <div class="field" className={classes.inputContainer}>
                  <p
                    style={{ alignSelf: 'flex-end' }}
                    class="control" >
                    <span
                      style={{ color: 'red' }}> *  </span> Parent Name:
          <input
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
              <input class='input'
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
            // onClick={() => console.log(registerDetails.category)}
            // onClick={() => history.push('/apply')}
            // endIcon={<ArrowForwardIcon />}
            >
              {!forgottenPassword ? registrationOrLogin === 'login' ? 'Sign In' : 'Create Account' : 'Reset Password'}
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


    </div>
  );
};

export default UserAuthForm;