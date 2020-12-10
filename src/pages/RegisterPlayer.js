import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel';
import VisibilityOffSharpIcon from '@material-ui/icons/VisibilityOffSharp';
import VisibilitySharpIcon from '@material-ui/icons/VisibilitySharp';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
// import 'date-fns';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';
import axios from 'axios'
import AttachFileSharpIcon from '@material-ui/icons/AttachFileSharp';
import { Link } from 'react-router-dom'

import { CircularProgress } from '@material-ui/core'
const { validateSignupFields, validateLoginFields } = require('../lib/validators')

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: window.innerHeight - 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  formContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '35%',
    minWidth: '300px',
    justifyContent: 'space-around',
    // alignItems: 'center'
    minHeight: '60%',
  },
  button: {
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  }
}));

function getSteps() {
  return ['Registration details', 'Basic information', 'User profile setup', 'Registration Completed'];
}



export default function RegisterPlayer({ match }) {

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [registerFields, setRegisterFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: '',
  })
  const [fieldErrors, setFieldErrors] = useState()
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState()

  // const [selectedDate, setSelectedDate] = useState(new Date('2020-08-10T21:11:54'));

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...registerFields, [name]: value }
    // console.log(e.target.tagName)
    setRegisterFields(fields)

  }

  const handleNext = (e) => {
    if (activeStep === 1) {
      setIsLoading(true)

      for (var key in registerFields) {
        if (!registerFields[key]) delete registerFields[key]
      }
      if (localStorage.token) localStorage.removeItem('token')

      
      axios.post('/signup', registerFields)
        .then(res => {
          setRegistrationSuccessMessage(res.data)
          console.log(res.data)
          setIsLoading(false)
        })
        .then(() => {
          setRegisterFields({ ...registerFields, name: '', email: '', password: '', confirmPassword: '' })
          setActiveStep((prevActiveStep) => prevActiveStep + 1)
        })
        .catch(err => {
          setIsLoading(false)
          setFieldErrors(err.response.data)
        })
    } else if (activeStep === 2) {

      for (var key in registerFields) {
        if (!registerFields[key]) delete registerFields[key]
      }

      let requestObject = {}

      if (registerFields.category === 'player') {
        requestObject = { ...registerFields }
      } else requestObject = { ...registerFields }

      setIsLoading(true)

      axios.post(`/user/${registrationSuccessMessage.userId}/signup`, { ...requestObject, userId: registrationSuccessMessage.userId })
        .then(res => {
          console.log(res.data)
          setIsLoading(false)
        })
        .then(() => setActiveStep((prevActiveStep) => prevActiveStep + 1))
        .catch(err => {
          // setFieldErrors(err.response.data)
          setIsLoading(false)
          console.error(err.response.data)

        })
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const form = (
    <>
      <FormControl variant="outlined">
        <TextField id="outlined-basic"
          type='text'
          variant="outlined"
          error={fieldErrors ? fieldErrors.fullName ? true : false : null}
          helperText={fieldErrors ? fieldErrors.fullName : null}
          name='name' label='Name' />
      </FormControl>

      <FormControl variant="outlined">
        <TextField id="outlined-basic"
          type='email'
          variant="outlined"
          error={fieldErrors ? fieldErrors.email ? true : false : null}
          helperText={fieldErrors ? fieldErrors.email : null}
          name='email' label='Email' />
      </FormControl>


      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          error={fieldErrors ? fieldErrors.password ? true : false : null}
          helperText={fieldErrors ? fieldErrors.password : null}
          type={showPassword ? 'text' : 'password'}
          name='password'
          label='Password'
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

      <FormControl variant="outlined">

        <InputLabel htmlFor="outlined-adornment-password"> Confirm Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          error={fieldErrors ? fieldErrors.confirmPassword ? true : false : null}
          helperText={fieldErrors ? fieldErrors.confirmPassword : null}
          type={showPasswordConfirmation ? 'text' : 'password'}
          name='confirmPassword'
          label='Confirm Password'
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPasswordConfirmation ? <VisibilitySharpIcon /> : <VisibilityOffSharpIcon />}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={70}
        />

      </FormControl>
    </>

  )


  const basicInfo = (

    <>
      <Typography variant='h5'>
        Who is this account for?
      </Typography>
      <Typography variant="h6">
        To book coaching for a child aged 16 or under, an account must be made by their parent/guardian.
      </Typography>

      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={registerFields.category}
          onChange={(e) => setRegisterFields({ ...registerFields, category: e.target.value })}
          label="Category"
        >
          <MenuItem value='player'>Self</MenuItem>
          <MenuItem value='parent'>Parent Account</MenuItem>
        </Select>
      </FormControl>

    </>
  )



  const userProfileSetup = () => {


    const UserSetupFields = registerFields.category === 'player' ? ['Best Career Highlight', 'Favourite Football Player', 'Preferred Position', 'Favourite Football Team'] : ['Favourite Football Player', 'Preferred Position', 'Favourite Football Team', 'Child\'s name']

      const formFields = UserSetupFields.map(el => {
        return (
          <FormControl variant="outlined">
            <TextField id="outlined-basic"
              type='text'
              variant="outlined"

              name={el.toLowerCase().replace(/ /g, '_')} label={el} />
          </FormControl>
        )
      })

      return formFields.concat(
        <>
          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date of Birth"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider> */}


          <FormControl variant="outlined">
            <TextField
              id="outlined-multiline-static"
              label="Write a short bio"
              multiline
              rows={3}
              name='bio'
              variant="outlined"
            />
          </FormControl>


        </>


      ).reverse()



  }

  const completedRegistration = (
    <>
      <Typography variant='h4'>
        Thank you for registering to the Football Hub!
    </Typography>
      <p style={{ color: 'green' }}>
        {registrationSuccessMessage && registrationSuccessMessage.message}
      </p>

      <Link to='/login'> Click here to login </Link>
    </>

  )





  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return basicInfo;
        case 1:
          return form;
      case 2:
        return userProfileSetup();
      case 3:
        return completedRegistration;
      default:
        return 'Unknown stepIndex';
    }
  }

  return (

    <div className={classes.root}>
      <Typography style={{ textAlign: "center" }} variant='h4'> SIGN UP </Typography>


      <div className={classes.formContainer}>

        <Stepper style={{ width: '100%' }} activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* when they're finished registering  */}
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              Thank you for registering with Ballers Hub. Your account is waiting to be verified.
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
            // when not finished registering
            <>

              <form
                autoComplete='off'
                onChange={(e) => handleFormChange(e)}
                // onSubmit={(e) => handleFormSubmit(e)}
                className={classes.form}>

                {getStepContent(activeStep)}

              </form>

              <div>

                {activeStep === 2 && (
                  <Button
                    onClick={handleNext}
                    className={classes.backButton}
                  >
                    Skip
                     </Button>
                )}

                {activeStep !== 3 && (
                  <>
                    <Button
                      disabled={activeStep === 0 || activeStep === 1}
                      onClick={handleBack}
                      className={classes.backButton}
                    >
                      Back
                    </Button>

                    <Button
                      className={classes.button}
                      disabled={isLoading}
                      variant="contained" color="primary"
                      onClick={handleNext}>
                      {activeStep === 2 ? 'Finish' : 'Continue'}

                      {isLoading && <CircularProgress size={25} className={classes.progress} />}
                    </Button>
                  </>

                )}
              </div>
            </>
          )}
      </div>
    </div>
  );
}
