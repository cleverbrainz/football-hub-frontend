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
import Popper from '@material-ui/core/Popper';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import InfoSharpIcon from '@material-ui/icons/InfoSharp';
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
  // return ['Registration details', 'Basic information', 'User profile setup', 'Registration Completed'];
  return ['Registration details', 'Basic information', 'Registration Completed'];
}



export default function RegisterTrainer({ match }) {

  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(match.params.companyLink ? 1 : 0);
  const steps = getSteps();
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  // const [type, setType] = useState(match.params.type)

  // console.log(type)

  const [registerFields, setRegisterFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: match.params.companyLink ? 'coach' : '',
    public_liability_insurance: '',
    professional_indemnity_insurance: '',
    companyLink: match.params.companyLink ? match.params.companyLink : undefined
  })
  const [fieldErrors, setFieldErrors] = useState()
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();

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
        // .catch(err => {
        //   // setFieldErrors(err.response.data)
        //   setIsLoading(false)
        //   console.error(err.response.data)
        // })
        // setRegisterFields({ ...registerFields, password: '', confirmPassword: '' })
          // setActiveStep((prevActiveStep) => prevActiveStep + 1)
        delete registerFields.password
        delete registerFields.confirmPassword

        let requestObject = {}

      if (registerFields.category === 'coach') {
        requestObject = { ...registerFields, requests: [], companies: [], coachInfo: {}, courses: {} }
      } else requestObject = { ...registerFields, sentRequests: [], coaches: [], listings: [], locations: [], images: [], services: [], sessions: [], courses: { active: [], past: []}, players: [], ageDetails: [] }

      // setIsLoading(true)
      console.log('code hello', res.data.userId)
      axios.post(`/user/${res.data.userId}/signup`, { ...requestObject, userId: res.data.userId })
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
    // } 
    // else if (activeStep === 2) {
    //   for (var key in registerFields) {
    //     if (!registerFields[key]) delete registerFields[key]
    //   }

    //   let requestObject = {}

    //   if (registerFields.category === 'coach') {
    //     requestObject = { ...registerFields, requests: [], companies: [], coachInfo: {}, courses: {} }
    //   } else requestObject = { ...registerFields, sentRequests: [], coaches: [], listings: [], locations: [], images: [], services: [], sessions: [], courses: { active: [], past: []}, players: [], ageDetails: [] }

    //   setIsLoading(true)
    //   console.log('code hello', registrationSuccessMessage.userId)
    //   axios.post(`/user/${registrationSuccessMessage.userId}/signup`, { ...requestObject, userId: registrationSuccessMessage.userId })
    //     .then(res => {
    //       console.log(res.data)
    //       setIsLoading(false)
    //     })
    //     .then(() => setActiveStep((prevActiveStep) => prevActiveStep + 1))
    //     .catch(err => {
    //       // setFieldErrors(err.response.data)
    //       setIsLoading(false)
    //       console.error(err.response.data)

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

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const form = (
    <>

      <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography component='div'>
                <Box fontSize={20} fontWeight="fontWeightRegular" m={3}>
                  Password Requirements
              </Box>

             <ul>
               <li> - Contain 1 uppercase and 1 lowercase letter </li>
               <li> - Contain at least 1 number </li>
               <li> - Must be longer than 8 characters </li>
             </ul>

              </Typography>

            
            </Paper>
          </Fade>
        )}
      </Popper>

      <FormControl variant="outlined">
        <TextField id="outlined-basic"
          type='text'
          variant="outlined"
          error={fieldErrors ? fieldErrors.fullName ? true : false : null}
          helperText={fieldErrors ? fieldErrors.fullName : null}
          name='name' label={registerFields.category === 'coach' ? 'Full Name' : 'Company Name'} />
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

              <IconButton
                onClick={handleClick('right')}
                edge="end"
              >
                <InfoSharpIcon />
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
          <MenuItem value='coach'>Coach</MenuItem>
          <MenuItem value='company'>Company</MenuItem>
        </Select>
      </FormControl>

    </>
  )



  // const userProfileSetup = () => {

  //   const userSetupFields = registerFields.category === 'company' ? ['VAT Number', 'Company Registration Number', 'Main Contact Number',
  //     'Main Email', 'Accounts Contact Number', 'Accounts Email'] : ['Main Contact Number',
  //       'Main Email']
  //   const insuranceFields = ['Public Liability Insurance', 'Professional Indemnity Insurance']

  //   const formFields = userSetupFields.map(el => {
  //     return (
  //       <FormControl variant="outlined">
  //         <TextField id="outlined-basic"
  //           type='text'
  //           variant="outlined"
  //           value={el === 'Main Email' || el === 'Accounts Email' ? registerFields.email : ''}
  //           // error={fieldErrors ? fieldErrors[fieldName] ? true : false : null}
  //           // helperText={fieldErrors ? fieldErrors[fieldName] : null}
  //           name={el.toLowerCase().replace(/ /g, '_')} label={el} />
  //       </FormControl>
  //     )
  //   })

  //   return formFields.concat(insuranceFields.map(el => {
  //     const name = el.toLowerCase().replace(/ /g, '_')
  //     return (
  //       <>
  //         <FormControl variant="outlined" className={classes.formControl} >
  //           <InputLabel id="demo-simple-select-outlined-label">{el}</InputLabel>
  //           <Select
  //             labelId="demo-simple-select-outlined-label"
  //             id="demo-simple-select-outlined"
  //             value={registerFields[name]}
  //             onChange={(e) => setRegisterFields({ ...registerFields, [name]: e.target.value })}
  //             label={el}
  //           >
  //             <MenuItem value='No insurance'>I don't have any insurance</MenuItem>
  //             <MenuItem value='£250,000'>£250,000</MenuItem>
  //             <MenuItem value='£500,000'>£500,000</MenuItem>
  //             <MenuItem value='£1,000,000'>£1,000,000</MenuItem>
  //             <MenuItem value='£2,000,000'>£2,000,000</MenuItem>
  //             <MenuItem value='£5,000,000'>£5,000,000</MenuItem>
  //             <MenuItem value='£10,000,000'>£10,000,000</MenuItem>
  //             <MenuItem value='Other'>Other</MenuItem>
  //           </Select>

  //         </FormControl >

  //       </>
  //     )
  //   })
  //   )
  // }

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
        return basicInfo;
      case 1:
        return form;
      // case 2:
      //   return userProfileSetup();
      case 2:
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
{/* 
                {activeStep === 2 && (
                  <Button
                    onClick={handleNext}
                    className={classes.backButton}
                  >
                    Skip
                     </Button>
                )} */}

                {activeStep !== 2 && (
                  <>
                    <Button
                      disabled={activeStep === 0}
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
