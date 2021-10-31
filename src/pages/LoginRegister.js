import React, { useState, useEffect, useContext } from 'react'
import { Link, Redirect, useHistory } from 'react-router-dom'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import auth from '../lib/auth'
import { AuthContext } from "../lib/context";
import { firebaseApp } from '../lib/firebase';
import * as firebase from "firebase";

export default function LoginRegister({ history, location }) {
  const { user, setUserData, userData } = useContext(AuthContext);
//   useEffect(() => {
//     console.log("verificationCode2 updated");
//   }, [verificationCode])

  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: location.pathname === '/admin/login' ? 'center' : 'space-evenly',
      height: `${window.innerHeight - 80}px`,
    },
    form: {
      width: '30%',
      minWidth: '300px',
      display: 'flex',
      flexDirection: 'column',
      height: '40%',
      justifyContent: 'space-evenly'
    },
    button: {
      position: 'relative'
    },
    progress: {
      position: 'absolute'
    }
  }));

  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginFields, setLoginFields] = useState({
    email: '',
    password: ''
  })
  const classes = useStyles();
  const emailErrors = ['auth/user-not-found', 'auth/invalid-email']
  const { email } = loginFields
  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...loginFields, [name]: value }
    setLoginError('')
    setLoginFields(fields)
    // console.log(loginFields)
  }
 
  const frontendLogin = (e) => {
    e.preventDefault()
    const { email, password } = loginFields
    firebaseApp.auth().signInWithEmailAndPassword(email, "1")
      .then(data => { 
        console.log(data)
      })
      .catch(error => {
        console.log(error)
        if (error.code === 'auth/invalid-email') {
          setLoginError(error)
        } else if (error.code === 'auth/user-not-found') {
          history.push('/registerType');
          //goto register page
        } else if (error.code === 'auth/wrong-password') {
          //goto login page
          localStorage.setItem('userEmail', email)
          history.push('/Login');
        } else {
          console.log(error)
        }
      })
  }
  const localCatCheck = (localStorage.getItem('category') !== null)
  const loginCheck = auth.isLoggedIn()

  if (!user) return null
  return (
    <>
      {(loginCheck && localCatCheck) ?
        (localStorage.getItem('category') === 'company' ? <Redirect to={{ pathname: "/tester/Summary" }} /> :
        localStorage.getItem('category') === 'coach' ?<Redirect to={{ pathname: "/testercoach" }} /> : <Redirect to={{ pathname: `/${auth.getUserId()}/profile` }} />
        ) : ( 
        <div className={classes.container}>
          <Typography variant='h4'>LOGIN / REGISTER</Typography>              
          <form
            autoComplete='off'
            onChange={(e) => handleFormChange(e)}
            onSubmit={(e) => frontendLogin(e)}
            className={classes.form}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="component-outlined"> Email </InputLabel>
              <OutlinedInput
                error={emailErrors.some(code => code === loginError.code) ? true : false}
                type='text'
                name='email' id="component-outlined" label='Email'
              />
            </FormControl>
            
            {loginError && <p style={{ color: 'red', textAlign: 'center' }}> {loginError.message} </p>}
            <Button disabled={isLoading}
              className={classes.button} type='submit'
              variant="contained" color="primary">
              Continue
              {isLoading && <CircularProgress size={30} className={classes.progress} />}
            </Button>            
          </form>
        </div>            
        )
      }
    </>
  )
}