import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormControl, Typography, FormLabel, FormControlLabel, Checkbox, Box, Select, InputLabel, MenuItem } from '@material-ui/core';
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
import { useEffect } from 'react';
import moment from 'moment'



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

  const [sessionLocations, setSessionLocations] = useState()

  let subject

  const { course, courseType } = selectedBooking
  const { age, cost, space, services, courseCategory,
    sessions, optionalName, startDate, endDate, location, campCost, firstDay, lastDay } = course.courseDetails

  if (courseType === 'course') {
    subject = `${optionalName} weekly course for ${age} (${firstDay} to ${lastDay})`
  } else {
    subject = `${optionalName} camp for ${age} (${firstDay} to ${lastDay})`
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


  useEffect(() => {
    if (courseType === 'course') {
      const locationArr = []
      sessions.forEach((el, i) => {
        const { location } = sessions[i]
        !locationArr.includes(location) && locationArr.push(location)
      })
      setSessionLocations(locationArr)
    }
  }, [])

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

  // const courseDetails = () => {

  //   return (
  //     <DialogTitle style={{ margin: '30px 0' }} id="alert-dialog-slide-title">
  //       Age Group: {age} <br />
  //       Course Details: {startTime} - {endTime} <br />
  //       Price: £{cost} per {paymentInterval} <br />
  //       Location: {location}<br />
  //     </DialogTitle>
  //   )
  // }

  // const campDetails = () => {
  //   const { age, firstDay, lastDay, campCost, location } = camps[course].courseDetails

  //   return (
  //     <DialogTitle style={{ margin: '30px 0' }} id="alert-dialog-slide-title">
  //       <Box
  //         fontSize={25} fontWeight="fontWeightBold" m={0}>
  //         {companyName}
  //       </Box>
  //       Age Group: {age} <br />
  //       Camp Dates: {firstDay} - {lastDay} <br />
  //       Price: £{campCost} entire camp <br />
  //       Location: {location} <br />
  //     </DialogTitle>
  //   )
  // }


  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >

      <DialogContent>
        <Typography style={{ marginBottom: '15px' }} variant="h5" component="h2">
          £{courseType === 'course' ? cost : campCost} / {courseType}
        </Typography>

        <Typography color="textSecondary">
          {optionalName}
          <span style={{ display: 'block' }}> {courseType === 'course' ? startDate : firstDay} - {courseType === 'course' ? endDate : lastDay} </span>
          <span style={{ display: 'block' }}> {age} age group </span>


          <span className={classes.subtitle}> Session(s) </span>
          {sessions.map((el, i) => {
            function toDateTime(secs) {
              var t = new Date(1970, 0, 1); // Epoch
              t.setSeconds(secs);
              return t;
            }
            const { day, startTime, sessionDate } = el
            return <span style={{ display: 'block' }}> {i + 1}. {courseType === 'course' ? day : moment(toDateTime(sessionDate._seconds)).format('MMMM Do YYYY')} @ {startTime}</span>
          })}
          <span className={classes.subtitle}> Location(s) </span>

          {(courseType === 'course' && sessionLocations) ? sessionLocations.map((el, i) => <span style={{ display: 'block ' }}> {i + 1}. {el} </span>) :
            <span style={{ display: 'block ' }}> {location} </span>
          }

        </Typography>
      </DialogContent>



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
                  value={['he', 'she', 'they'].includes(bookingForm.customGender) ? '' : bookingForm.customGender}
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