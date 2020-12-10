import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
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

export default function Login({ history }) {

  const [loginError, setLoginError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [loginFields, setLoginFields] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const classes = useStyles();

  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...loginFields, [name]: value }
    setLoginFields(fields)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // useEffect(() => console.log(props, updateUser), [])

  function handleFormSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    
    if (localStorage.token) localStorage.removeItem('token')
    
    axios.post('/login', loginFields)
      .then(async res => {
        await auth.setToken(res.data.token)
        setIsLoading(false)

        if (res.data.accountCategory === 'player' || res.data.accountCategory === 'parent') {
          history.push(`/${auth.getUserId()}/profile`)
        } else history.push('/tester')
      })
      .catch(err => {
        setIsLoading(false)
        if (err) {
          if (err.response) {
            setLoginError(err.response.data)
          } else setLoginError(err)
        }
      })
    
  }

  return (

    <div className={classes.container}>
      <Typography variant='h4'> LOGIN </Typography>
      <form
        autoComplete='off'
        onChange={(e) => handleFormChange(e)}
        onSubmit={(e) => handleFormSubmit(e)}
        className={classes.form}>


        <FormControl variant="outlined">
          <InputLabel htmlFor="component-outlined"> Email </InputLabel>
          <OutlinedInput
            error={loginError ? true : false}
            type='text'
            name='email' id="component-outlined" label='Email'
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
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

        <Link style={{ textAlign: 'center' }} to='/forgot_password'> Forgot password? </Link>

      </form>

      <Link to='/register'> Don't have an account? Sign up </Link>
    </div>
  )
}