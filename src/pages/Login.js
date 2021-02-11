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



export default function Login({ history, location }) {
  const { user, setUserData, userData } = useContext(AuthContext);


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
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const classes = useStyles();
  const emailErrors = ['auth/user-not-found', 'auth/invalid-email']
  const passwordErrors = ['auth/wrong-password',]

  const { email } = loginFields

  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...loginFields, [name]: value }
    setLoginError('')
    setLoginFields(fields)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const frontendLogin = (e) => {
    e.preventDefault()
    const { email, password } = loginFields
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .then(data => {
        console.log(data.user.getIdToken())
        auth.setToken(data.user.getIdToken())
        axios.get(`/users/${data.user.uid}`)
          .then(res => {
            console.log(res.data)
            const { category } = res.data[0]
            localStorage.setItem('category', category)
            if (category === 'player' || category === 'parent') {
              history.push(`/${auth.getUserId()}/profile`)
            } else if (category === 'company') {
              history.push('/tester')
            } else {
              history.push('/testercoach')
            }
          })
      })
      .catch(err => {
        console.log(err)
        setLoginError(err)
      })
  }


  // function handleFormSubmit(e) {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   if (location.pathname === '/admin/login') {
  //     if (email !== 'admin@indulgefootball.com') {
  //       setLoginError({ message: 'Invalid credentials' })
  //       setIsLoading(false)
  //     } else {
  //       axios.post('/login', loginFields)
  //         .then(res => {
  //           auth.setToken(res.data.token)
  //           setIsLoading(false)
  //           history.push('/admin')
  //         })
  //         .catch(err => {
  //           setIsLoading(false)
  //           if (err) err.response && setLoginError(err.response.data)
  //         })
  //     }
  //   } else {
  //     axios.post('/login', loginFields)
  //       .then(async res => {
  //         auth.setToken(res.data.token)
  //         setIsLoading(false)

  //         if (res.data.accountCategory === 'player' || res.data.accountCategory === 'parent') {
  //           history.push(`/${auth.getUserId()}/profile`)
  //         } else if (res.data.accountCategory === 'company') {
  //           history.push('/tester')
  //         } else {
  //           history.push('/testercoach')
  //         }
  //       })
  //       .catch(err => {
  //         setIsLoading(false)
  //         setLoginError(err.response.data)
  //       })
  //   }
  // }
  const localCatCheck = (localStorage.getItem('category') !== null)
  console.log(localCatCheck)

  if (!user) return null
  return (
    <>
          { (auth.isLoggedIn() && localCatCheck) ?
          (localStorage.getItem('category') === 'company' ? 
          <Redirect to={{ pathname: "/tester" }} /> : 
          localStorage.getItem('category') === 'coach' ? 
          <Redirect to={{ pathname: "/testercoach" }} /> : 
          <Redirect to={{ pathname: `/${auth.getUserId()}/profile` }} />
        ) : (
          <div className={classes.container}>
            <Typography variant='h4'> LOGIN </Typography>
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

              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  error={passwordErrors.some(code => code === loginError.code) ? true : false}
                  name='password'
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilitySharpIcon /> : <VisibilityOffSharpIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>


              {loginError && <p style={{ color: 'red', textAlign: 'center' }}> {loginError.message} </p>}

              <Button disabled={isLoading}
                className={classes.button} type='submit'
                variant="contained" color="primary">
                Login
        {isLoading && <CircularProgress size={30} className={classes.progress} />}
              </Button>
                  {/* {loginError && <Typography>{loginError}</Typography>} */}
              {location.pathname !== '/admin/login' &&
                <Link style={{ textAlign: 'center' }} to='/forgot_password'> Forgot password? </Link>}

            </form>

            {/* {location.pathname !== '/admin/login' && <Link to='/register'> Don't have an account? Sign up </Link>} */}
          </div>
        )
      }
    </>
  )
}