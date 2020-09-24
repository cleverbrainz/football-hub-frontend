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
    height: '60%',
  }
}));

function getSteps() {
  return ['Registration details', 'Basic information', 'User profile setup'];
}



export default function SignUp() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [registerFields, setRegisterFields] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: '',
  })

  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...registerFields, [name]: value }
    console.log(e.target.tagName)
    setRegisterFields(fields)
    
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    console.log(registerFields)
    // setIsLoading(true)

    // axios.post('/signup', registerFields)
    //   .then(res => {
    //     // const inputs = Array.from(document.querySelectorAll('#outlined-basic'))
    //     Array.from(document.querySelectorAll('#outlined-basic')).map(el => el.value = '')
    //     setRegistrationSuccessMessage(res.data)
    //     setIsLoading(false)
    //   })
    //   .catch(err => {
    //     setFieldErrors(err.response.data)
    //     setIsLoading(false)
    //   })
  }

  const handleNext = () => {
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
          // error={fieldErrors ? fieldErrors[fieldName] ? true : false : null}
          // helperText={fieldErrors ? fieldErrors[fieldName] : null}
          name='fullName' label='Full Name' />
      </FormControl>

      <FormControl variant="outlined">
        <TextField id="outlined-basic"
          type='email'
          variant="outlined"
          // error={fieldErrors ? fieldErrors[fieldName] ? true : false : null}
          // helperText={fieldErrors ? fieldErrors[fieldName] : null}
          name='email' label='Email' />
      </FormControl>

      <FormControl variant="outlined">
        <TextField id="outlined-basic"
          type='password'
          variant="outlined"
          // error={fieldErrors ? fieldErrors[fieldName] ? true : false : null}
          // helperText={fieldErrors ? fieldErrors[fieldName] : null}
          name='password' label='Password' />
      </FormControl>

      <FormControl variant="outlined">
        <TextField id="outlined-basic"
          type='password'
          variant="outlined"
          // error={fieldErrors ? fieldErrors[fieldName] ? true : false : null}
          // helperText={fieldErrors ? fieldErrors[fieldName] : null}
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
          // value={registerFields.category}
          // onChange={handleChange}
          label="Category"
        >
          <MenuItem value='player'>Player</MenuItem>
          <MenuItem value='coach'>Coach</MenuItem>
        </Select>
      </FormControl>

    </>
  )


  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return form;
      case 1:
        return basicInfo;
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'Unknown stepIndex';
    }
  }

  return (

    <div className={classes.root}>
      <Typography style={{ textAlign: "center" }} variant='h4'> SIGN UP </Typography>
     

      <div className={classes.formContainer}>

      <Stepper style={{width: '100%'}} activeStep={activeStep} alternativeLabel>
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
                onSubmit={(e) => handleFormSubmit(e)}
                className={classes.form}>

                {getStepContent(activeStep)}



              </form>

              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                >
                  Back
              </Button>
                <Button
                  // disabled={isLoading}
                  variant="contained" color="primary"
                  onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}

                  {/* {isLoading && <CircularProgress size={30} className={classes.progress} />} */}
                </Button>
              </div>
            </>


          )}
      </div>
      {/* {registrationSuccessMessage && <p style={{ color: 'green', textAlign: 'center' }}> {registrationSuccessMessage.message} </p>} */}
    </div>
  );
}
