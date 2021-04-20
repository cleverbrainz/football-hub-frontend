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
import InputLabel from '@material-ui/core/InputLabel';
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



export default function SignUp() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [isLoading, setIsLoading] = useState(false)

  const [registerFields, setRegisterFields] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: '',
    public_liability_insurance: '',
    professional_indemnity_insurance: '',
  })
  const [fieldErrors, setFieldErrors] = useState()
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState()



  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...registerFields, [name]: value }
    // console.log(e.target.tagName)
    setRegisterFields(fields)

  }

  const handleNext = (e) => {
    // if (activeStep === 0) {
    //   setIsLoading(true)

    //   for (var key in registerFields) {
    //     if (!registerFields[key]) delete registerFields[key]
    //   }

    //   axios.post('/signup', registerFields)
    //     .then(res => {
    //       setRegistrationSuccessMessage(res.data)
    //       console.log(res.data)
    //       setIsLoading(false)
    //     })
    //     .then(() => {
    //       setRegisterFields({ ...registerFields, fullName: '', email: '', password: '', confirmPassword: '' })
    //       setActiveStep((prevActiveStep) => prevActiveStep + 1)
    //     })
    //     .catch(err => {
    //       setIsLoading(false)
    //       setFieldErrors(err.response.data)
    //     })
    // } else if (activeStep === 2) {

    //   for (var key in registerFields) {
    //     if (!registerFields[key]) delete registerFields[key]
    //   }

    //   console.log(registerFields)
    //   console.log(registrationSuccessMessage)
    //   setIsLoading(true)

    //   axios.post(`/user/${registrationSuccessMessage.userId}`, registerFields)
    //     .then(res => {
    //       console.log(res.data)
    //       setIsLoading(false)
    //     })
    //     .then(() => setActiveStep((prevActiveStep) => prevActiveStep + 1))
    //     .catch(err => {
    //       // setFieldErrors(err.response.data)
    //       setIsLoading(false)
    //       console.error(err.response.data)
          
    //     })
    // } else {
    //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);

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
          name='fullName' label='Full Name' />
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
        <TextField id="outlined-basic"
          type='password'
          variant="outlined"
          error={fieldErrors ? fieldErrors.password ? true : false : null}
          helperText={fieldErrors ? fieldErrors.password : null}
          name='password' label='Password' />
      </FormControl>

      <FormControl variant="outlined">
        <TextField id="outlined-basic"
          type='password'
          variant="outlined"
          error={fieldErrors ? fieldErrors.confirmPassword ? true : false : null}
          helperText={fieldErrors ? fieldErrors.confirmPassword : null}
          name='confirmPassword' label='Confirm Password' />
      </FormControl>
    </>
  )


  const basicInfo = (

    <>
      <Typography variant='h5'>
        Who are you?
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
          <MenuItem value='player'>Player</MenuItem>
          <MenuItem value='coach'>Coach</MenuItem>
        </Select>
      </FormControl>

    </>
  )



  const userProfileSetup = () => {

    const companyUserSetupFields = ['Company Name', 'VAT Number', 'Company Registration Number', 'Main Contact Number',
      'Main Email', 'Accounts Contact Number', 'Accounts Email']
    const insuranceFields = ['Public Liability Insurance', 'Professional Indemnity Insurance']
    const playerUserSetupFields = ['Best Career Highlight', 'Favourite Football Player', 'Preferred Position', 'Favourite Football Team']

    if (registerFields.category === 'player') {

      const formFields = playerUserSetupFields.map(el => {
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


      ).reverse()



    } else {
      const formFields = companyUserSetupFields.map(el => {
        return (
          <FormControl variant="outlined">
            <TextField id="outlined-basic"
              type='text'
              variant="outlined"
              // error={fieldErrors ? fieldErrors[fieldName] ? true : false : null}
              // helperText={fieldErrors ? fieldErrors[fieldName] : null}
              name={el.toLowerCase().replace(/ /g, '_')} label={el} />
          </FormControl>
        )
      })

      formFields.concat(insuranceFields.map(el => {
        const name = el.toLowerCase().replace(/ /g, '_')
        return (
          <>
            <FormControl variant="outlined" className={classes.formControl} >
              <InputLabel id="demo-simple-select-outlined-label">{el}</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={registerFields[name]}
                onChange={(e) => setRegisterFields({ ...registerFields, [name]: e.target.value })}
                label={el}
              >
                <MenuItem value='No insurance'>I don't have any insurance</MenuItem>
                <MenuItem value='£250,000'>£250,000</MenuItem>
                <MenuItem value='£500,000'>£500,000</MenuItem>
                <MenuItem value='£1,000,000'>£1,000,000</MenuItem>
                <MenuItem value='£2,000,000'>£2,000,000</MenuItem>
                <MenuItem value='£5,000,000'>£5,000,000</MenuItem>
                <MenuItem value='£10,000,000'>£10,000,000</MenuItem>
                <MenuItem value='Other'>Other</MenuItem>
              </Select>
           
            </FormControl >
           
          </>
        )
      })
      )
    }
  }

  const completedRegistration = (
    <>
      <Typography variant='h4'>
        Thank you for registering to ftballer!
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
        return form;
      case 1:
        return basicInfo;
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
              Thank you for registering with ftballer. Your account is waiting to be verified.
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
