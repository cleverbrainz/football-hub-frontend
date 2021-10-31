import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import auth from '../../lib/auth'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {
  Typography,
  Select,
  MenuItem,
  Box,   
  TextField,
  FormControl,
  InputLabel, 
  Grid, 
  Checkbox, FormControlLabel
} from "@material-ui/core";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";

function getMainSteps() {
  // return ['Registration details', 'Basic information', 'User profile setup', 'Registration Completed'];
  return ['', '', '', '', '', '', ''];
}

export default function AddNewCourse({ classes, handleStateRefresh, handleIsNewCourse, editCourse, setIsEditCourse, setStateRefreshInProgress }) {
  const [activeStep, setActiveStep] = useState(0)
  const mainSteps = getMainSteps()
  const [courseDetails, setCourseDetails] = useState({})
  const [campDetails, setCampDetails] = useState({})
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const ages = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', 'Adults']
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
  const durations = ['15mins', '30mins', '45mins', '60mins', '75mins', '90mins']
  const [sessions, setSessions] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [borderColors, setBorderColors] = useState(['black', 'black','black','black', 'black', 'black'])
  const [excludeDays, setExcludeDays] = useState([]);
  const [excludeButtonColor, setExcludeButtonColor] = useState(['black', 'black','black','black', 'black', 'black', 'black'])
  const [isProgress, setIsProgress] = useState(false)

  useEffect(() => {
    if (editCourse) {
      setCourseDetails(editCourse.courseDetails)
      setSessions(editCourse.courseDetails.sessions)
    }

    axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        const locationArr = []
        const ageArr = []
        const serviceArr = []
        res.data[0].locations.map(el => locationArr.push(el))
        res.data[0].services.map(el => serviceArr.push(el))
        setLocations(locationArr)
        setServices(serviceArr)
      })
  }, [])

  useEffect(() => {
    if (sessions[sessionIndex]?.duration) {
      durations.map((duration, index) => {
        if (duration === sessions[sessionIndex].duration) {
          const tempColors = ['black', 'black','black','black', 'black', 'black']
          tempColors[index] = '#f50057'          
          setBorderColors(tempColors)
        }
      })
    } else {
      setBorderColors(['black', 'black','black','black', 'black', 'black'])
    }
  }, [sessionIndex])

  function timeConversion(s) {
    const ampm = s.slice(-2);
    const hours = Number(s.slice(0, 2));
    let time = s.slice(0, -2);
    if (ampm.toLowerCase() === 'am') {
      if (hours === 12) { // 12am edge-case
        return time.replace(s.slice(0, 2), '00');
      }
      // console.log(time)
      return time;
    } else if (ampm.toLowerCase() === 'pm') {
      if (hours !== 12) {
        return time.replace(s.slice(0, 2), String(hours + 12));
      }
      return time; // 12pm edge-case
    }
    return 'Error: am/pm format is not valid';
  }

  function timeFormatConversion(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    // return time.join('');
    time.splice(3, 1, '')
    return time.join(''); // return adjusted time or original string
  }

  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function formatDateString(str) {
    if (!isNumeric(str.substring(0, 2))) {
      return `0${str.substring(0, 4)}:00${str.slice(-2)}`
    } else {
      return `${str.substring(0, 5)}:00${str.slice(-2)}`
    }
  }

  const handleMainNext = () => {    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleMainBack = () => {    
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const saveSessions = (event) => {
    const {name, value} = event.target
    const sessionsArr = [...sessions]
    let longitude, latitude

    locations.map(el => {
      if (el.venue === value.replace(/ *\([^)]*\) */g, "")) {
        longitude = el.longitude
        latitude = el.latitude
      }
    })
    if (name === 'location') {
      if (courseDetails.courseType === 'Weekly') {        
        sessionsArr[sessionIndex] = { ...sessionsArr[sessionIndex], [name]: value, longitude, latitude };
      } else {
        setCourseDetails({...courseDetails, location: value, longitude, latitude})
      }
    } else if (name === 'startTime' || name === 'endTime') {   
      if (courseDetails.courseType === 'Weekly') {  
        sessionsArr[sessionIndex] = { ...sessionsArr[sessionIndex], [name]: timeFormatConversion(value + ':00') }   
      } else {
        setCourseDetails({...courseDetails, [name]: timeFormatConversion(value + ':00')})
      } 
    } else {
      sessionsArr[sessionIndex] = { ...sessionsArr[sessionIndex], [name]: value}
    }
    setSessions(sessionsArr)
  }

  // const handleExcludeDays = (event) => {
  //   const { name } = event.target
  //   let tempDays 

  //   if (excludeDays.includes(name)) {
  //     tempDays = excludeDays.filter(el => el !== name)
  //   } else {
  //     tempDays = [...excludeDays, name]
  //   }
  //   setExcludeDays(tempDays)
  // }

  const handleExcludeDays = (index) => {
    let  name  = days[index]
    let tempDays
    const tempColors = [...excludeButtonColor]

    if (excludeDays.includes(name)) {
      tempDays = excludeDays.filter(el => el !== name)
      tempColors[index] = 'black'
    } else {
      tempDays = [...excludeDays, name]
      tempColors[index] = '#02a7f0'
    }
    setExcludeDays(tempDays)
    setExcludeButtonColor(tempColors)
  }

  const addAnotherSession = () => {
    setSessionIndex(sessionIndex + 1);
  }

  const handleSessionBack = () => {
    setSessionIndex(sessionIndex - 1);
  }

  const handleSessionNext = () => {
    setSessionIndex(sessionIndex + 1);
  }

  const handleUpdateCourse = () => {
    courseDetails.age = `${courseDetails.ageFrom ? courseDetails.ageFrom : editCourse.courseDetails.age.split(' ')[0]} - ${courseDetails.ageTo ? courseDetails.ageTo : editCourse.courseDetails.age.split(' ')[2]}`
    courseDetails.sessions = [...sessions]
    if (courseDetails.courseType === 'Camp') {
      courseDetails.excludeDays = excludeDays
    }
    const properties = ['ageFrom', 'ageTo']
    properties.forEach(prop => delete courseDetails[prop])
    setIsProgress(true)

    if (editCourse) {
      return axios
        .patch("/companies/array/courses", { ...editCourse, courseDetails },
          { headers: { Authorization: `Bearer ${auth.getToken()}` } })
        .then(res => {
          setIsProgress(false)
          setIsEditCourse(false)
          handleIsNewCourse()
          setStateRefreshInProgress(true)
          handleStateRefresh()
          })
        .catch((error) => {
          setIsProgress(false)
          alert(error.message);
        })
    } else {
      return axios
        .post("/companies/courses", {
          courseDetails,
          companyId: auth.getUserId(),
        }, 
        { headers: { Authorization: `Bearer ${auth.getToken()}` }})
        .then((res) => {
          handleIsNewCourse()
          setStateRefreshInProgress(true)
          handleStateRefresh()
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  }

  const typeStep = (
    <>
    <React.StrictMode>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel id="course-type-label">What type of course are you adding?</InputLabel>
        <Select
          labelId="course-type-select-filled-label"
          id="course-type-select-filled"
          label='Who type of course are you adding?'
          disabled={editCourse ? true : false}
          value={courseDetails.courseType ? courseDetails.courseType : ''}
          onChange={e => setCourseDetails({...courseDetails, courseType: e.target.value})}
        >
          <MenuItem value='Camp'> Camp </MenuItem>
          <MenuItem value='Weekly'> Weekly Course</MenuItem>
        </Select>
      </FormControl> 

      <Button
        className={classes.button}
        style={{margin: '50px 20px'}}
        onClick={handleMainNext}
        variant="contained"
        color="primary"
      >
        Next
      </Button> 
      </React.StrictMode>    
    </>
  )

  const optionalNameStep = (
    <>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel>Optional Name</InputLabel>
        <OutlinedInput
          label='Optional Name'
          name="optionalName"
          type="text"
          value={courseDetails.optionalName ? courseDetails.optionalName : ''}
          onChange={(e) => setCourseDetails({...courseDetails, optionalName: e.target.value})}
        />
      </FormControl> 

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )

  const ageStep = (
    <>      
      <Typography variant='h6' style={{marginLeft: '20px'}}> Age From </Typography>
      <FormControl variant="outlined" style={{margin: '5px 20px'}}>
        <InputLabel id="age-simple-select-outlined-label">Age From</InputLabel>
        <Select
          labelId="age-simple-select-filled-label"
          id="age_from"
          label='Age From'
          disabled={editCourse ? true : false}
          value={editCourse ? editCourse.courseDetails.age.split(' ')[0] : courseDetails.ageFrom ? courseDetails.ageFrom : ''}
          onChange={e => setCourseDetails({...courseDetails, ageFrom: e.target.value})}
        >
          {ages.map((age, i) => {
            return (
              <MenuItem key={i} value={age}>
                {age}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px'}}> Age To </Typography>
      <FormControl variant="outlined" style={{margin: '5px 20px'}}>
        <InputLabel id="age-to-simple-select-outlined-label">Age To</InputLabel>
        <Select
          labelId="age-to-simple-select-filled-label"
          id="age_to"
          label='Age To'
          disabled={editCourse ? true : false}
          value={editCourse ? editCourse.courseDetails.age.split(' ')[2] : courseDetails.ageTo ? courseDetails.ageTo : ''}
          onChange={e => setCourseDetails({...courseDetails, ageTo: e.target.value})}
        >
          {ages.map((age, i) => {
            return (
              <MenuItem key={i} value={age}>
                {age}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>        

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )

  const categoryStep = (
    <>      
      <Typography variant='h6' style={{marginLeft: '20px'}}> Course Category </Typography>
      <FormControl variant="outlined" style={{margin: '5px 20px'}}>
        <InputLabel id="category-simple-select-outlined-label">Course Category</InputLabel>
        <Select
          labelId="category-simple-select-filled-label"
          id="category"
          label='Course Category'
          value={courseDetails.courseCategory ? courseDetails.courseCategory : ''}
          onChange={e => setCourseDetails({...courseDetails, courseCategory: e.target.value})}
        >
          <MenuItem value='summer'> Summer </MenuItem>
          <MenuItem value='winter'> Winter </MenuItem>
          <MenuItem value='autumn'> Autumn </MenuItem>
          <MenuItem value='spring'> Spring </MenuItem>
        </Select>
      </FormControl>

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px'}}> Course Service </Typography>
      <FormControl variant="outlined" style={{margin: '5px 20px'}}>
        <InputLabel id="service-simple-select-outlined-label">Course Service</InputLabel>
        <Select
          labelId="service-simple-select-filled-label"
          id="service"
          label='Course Service'
          value={courseDetails.service ? courseDetails.service : ''}
          onChange={e => setCourseDetails({...courseDetails, service: e.target.value})}
        >
          {services && services.map((el, i) => {
            return (
              <MenuItem key={i} value={el.name}> {el.name} </MenuItem>
            )
          })}
        </Select>
      </FormControl>        

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )
  
  const dateStep = (
    <>      
      <Typography variant='h6' style={{marginLeft: '20px'}}> Start Date </Typography>
      <TextField
        name="startDate"
        label="Start Date"
        type="date"
        variant="outlined"
        defaultValue="2017-05-24"
        InputLabelProps={{
          shrink: true,
        }}
        style={{margin: '5px 20px'}}
        className={classes.formControl}
        value={courseDetails.startDate ? courseDetails.startDate : ''}
        onChange={(e) => setCourseDetails({...courseDetails, startDate: e.target.value})}
      />

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px'}}> End Date </Typography>
      <TextField
        name="endDate"
        label="End Date"
        type="date"
        variant="outlined"
        defaultValue={courseDetails.startDate ? courseDetails.startDate : '2017-05-24'}
        InputLabelProps={{
          shrink: true,
        }}
        style={{margin: '5px 20px'}}
        className={classes.formControl}
        value={courseDetails.endDate ? courseDetails.endDate : ''}
        onChange={(e) => setCourseDetails({...courseDetails, endDate: e.target.value})}
      />  

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '40px'}}> Number of Spaces </Typography>  
      <FormControl variant="outlined" style={{margin: '5px 20px'}}>
        <InputLabel id="space-simple-select-outlined-label">Number of Spaces</InputLabel>
        <OutlinedInput
          label='Number of Spaces'
          name="spaces"
          type="text"
          value={courseDetails.spaces ? courseDetails.spaces : ''}
          onChange={(e) => setCourseDetails({...courseDetails, spaces: e.target.value})}
        />
      </FormControl>    

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )

  const saveDuration = (index) => {
   
    const sessionsArr = [...sessions]
    const tempColors = []
    borderColors.map((borderColor, i) => {
      if (i === index) {        
        tempColors.push('#02a7f0')
      } else {
        tempColors.push('black')
      }
    })          
    setBorderColors(tempColors)
    if (courseDetails.courseType === 'Weekly') {
      sessionsArr[sessionIndex] = { ...sessionsArr[sessionIndex], ['duration']: durations[index]}
    } else {
      setCourseDetails({...courseDetails, duration: durations[index]})
      sessionsArr = [{startTime : '', endTime: '', }]
    }    
    setSessions(sessionsArr)
  }

  const sessionStep = (
    <> 
      <div style={{marginBottom: '20px'}}>
        {sessionIndex !== 0 && <Button onClick={handleSessionBack}>
          <ChevronLeft/>
        </Button>}

        {sessions[sessionIndex + 1] && <Button style={{float: 'right'}} onClick={handleSessionNext}>
          <ChevronRight/>
        </Button>}
      </div>     
      <Typography variant='h6' style={{marginLeft: '20px'}}> Day of Week </Typography>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel id="session-simple-select-outlined-label">Day of Week</InputLabel>
        <Select
          labelId="day"
          id="day"
          label='Day of Week'
          name='day'
          value={sessions[sessionIndex] ? sessions[sessionIndex].day ? sessions[sessionIndex].day : '' : ''}
          onChange={e => saveSessions(e)}
        >
          {days.map((el, i) => <MenuItem key={i} value={el}> {el} </MenuItem>)}
        </Select>
      </FormControl>

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px'}}> Start Time </Typography>
      <FormControl variant="outlined" name='startTime' style={{margin: '20px', width: '45%'}}>
        <TextField
          value={
            sessions[sessionIndex] ? sessions[sessionIndex].startTime ? timeConversion(formatDateString(sessions[sessionIndex].startTime)) : '' : ''}
          name='startTime'
          label="Start Time"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => saveSessions(e)}
        />
      </FormControl>

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px', marginBottom: '20px'}}> Session Duration </Typography>
      <Grid container spacing={3} className={classes.gridContainer}>        
        {durations.map((item, index) => {
            return (
              <Grid item xs={4} key={index}>
                  <Button className={classes.circle} 
                      style={{borderColor: borderColors[index]}}
                      onClick={() => saveDuration(index)}>
                      <p className = {classes.text} style={{color: borderColors[index]}}>{item}</p>
                  </Button>
              </Grid>
            )
          })            
        }
      </Grid>

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px'}}> Location </Typography>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel>Location</InputLabel>
        <Select
          value={sessions[sessionIndex] ? sessions[sessionIndex].location ? sessions[sessionIndex].location : '' : ''}
          label="Location"
          name="location"
          onChange={e => saveSessions(e)}
        >
          {locations && locations.map((el, i) => (
            <MenuItem key={i} value={`${el.venue} (${el.postCode && el.postCode})`}>
              {`${el.venue} (${el.postCode && el.postCode})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className={classes.buttonContainer}>
        <Button
          className={classes.button} 
          onClick={addAnotherSession}
          variant="contained"
          color="primary"
        >
          Add Another Session
        </Button>
      </div>

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )

  const costStep = (
    <>      
      <Typography variant='h6' style={{marginLeft: '20px'}}> Total Cost </Typography>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel>Total Cost (£)</InputLabel>
        <OutlinedInput
          name="cost"
          type="number"
          id="cost"
          label="Total Cost (£)"
          disabled={editCourse ? true : false}
          value={courseDetails.cost ? courseDetails.cost : ''}
          onChange={(e) => setCourseDetails({...courseDetails, cost: e.target.value})}
        />
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            // disabled={courseDetails.allow_weekly_payment ? true : false}
            checked={courseDetails.allow_weekly_payment ? true : false}
            disabled={courseDetails.allow_weekly_payment ? true : false}
            onChange={(e) => setCourseDetails({...courseDetails, allow_weekly_payment: e.target.checked})}
            name="checkedB"
            color="primary"
          />
        }
        style={{margin: '20px'}}
        label="Allow players to subscribe to the course and pay on a weekly basis?"
      />
      {(!courseDetails.allow_weekly_payment) &&
        <p style={{ color: 'red', margin: '20px', textAlign: 'center'}}>
          Total cost and subscription option (if selected) cannot be changed once saved
      </p>}        

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>        
        <Button
          className={classes.button}
          onClick={handleUpdateCourse}
          variant="contained"
          color="primary"
        >
          Done
          {isProgress ? <CircularProgress size={20} style={{marginLeft: '10px', color: 'white'}} /> : null}
        </Button>
      </div>   
    </>
  )

  const campFirstStep = (
    <>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel>Optional Name</InputLabel>
        <OutlinedInput
          label='Optional Name'
          name="optionalName"
          type="text"
          value={courseDetails.optionalName ? courseDetails.optionalName : ''}
          onChange={(e) => setCourseDetails({...courseDetails, optionalName: e.target.value})}
        />
      </FormControl> 

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px'}}> Location </Typography>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel>Location</InputLabel>
        <Select
          value={courseDetails.location ? courseDetails.location : ''}
          label="Location"
          name="location"
          onChange={e => saveSessions(e)}
        >
          {locations && locations.map((el, i) => (
            <MenuItem key={i} value={`${el.venue} (${el.postCode && el.postCode})`}>
              {`${el.venue} (${el.postCode && el.postCode})`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )

  const campSecondStep = (
    <>      
      <Typography variant='h6' style={{marginLeft: '20px'}}> Age From </Typography>
      <FormControl variant="outlined" style={{margin: '5px 20px'}}>
        <InputLabel id="age-simple-select-outlined-label">Age From</InputLabel>
        <Select
          labelId="age-simple-select-filled-label"
          id="age_from"
          label='Age From'
          value={courseDetails.ageFrom ? courseDetails.ageFrom : ''}
          onChange={e => setCourseDetails({...courseDetails, ageFrom: e.target.value})}
        >
          {ages.map((age, i) => {
            return (
              <MenuItem key={i} value={age}>
                {age}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '20px'}}> Age To </Typography>
      <FormControl variant="outlined" style={{margin: '5px 20px'}}>
        <InputLabel id="age-to-simple-select-outlined-label">Age To</InputLabel>
        <Select
          labelId="age-to-simple-select-filled-label"
          id="age_to"
          label='Age To'
          value={courseDetails.ageTo ? courseDetails.ageTo : ''}
          onChange={e => setCourseDetails({...courseDetails, ageTo: e.target.value})}
        >
          {ages.map((age, i) => {
            return (
              <MenuItem key={i} value={age}>
                {age}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>  

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '20px'}}> Start Date </Typography>
      <TextField
        name="startDate"
        label="Start Date"
        type="date"
        variant="outlined"
        defaultValue="2017-05-24"
        InputLabelProps={{
          shrink: true,
        }}
        style={{margin: '5px 20px'}}
        className={classes.formControl}
        value={courseDetails.startDate ? courseDetails.startDate : ''}
        onChange={(e) => setCourseDetails({...courseDetails, startDate: e.target.value})}
      />

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '20px'}}> End Date </Typography>
      <TextField
        name="endDate"
        label="End Date"
        type="date"
        variant="outlined"
        defaultValue={courseDetails.startDate ? courseDetails.startDate : '2017-05-24'}
        InputLabelProps={{
          shrink: true,
        }}
        style={{margin: '5px 20px'}}
        className={classes.formControl}
        value={courseDetails.endDate ? courseDetails.endDate : ''}
        onChange={(e) => setCourseDetails({...courseDetails, endDate: e.target.value})}
      />      

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )

  const campThirdStep = (
    <>
      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px'}}> Start Time </Typography>
      <FormControl variant="outlined" name='startTime' style={{margin: '20px', width: '45%'}}>
        <TextField
          value={
            courseDetails.startTime ? timeConversion(formatDateString(courseDetails.startTime)) : ''}
          name='startTime'
          label="Start Time"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => saveSessions(e)}
        />
      </FormControl>

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px', marginBottom: '20px'}}> Finish Time </Typography>
      <FormControl variant="outlined" name='endTime' style={{margin: '20px', width: '45%'}}>
        <TextField
          value={
            courseDetails.endTime ? timeConversion(formatDateString(courseDetails.endTime)) : ''}
          name='endTime'
          label="Finish Time"
          type="time"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => saveSessions(e)}
        />
      </FormControl>

      <Typography variant='h6' style={{marginLeft: '20px', marginTop: '30px'}}> Number of Spaces </Typography>
      <FormControl variant="outlined" style={{margin: '5px 20px'}}>
        <InputLabel id="space-simple-select-outlined-label">Number of Spaces</InputLabel>
        <OutlinedInput
          label='Number of Spaces'
          name="spaces"
          type="text"
          value={courseDetails.spaces ? courseDetails.spaces : ''}
          onChange={(e) => setCourseDetails({...courseDetails, spaces: e.target.value})}
        />
      </FormControl>

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )

  const campFourthStep = (
    <>
      <Typography variant='h6' style={{margin: '20px 30px'}}> Select any days during the camp that it won’t be run on </Typography>

      {days.map((el, i) => {
        return (
          <Button key={i} className={classes.excludeButton} style={{borderColor: 'black'}}
            onClick={() => handleExcludeDays(i)}
            style={{borderColor: excludeButtonColor[i], color: excludeButtonColor[i]}}>
            {el}
          </Button>                        
        )
      })}

      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>
        <Button
          className={classes.button}  
          style={{marginRight: '5px'}}         
          onClick={handleMainBack}
          variant="contained"
          color="secondary"
        >
          Back
        </Button>
        <Button
          className={classes.button}
          style={{marginLeft: '5px'}} 
          onClick={handleMainNext}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </div>   
    </>
  )

  const campFifthStep = (
    <>      
      <Typography variant='h6' style={{marginLeft: '20px'}}> Total Cost </Typography>
      <FormControl variant="outlined" style={{margin: '20px'}}>
        <InputLabel>Total cost of camp (£)</InputLabel>
        <OutlinedInput
          name="cost"
          type="number"
          id="cost"
          label="Total cost of camp (£)"
          value={courseDetails.cost ? courseDetails.cost : ''}
          onChange={(e) => setCourseDetails({...courseDetails, cost: e.target.value})}
        />
      </FormControl>
      
      <div style={{margin: '50px 20px'}} className={classes.buttonContainer}>        
        <Button
          className={classes.button}
          onClick={handleUpdateCourse}
          variant="contained"
          color="primary"
        >
          Done
        </Button>
      </div>   
    </> 
  )  

  function getMainStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return typeStep;
      case 1:
        return courseDetails.courseType === 'Weekly' ? optionalNameStep : campFirstStep;
      case 2:
        return courseDetails.courseType === 'Weekly' ? ageStep : campSecondStep;
      case 3:
        return courseDetails.courseType === 'Weekly' ? categoryStep : campThirdStep;
      case 4: 
        return courseDetails.courseType === 'Weekly' ? dateStep : campFourthStep;
      case 5: 
        return courseDetails.courseType === 'Weekly' ? sessionStep : campFifthStep;
      case 6:
        return courseDetails.courseType === 'Weekly' ? costStep : null;
      default:
        return 'Unknown stepIndex';
    }
  }

  return (
    <div className={classes.stepContainer}>      
        <Typography style={{ textAlign: "center", marginTop: '50px', marginBottom: '80px', padding: '0 50px'}} variant='h5'> Provide your course and camp details </Typography>
        <>
          {/* <form
            autoComplete='off'
            // onChange={(e) => handleFormChange(e)}
            // onSubmit={(e) => handleFormSubmit(e)}
            className={classes.form}> */}
            {getMainStepContent(activeStep)}
          {/* </form> */}
        </>

        <Stepper style={{ width: '100%', backgroundColor: 'transparent' }} activeStep={activeStep} alternativeLabel>
          {mainSteps.map((label, index) => (
            <Step key={index} style={{display: 'none'}}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>    
      </div>
  )
}