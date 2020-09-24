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

import auth from '../lib/auth'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: `${window.innerHeight - 100}px`,
  },
  form: {
    width: '30%',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    height: '35%',
    justifyContent: 'space-evenly'
  },
  button: {
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  }
}));

export default function ForgottenPassword({ history }) {

  const [successMessage, setSuccessMessage] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState({
    email: ''
  })
  const classes = useStyles();

  function handleFormChange(e) {
    const { value } = e.target
    setEmail({ email: value })
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    console.log(email)

    axios.post('/resetpassword', email)
      .then(res => {
        console.log(res.data)
        setIsLoading(false)
        setSuccessMessage(res.data)
        document.querySelector('#component-outlined').value = ''
      })
      .catch(err => {
        setIsLoading(false)
        setErrorMessage(err.response.data)
      })

  }

  return (

    <div className={classes.container}>
      <Typography variant='h4'> PASSWORD RESET </Typography>
      <form
        autoComplete='off'
        onChange={(e) => handleFormChange(e)}
        onSubmit={(e) => handleFormSubmit(e)}
        className={classes.form}>


        <FormControl variant="outlined">
          <InputLabel htmlFor="component-outlined"> Email </InputLabel>
          <OutlinedInput
            type='text'
            name='email' id="component-outlined" label='email' />
        </FormControl>

        <Button disabled={isLoading}
          className={classes.button} type='submit'
          variant="contained" color="primary">
          Reset password
          {isLoading && <CircularProgress size={30} className={classes.progress} />}
        </Button>

        {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}> {errorMessage.message} </p>}
        {successMessage && <p style={{ color: 'green', textAlign: 'center' }}> {successMessage.message} </p>}

      </form>

      <Link to='/login'> Remembered your password? Login </Link>
    </div>
  )
}