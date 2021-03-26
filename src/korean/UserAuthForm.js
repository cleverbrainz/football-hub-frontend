import React, { useState, useEffect } from 'react';
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
  FormControl
} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import EmailSharpIcon from '@material-ui/icons/EmailSharp';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress'
import MuiAlert from '@material-ui/lab/Alert';
import auth from '../lib/auth'
import moment from 'moment'

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

    },
    helper: {
      fontSize: '12px',
      transform: 'translate(0px, 0px )',
      [theme.breakpoints.up('sm')]: {
        transform: 'translate(182px, 0px)',
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
    const { email, password } = registerDetails
    axios.post('/login', { email, password })
      .then(res => {
        const { application_fee_paid, token, stripeId, userId } = res.data
        const fee_needed = application_fee_paid === 'unpaid' && moment().isAfter(moment('03/24/2021'))

        auth.setToken(token)


        handleAfterRequestStates({
          success: `${snackbar_messages['7a'][locale]} Redirecting to profile...`
        })

        setTimeout(async () => {

          history.push({
            pathname: `/user/${userId}`,
            state: {
            application_fee_paid,
            stripeId,
            fee_needed
          }
        })
       } ,1000)

      })
      .catch(err => {
        console.log(err)
        handleAfterRequestStates({
          error: snackbar_messages['7c'][locale]
        })
      })
  }

  function handleUserAuth(text) {
    const { email, password } = registerDetails
    setIsLoading(true)
    console.log(text)
    switch (text) {

      case 'Reset Password':
      case '비밀번호 재설정':
        axios.post('/resetpassword', { email })
          .then(res => handleAfterRequestStates({
            success: snackbar_messages['7d'][locale]
          }))
          .catch(err => handleAfterRequestStates({
            error: snackbar_messages['7c'][locale]
          }))

        break;

      case 'Sign In':
      case '로그인':
        console.log(email, password)
        loginUser()
        break;

      case 'Create Account':
      case '계정 등록':
        if (!checkedTermsConditions) {
          handleAfterRequestStates({
            error: 'Please indicate that you have read and understood the Terms & Conditions'
          })
          return
        }

        axios.post('/registerUserViaApplication', registerDetails)
          .then(async res => {
            handleAfterRequestStates({
              success: snackbar_messages['7f'][locale]
            })
            setRegistrationOrLogin('login')
          })
          .catch(err => handleAfterRequestStates(err.response.data))

        break;

      default:
        break;
    }


  }

  const terms_paragraph = (
    <p> I agree to the <a target='_blank' href='https://bit.ly/3sI1iS5'> Terms & Conditions </a> </p>
  );

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Typography component='div' >
          <Box
            className={classes.boldText}
            fontSize={20} fontWeight="fontWeightBold" m={0}>
            {authorization['1a'][locale]}: {registrationOrLogin === 'login' ? authorization['5b'][locale] : authorization['5a'][locale]}
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

              <p className={classes.helper}> <span style={{ color: 'red' }}> * </span> If you are under 14, a guardian <strong> must </strong>
                register on your behalf </p>

              {registerDetails.category === 'parent' &&
                <div class="field" className={classes.inputContainer}>
                  <p
                    style={{ alignSelf: 'flex-end' }}
                    class="control">

                    <span style={{ color: 'red' }}>
                      *
                      </span>

                    {authorization['4b'][locale]}

                    <input
                      onChange={(e) => handleFormChange(e)}
                      name='guardian_first_name'
                      placeholder='First Name'
                      class='input'
                      style={{
                        marginLeft: 10,
                        transform: 'translateY(2px)',
                        width: '170px'
                      }}
                      type="text" />
                    <input
                      onChange={(e) => handleFormChange(e)}
                      placeholder='Last Name'
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
                  style={{ alignSelf: 'flex-end' }}
                  class="control" >
                  <span
                    style={{ color: 'red' }}> *  </span>  {authorization['4c'][locale]}
                  <input
                    onChange={(e) => handleFormChange(e)}
                    placeholder='First Name'
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
                    placeholder='Last Name'
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

          <div class="field" className={classes.inputContainer}>
            <p
              style={{ alignSelf: 'flex-end' }}
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

          {(!forgottenPassword &&
            <>
              <div class="field" className={classes.inputContainer}>
                <p
                  style={{ alignSelf: 'flex-end' }}
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
                </p>
              </div>

              {registrationOrLogin !== 'login' && (
                <>
                  <div class="field" className={classes.inputContainer}>
                    <p
                      style={{ alignSelf: 'flex-end' }}
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

          <div className={classes.button}>
            <Button
              variant="outlined"
              color="primary"
              disabled={isLoading}
              onClick={(e) => handleUserAuth(e.target.innerHTML)}
            // endIcon={<ArrowForwardIcon />}
            >
              {!forgottenPassword ? registrationOrLogin === 'login' ? authorization['5b'][locale] :
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
            style={{ color: 'orange' }}
            fontSize={16} fontWeight="fontWeightBold" m={0}>
            {registrationOrLogin === 'login' ? authorization['7b'][locale] : authorization['7a'][locale]}
          </Box>
          <Box
            fontSize={14} fontWeight="fontWeightRegular" m={0}>
            <Link className={classes.link}
              onClick={() => {
                setRegistrationOrLogin(registrationOrLogin === 'registration' ? 'login' : 'registration')
                registrationOrLogin === 'login' && setForgottenPassword(false)
              }}>
              {registrationOrLogin === 'login' ? authorization['1b'][locale].split(':')[1].trim()
                : authorization['5b'][locale]}</Link> {registrationOrLogin === 'login' ? authorization['8b'][locale] : authorization['8a'][locale]}
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