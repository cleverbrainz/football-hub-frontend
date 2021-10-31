import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import VisibilityOffSharpIcon from '@material-ui/icons/VisibilityOffSharp';
import VisibilitySharpIcon from '@material-ui/icons/VisibilitySharp';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Popper from '@material-ui/core/Popper';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import InfoSharpIcon from '@material-ui/icons/InfoSharp';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel';
import AttachFileSharpIcon from '@material-ui/icons/AttachFileSharp';
import { es } from "date-fns/esm/locale";
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import auth from '../lib/auth'


const useStyles = makeStyles((theme) => ({
  input: {
    width: '100%',
    margin: '15px 0'
  },
  genderContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: '15px 0'
  },
  button: {
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  }
}))

const CourseBookingDialogue = ({
  open,
  handleClose,
  handleClick }) => {


  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popperOpen, setPopperOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const [fieldErrors, setFieldErrors] = useState()
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [registerFields, setRegisterFields] = useState({
    name: 'Kenn Seang',
    email: 'kennseang@gmail.com',
    password: 'Manchester1',
    confirmPassword: 'Manchester1',
    category: '',
    companyLink: undefined,
    dob: ''
  })

  const [loginFields, setLoginFields] = useState({
    email: '',
    password: ''
  })



  const handleFormChanges = (e, type) => {
    const { name, value } = e.target
    if (type === 'login') {
      setLoginFields({ ...loginFields, [name]: value })
    } else {
      setRegisterFields({ ...registerFields, [name]: value })
    }
  }

  const handleRegisterFields = (object) => {
    setRegisterFields(object)
  }


  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handlePasswordInstructions = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setPopperOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const { name, email, confirmPassword, password, category } = registerFields

  function login(email, password) {
    axios.post('/login', {
      email: !email ? 'kennkenns@hotmail.com' : email,
      password: !password ? 'Manchester1' : password
    })
      .then(async res => {
        auth.setToken(res.data.token)
        return res
      })
      .finally(res => {
        handleClick()
      })
      .catch(err => console.log(err))
  }

  const handleRedirect = (e) => {
    const { innerText } = e.target

    if (innerText === 'LOG INTO YOUR ACCOUNT') {
      if (category === '') handleRegisterFields({ ...registerFields, category: 'login' })
      else login()
    } else {
      axios.post('/signup', registerFields)
        .then(res => {
          for (var key in registerFields) {
            if (!registerFields[key]) delete registerFields[key]
          }

          let requestObject = {}

          if (registerFields.category === 'player') {
            requestObject = { ...registerFields }
          } else requestObject = { ...registerFields }

          axios.post(`/user/${res.data.userId}/signup`, { ...requestObject, userId: res.data.userId })
            .then(res => console.error(res.data))
            .catch(err => console.error(err.response.data))
        })
        .finally(() => login(email, password))
        .catch(err => console.log(err))
    }
  }

  const LoginForm = () => {

    return (

      <>
        {/* <FormControl className={classes.inputs} variant="outlined"> */}
        {/* <InputLabel htmlFor="component-outlined"> Email </InputLabel> */}
        <OutlinedInput
          className={classes.inputs}
          // error={loginError ? true : false}
          onChange={(e) => handleFormChanges(e, 'login')}
          value={loginFields.email}
          type='text'
          name='email' id="component-outlined" label='Email'
        />
        {/* </FormControl> */}

        <TextField className={classes.input}
          onChange={e => handleFormChanges(e, 'login')}
          id="outlined-basic" label="Enquiring Name" name='enquiringName' variant="outlined" />

        <FormControl className={classes.inputs} variant="outlined">
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
      </>
    )
  }


  const RegisterForm = () => {



    return (
      <form
        noValidate
        autoComplete='off'
        // onChange={(e) => handleFormChanges(e, 'register')}
        className={classes.form}>


        <Popper open={popperOpen} anchorEl={anchorEl} placement={placement} transition>
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

        {
          registerFields.category === 'parent' && (
            <FormControl className={classes.inputs} variant="outlined">
              <TextField id="outlined-basic"
                type='text'
                onChange={(e) => handleFormChanges(e, 'register')}
                variant="outlined"
                error={fieldErrors ? fieldErrors.fullName ? true : false : null}
                helperText={fieldErrors ? fieldErrors.fullName : null}
                name='parentName' label='Parent Name' />
            </FormControl>
          )
        }

        <FormControl className={classes.inputs} variant="outlined">
          <TextField id="outlined-basic"
            type='text'
            variant="outlined"
            error={fieldErrors ? fieldErrors.fullName ? true : false : null}
            helperText={fieldErrors ? fieldErrors.fullName : null}
            name='name' label='Player Name' />
        </FormControl>


        <TextField
          id="date"
          label="Player DOB"
          type="date"
          name='dob'
          defaultValue={new Date()}
          className={classes.inputs}
          InputLabelProps={{
            shrink: true,
          }}
        />


        <FormControl className={classes.inputs} variant="outlined">
          <TextField id="outlined-basic"
            type='email'
            variant="outlined"
            error={fieldErrors ? fieldErrors.email ? true : false : null}
            helperText={fieldErrors ? fieldErrors.email : null}
            name='email' label='Primary Email' />
        </FormControl>


        <FormControl className={classes.inputs} variant="outlined">
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
                  onClick={handlePasswordInstructions('right')}
                  edge="end"
                >
                  <InfoSharpIcon />
                </IconButton>

              </InputAdornment>
            }
            labelWidth={70}
          />

        </FormControl>

        <FormControl className={classes.inputs} variant="outlined">

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



      </form>
    )
  }



  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >


      <DialogContent>
        <Box
          fontSize={20} fontWeight="fontWeightBold" m={0}>
          Player Details
        </Box>

        <form
          noValidate autoComplete="off"
        >

          <TextField className={classes.input}
            onChange={e => handleFormChanges(e)}
            id="outlined-basic" label="Enquiring Name" name='enquiringName' variant="outlined" />

          <TextField className={classes.input}
            onChange={e => handleFormChanges(e)}
            id="outlined-basic" label="Player Name" name='name' variant="outlined" />
          <TextField className={classes.input}
            onChange={e => handleFormChanges(e)}
            id="outlined-basic" label="Email Address" name='email' variant="outlined" />
          <TextField className={classes.input}
            onChange={e => handleFormChanges(e)}
            id="outlined-basic" label="Phone Number" name='number' variant="outlined" />


        </form>



      </DialogContent>

      <DialogTitle id="alert-dialog-title">
        {category !== 'login' ? 'Sign up and join the ftballer community!' : 'Log into your ftballer account'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">

          <form>
            {category === '' ? (

              <>
                <Button
                  onClick={() => handleRegisterFields({ ...registerFields, category: 'player' })}
                  variant="contained" style={{ marginBottom: '10px' }} color="primary">
                  I am a player signing up for myself
</Button>

                <Button
                  onClick={() => handleRegisterFields({ ...registerFields, category: 'parent' })}
                  variant="contained" color="primary">
                  I am a parent signing up for my child
</Button>
              </>
            ) : category !== 'login' ?
                <RegisterForm /> : (

                  <OutlinedInput
                    className={classes.inputs}
                    // error={loginError ? true : false}
                    onChange={(e) => handleFormChanges(e, 'login')}
                    value={loginFields.email}
                    type='text'
                    name='email' id="component-outlined" label='Email'
                  />
                  
                )}
          </form>





        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => handleRedirect(e)} color="secondary">
          {category !== 'login' && category !== '' ? 'Register and checkout' : 'Log into your account'}
        </Button>
        <Button onClick={handleClose} color="primary">
          Cancel
          </Button>
      </DialogActions>

    </Dialog>
  );
};

export default CourseBookingDialogue;