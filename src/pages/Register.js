import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import { Select, MenuItem, CircularProgress } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import axios from 'axios'



export default function Register() {

  const [formLabels, setFormLabels] = useState(['Full Name', 'Email', 'Password', 'Confirm Password'])
  const [age, setAge] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [registerFields, setRegisterFields] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [fieldErrors, setFieldErrors] = useState()
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState()

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
      height: '55%',
      justifyContent: 'space-around' 
    },
    button: {
      position: 'relative'
    },
    progress: {
      position: 'absolute'
    }
  }));

  const classes = useStyles();

  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...registerFields, [name]: value }
    setRegisterFields(fields)
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    // setRegisterFields({ ...registerFields, category: age })
    setIsLoading(true)

    axios.post('/signup', registerFields)
      .then(res => {
        // const inputs = Array.from(document.querySelectorAll('#outlined-basic'))
        Array.from(document.querySelectorAll('#outlined-basic')).map(el => el.value = '')
        setRegistrationSuccessMessage(res.data)
        setIsLoading(false)
      })
      .catch(err => {
        setFieldErrors(err.response.data)
        setIsLoading(false)
      })
  }

  // const handleChange = (event) => {
  //   setAge(event.target.value);
  // };

  return (

    <div className={classes.container}>
      <Typography variant='h4'> SIGN UP </Typography>
      <form
        autoComplete='off'
        onChange={(e) => handleFormChange(e)}
        onSubmit={(e) => handleFormSubmit(e)}
        className={classes.form}>

        {formLabels.map((el, i) => {
          let arr
          let fieldName

          if (el.split(' ').length > 1) {
            arr = el.split(' ')
            fieldName = arr[0].toLowerCase() + (arr[1].charAt(0).toUpperCase() + arr[1].slice(1))
          } else {
            fieldName = el.charAt(0).toLowerCase() + el.slice(1)
          }

          return (
            <FormControl key={i} variant="outlined">
              <TextField id="outlined-basic"
                type={el === 'Full Name' || el === 'Email' ? 'text' : 'password'}
                variant="outlined"
                error={fieldErrors ? fieldErrors[fieldName] ? true : false : null}
                helperText={fieldErrors ? fieldErrors[fieldName] : null}
                name={fieldName} label={el} />
            </FormControl>
          )
        })}


        {/* <FormControl variant="outlined">
          <InputLabel id="demo-simple-select-outlined-label">You're a</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={age}
            onChange={handleChange}
            // name='category'
            label="You're a"
          >
            <MenuItem value='Player'>Player</MenuItem>
            <MenuItem value='Coach'>Coach</MenuItem>
          </Select>
        </FormControl> */}


        <Button disabled={isLoading} 
          className={classes.button} 
          variant="contained" type='submit' color="primary">
          REGISTER
          {isLoading && <CircularProgress size={30} className={classes.progress} />}
        </Button>

        {registrationSuccessMessage && <p style={{ color: 'green', textAlign: 'center' }}> {registrationSuccessMessage.message} </p>}
      </form>

      <Link to='/login'> Already have an account? Login </Link>
    </div>
  )
}