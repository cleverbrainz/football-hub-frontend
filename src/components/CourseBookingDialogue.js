import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormControl, FormLabel, FormControlLabel, Checkbox, Box, Select, InputLabel, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'date-fns';
import CircularProgress from '@material-ui/core/CircularProgress'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import auth from '../lib/auth'
import axios from 'axios'


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
  Transition,
  courses,
  selectedBooking,
  companyId,
  camps,
  openSnackBar,
  companyName }) => {


  let subject

  const { course, courseType } = selectedBooking

  if (courseType === 'course') {
    const { session } = selectedBooking
    const { day, startTime, endTime } = courses[course].courseDetails.sessions[session]
    const { age } = courses[course].courseDetails

    subject = `Weekly Course - ${age} ${day} ${startTime} to ${endTime}`
  } else {
    const { age, firstDay, lastDay } = camps[course].courseDetails
    subject = `Camp - ${age} ${firstDay} to ${lastDay}`
  }

  const [bookingForm, setBookingForm] = useState({
    enquiryName: '',
    name: '',
    email: '',
    number: '',
    dob: new Date(),
    gender: '',
    enquiryType: 'booking',
    message: `Hi, I would like to make a booking for the above ${courseType} listed`,
    company: companyName,
    subject,
    customGender: '',
    userId: auth.getUserId(),
    companyId,
  })

  const [genders, setGender] = useState({
    male: false,
    female: false,
    custom: false
  })
  const [isLoading, setIsLoading] = useState(false)


  const handleBookingFormChange = (e) => {
    const { name, value } = e.target
    setBookingForm({ ...bookingForm, [name]: value })
  }

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    axios.post('/enquiries', bookingForm)
      .then(res => {
        setIsLoading(false)
        handleClose()
        openSnackBar()
      })
      .catch(err => setIsLoading(false))
  }

  const handleGenderChange = e => {
    const { name, checked } = e.target
    const checkedObj = {}
    Object.keys(genders).map(el => checkedObj[el] = false)
    setGender({ ...checkedObj, [name]: checked })
    setBookingForm({ ...bookingForm, gender: name })
  }


  const classes = useStyles()

  const courseDetails = () => {
    const { session } = selectedBooking
    const { day, startTime, endTime } = courses[course].courseDetails.sessions[session]
    const { age, cost, paymentInterval, location } = courses[course].courseDetails

    return (
      <DialogTitle style={{ margin: '30px 0' }} id="alert-dialog-slide-title">
        <Box
          fontSize={25} fontWeight="fontWeightBold" m={0}>
          {companyName}
        </Box>
        Age Group: {age} <br />
        Session Details: {day} {startTime} - {endTime} <br />
        Price: £{cost} per {paymentInterval} <br />
        Location: {location}<br />
      </DialogTitle>
    )
  }

  const campDetails = () => {
    const { age, firstDay, lastDay, campCost, location } = camps[course].courseDetails

    return (
      <DialogTitle style={{ margin: '30px 0' }} id="alert-dialog-slide-title">
        <Box
          fontSize={25} fontWeight="fontWeightBold" m={0}>
          {companyName}
        </Box>
        Age Group: {age} <br />
        Camp Dates: {firstDay} - {lastDay} <br />
        Price: £{campCost} entire camp <br />
        Location: {location} <br />
      </DialogTitle>
    )
  }


  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >

      {selectedBooking.courseType === 'course' ? courseDetails() : campDetails()}


      <DialogContent>
        <Box
          fontSize={20} fontWeight="fontWeightBold" m={0}>
          Player Details
        </Box>

        <form
          noValidate autoComplete="off"
        >

          <TextField className={classes.input}
            onChange={e => handleBookingFormChange(e)}
            id="outlined-basic" label="Enquiring Name" name='enquiringName' variant="outlined" />

          <TextField className={classes.input}
            onChange={e => handleBookingFormChange(e)}
            id="outlined-basic" label="Player Name" name='name' variant="outlined" />
          <TextField className={classes.input}
            onChange={e => handleBookingFormChange(e)}
            id="outlined-basic" label="Email Address" name='email' variant="outlined" />
          <TextField className={classes.input}
            onChange={e => handleBookingFormChange(e)}
            id="outlined-basic" label="Phone Number" name='number' variant="outlined" />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              className={classes.input}
              margin="normal"
              id="date-picker-dialog"
              label="Date of Birth"
              format="MM/dd/yyyy"
              value={bookingForm.dob}
              onChange={date => setBookingForm({ ...bookingForm, dob: date })}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>

          <FormLabel component="legend">How do you identify yourself?</FormLabel>
          <div className={classes.genderContainer}>
            {Object.keys(genders).map((el, i) => {
              const label = el.charAt(0).toUpperCase() + el.slice(1)
              return (
                <FormControlLabel

                  control={<Checkbox
                    checked={genders[el]}
                    onChange={e => handleGenderChange(e)}
                    name={el} />}
                  label={label}
                />
              )
            })}


          </div>

          {genders.custom && (
            <div>
                <FormControl className={classes.input} variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">Select Your Pronoun</InputLabel>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    label='Select Your Pronoun'
                    value={['he', 'she', 'they'].includes(bookingForm.customGender) ? bookingForm.customGender : null}
                    onChange={e => setBookingForm({ ...bookingForm, customGender: e.target.value })}>

                    <MenuItem value='he'> He </MenuItem>
                    <MenuItem value='she'> She </MenuItem>
                    <MenuItem value='they'> They </MenuItem>

                  </Select>
                </FormControl>

                <FormControl variant="outlined" className={classes.input}>
                  <TextField className={classes.input}
                  value={['he', 'she', 'they'].includes(bookingForm.customGender) ? '' : bookingForm.customGender }
                    onChange={e => setBookingForm({ ...bookingForm, customGender: e.target.value })}
                    id="outlined-basic" label="Custom Gender" name='customerGender' variant="outlined" />
                </FormControl>
            </div>

          )}



          <FormControlLabel
            control={<Checkbox
              name="checkedA" />}
            label="I agree to the Terms & Conditions"
          />



        </form>



      </DialogContent>

      <DialogActions>
        <Button className={classes.button} onClick={e => handleBookingSubmit(e)}
          variant="contained"
          color="primary">
          Submit Booking
          {isLoading && <CircularProgress size={30} className={classes.progress} />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseBookingDialogue;