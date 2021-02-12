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
  Input
} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import EmailSharpIcon from '@material-ui/icons/EmailSharp';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  main: {
    height: '63vh',
    display: 'flex',
    // textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    transform: 'translateY(5vh)',
    [theme.breakpoints.up('md')]: {
      height: '54vh',
      // textAlign: 'initial',
    },

  },
  boldText: {
    color: 'orange',

    [theme.breakpoints.up('md')]: {
      '&:nth-of-type(1)': {
        transform: 'translate(-75px, -25px)'
      },
    },
  },
  form: {
    [theme.breakpoints.up('md')]: {
      '&:nth-of-type(1)': {
        transform: 'translateX(80px)'
      },
    },
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    '&:nth-of-type(2)': {
      margin: '20px 0'
    }
  },
  link: {
    fontSize: '15px',
    textDecoration: 'underline'
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    transform: 'translateX(18px)',
    marginTop: '15px'
  },
  formFooter: {
    [theme.breakpoints.up('md')]: {
      transform: 'translateX(-30px)'
    },
  }

}));

const ApplicationForm = ({ locale }) => {
  const classes = useStyles()

  const [forgottenPassword, setForgottenPassword] = useState(false)

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Typography component='div' >
          <Box
            className={classes.boldText}
            fontSize={20} fontWeight="fontWeightBold" m={0}>
            Indulge Benfica Camp: Sign In
          </Box>
          <Box
            className={classes.boldText}
            fontSize={16} fontWeight="fontWeightBold" m={0}>
            Already have an account?
          </Box>
          <Box
            fontSize={15} fontWeight="fontWeightRegular" m={0}>
            Enter your email address and password (both are case-sensitive).
          </Box>
          <Box
            style={{ transform: 'translateY(25px)' }}
            fontSize={15} fontWeight="fontWeightRegular" m={0}>
            <span style={{ color: 'red' }}> *</span> indicates a required field.
          </Box>
        </Typography>

        <form className={classes.form} action="">
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

          {!forgottenPassword && (
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
          )}

          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"

            // onClick={() => history.push('/apply')}
            // endIcon={<ArrowForwardIcon />}
            >
              {!forgottenPassword ? 'Sign In' : 'Reset Password'}
            </Button>

            <Link
              style={{ margin: '8px 0 0 15px ' }}
              onClick={() => setForgottenPassword(!forgottenPassword)}
              className={classes.link}>
              {!forgottenPassword ? 'Forgot your password?' : 'Sign In'} </Link>

          </div>

        </form>

        <Typography
          className={classes.formFooter}
          component='div'>
          <Box
            style={{ color: 'orange' }}
            fontSize={16} fontWeight="fontWeightBold" m={0}>
            Not a registered player yet?
          </Box>
          <Box
            fontSize={14} fontWeight="fontWeightRegular" m={0}>
            <Link className={classes.link} to='/'> Create an account </Link>
            to apply for the Indulge Benfica Camp.
          </Box>
        </Typography>

      </main>


    </div>
  );
};

export default ApplicationForm;