import "date-fns";
import React from "react";
import { Link } from "react-router-dom";
import {
  FormControl,
  Container,
  InputLabel,
  OutlinedInput,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MultiComponent from "./CampMultiComponent";
import axios from "axios";
import auth from "../../lib/auth";
import { useEffect } from "react";
import moment from 'moment'
import ResetCampDetailsDialogue from '../../components/ResetCampDetailsDialogue'
import DateFnsUtils from '@date-io/date-fns';
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    // height: `${window.innerHeight - 100}px`,
    textAlign: "center",
    // margin: "200px auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-around",
    margin: "20px 0",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "115px",
  },
  spacing: {
    margin: "15px",
  },
  button: {
    position: "relative",
    margin: "15px 0",
  },
  textField: {
    width: "20%",
  },
}));

export default function MaterialUIPickers({ history, course,
  handleCampResetInformation,
  handleStateRefresh }) {


  const classes = useStyles();
  const [locations, setLocations] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [ageGroups, setAgeGroups] = React.useState([]);
  const [courseDetails, setCourseDetails] = React.useState({
    optionalName: course ? course.courseDetails.optionalName : "",
    startDate: course ? course.courseDetails.startDate : "",
    endDate: course ? course.courseDetails.endDate : "",
    location: course ? course.courseDetails.location : "",
    excludeDays: course ? course.courseDetails.excludeDays : [],
    sessions: course ? course.courseDetails.sessions : [],
    courseType: "Camp",
    cost: course ? course.courseDetails.cost : "",
    // dayCost: course ? course.courseDetails.dayCost : "",
    age: course ? course.courseDetails.age : "",
    // individualDayBookings: course ? course.courseDetails.individualDayBookings : false,
    spaces: course ? course.courseDetails.spaces : "",
    startTime: course ? course.courseDetails.startTime : "",
    endTime: course ? course.courseDetails.endTime : ""
  });
  const { sessions, startDate, optionalName, endDate, location, campCost,
    dayCost, age, excludeDays, individualDayBookings, spaces, startTime, endTime } = courseDetails;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  // const times = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {

    console.log(course)

    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        const locationArr = []
        const ageArr = []
        res.data[0].locations.map(el => locationArr.push(`${el.venue} (${el.postCode && el.postCode})`))
        res.data[0].ageDetails.map(el => ageArr.push(el));
        setLocations(locationArr)
        setAgeGroups(ageArr)
      })
  }, [])


  const handleExclusionDays = e => {
    const { name } = e.target
    const { excludeDays } = courseDetails
    let comparisonArr

    if (course) {
      setOpen(true)
    } else {
      if (courseDetails.excludeDays.includes(name)) {
        comparisonArr = excludeDays.filter(el => el !== name)
      } else comparisonArr = [...excludeDays, name]

      setCourseDetails({ ...courseDetails, excludeDays: comparisonArr })
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestObj = { ...courseDetails, startTime: moment(courseDetails.startTime).format('h:mm a') }
    if (!requestObj.individualDayBookings) requestObj.dayCost = ''
    if (course) requestObj.courseId = course.courseId

    console.log(requestObj)

    if (course) {
      console.log(course)
      return axios
        .patch("/companies/array/courses", { ...course, courseDetails: requestObj },
          { headers: { Authorization: `Bearer ${auth.getToken()}` } })
        .then(res => handleStateRefresh())
        .catch((error) => {
          alert(error.message);
        });
    } else {
      return axios
        .post("/companies/courses", {
          courseDetails,
          companyId: auth.getUserId(),
        })
        .then(res => handleStateRefresh())
        .catch((error) => {
          alert(error.message);
        });
    }

  };

  function updateOtherCourseInfoOriginal(event, index) {

    const { name, value } = event.target
    const sessionsArr = ['spaces', 'startTime', 'endTime']

    if (course && (name === 'startDate' || name === 'endDate')) setOpen(true)
    else if (course && (sessionsArr.includes(name))) {
      const newSessionsArr = [...sessions]
      const propertyVal = name === 'startTime' || name === 'endTime' ? tConvert(value) : value
      newSessionsArr[index] = { ...newSessionsArr[index], [name]: propertyVal }
      setCourseDetails({ ...courseDetails, sessions: newSessionsArr })
    }
    else {
      const propertyVal = name === 'startTime' || name === 'endTime' ? tConvert(value) : value
      setCourseDetails({ ...courseDetails, [name]: propertyVal })
    }
  }

  function updateOtherCourseNew(event) {

    const { name, value } = event.target
    const sessionsArr = ['spaces', 'startTime', 'endTime']
    const propertyVal = name === 'startTime' || name === 'endTime' ? tConvert(value) : value

    let opposite = name === 'startTime' ? 'endTime' : name === 'endTime' ? 'startTime' : 'null'
    
    if ((name === 'startTime' || name === 'endTime') && courseDetails[opposite]) {

        const startMoment = name === 'startTime' ? moment(value, 'HH:mm') : moment(courseDetails[opposite], 'hh:mma')
        const endMoment = name === 'startTime' ? moment(courseDetails[opposite], 'hh:mma') : moment(value, 'HH:mm')

        
        
        const oppositeVal = moment(startMoment).isSameOrAfter(endMoment) ? tConvert(value) : courseDetails[opposite]
        console.log({ value, propertyVal, startMoment, endMoment, oppositeVal})

        setCourseDetails({ ...courseDetails, [name]: tConvert(value), [opposite]: oppositeVal })
        // console.log(timeConversion(value + ':00'))

      } else {
        setCourseDetails({ ...courseDetails, [name]: propertyVal })
      }
  }

  function updateOtherCourseExisting(event, index) {
    const { name, value } = event.target
    // const sessionsArr = ['spaces', 'startTime', 'endTime']
    if (name === 'startDate' || name === 'endDate') {
      setOpen(true)
      return
    }
    else {
      const newSessionsArr = [...sessions]
      if (name === 'spaces') {

        newSessionsArr[index] = { ...newSessionsArr[index], [name]: value }
        setCourseDetails({ ...courseDetails, sessions: newSessionsArr })

      } else {
        
        const toEdit = newSessionsArr[index]
        let opposite = name === 'startTime' ? 'endTime' : 'startTime'

    

        const startMoment = name === 'startTime' ? moment(value, 'HH:mm') : moment(toEdit[opposite], 'hh:mma')
        const endMoment = name === 'startTime' ? moment(toEdit[opposite], 'hh:mma') : moment(value, 'HH:mm')

        const oppositeVal = moment(startMoment).isSameOrAfter(endMoment) ? tConvert(value + ':00') : toEdit[opposite]

        newSessionsArr[index] = { ...newSessionsArr[index], [name]: tConvert(value + ':00'), [opposite]: oppositeVal }

        setCourseDetails({ ...courseDetails, sessions: newSessionsArr })

      }
    }
  }



  function timeConversion(s) {
    const ampm = s.slice(-2);
    const hours = Number(s.slice(0, 2));
    let time = s.slice(0, -2);
    if (ampm.toLowerCase() === 'am') {
      if (hours === 12) { // 12am edge-case
        return time.replace(s.slice(0, 2) + '00');
      }
      return time;
    } else if (ampm.toLowerCase() === 'pm') {
      if (hours !== 12) {
        return time.replace(s.slice(0, 2), String(hours + 12));
      }
      return time; // 12pm edge-case
    }
    return 'Error: am/pm format is not valid';
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

  function tConvert(time) {
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



  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Optional Name</InputLabel>
          <OutlinedInput
            label='Optional Name'
            name="optionalName"
            type="text"
            value={optionalName}
            onChange={(e) => updateOtherCourseNew(e)}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Location</InputLabel>
          <Select
            label="Location"
            name="location"
            value={location}
            onChange={(e) => updateOtherCourseNew(e)}
          >
            {locations && locations.map((el, i) => (
              <MenuItem key={i} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Age Group</InputLabel>
          <Select
            label="Age Group"
            name="age"
            value={age}
            onChange={(e) => updateOtherCourseNew(e)}
          >
            {ageGroups && ageGroups.map((el, i) => {
              const text = `${el.startAge}-${el.endAge}`
              return (
                <MenuItem key={i} value={text}>
                  {text}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <tr>


          <TextField
            id="date"
            label="First day"
            type="date"
            variant="outlined"
            defaultValue={startDate}
            className={classes.spacing}
            InputLabelProps={{
              shrink: true,
            }}
            name="startDate"
            value={startDate}
            onChange={(e) => updateOtherCourseNew(e)}
          />

          <TextField
            id="date"
            label="Last day"
            type="date"
            variant="outlined"
            defaultValue={endDate}
            className={classes.spacing}
            InputLabelProps={{
              shrink: true,
            }}
            name="endDate"
            value={endDate}
            onChange={(e) => updateOtherCourseNew(e)}
          />
        </tr>

        {!course && (
          <tr>
            <td>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  value={timeConversion(formatDateString(startTime))}
                  name='startTime'
                  label="Start Time"
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => updateOtherCourseNew(e)}
                />
              </FormControl>
            </td>
            <td>
              <FormControl variant="outlined" className={classes.formControl}>
                <TextField
                  value={timeConversion(formatDateString(endTime))}
                  name='endTime'
                  label="End Time"
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => updateOtherCourseNew(e)}
                />
              </FormControl>
            </td>
            <td>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Spaces</InputLabel>
                <OutlinedInput
                  name="spaces"
                  label="Spaces"
                  value={spaces}
                  onChange={(e) => updateOtherCourseNew(e)}
                />
              </FormControl>
            </td>
          </tr>
        )}

        <Typography variant="h6" className={classes.spacing}>
          Exclude any days
        </Typography>

        <table>

          {days.map((el, i) => {
            return (
              <td className={classes.spacing}>
                <FormControlLabel control={<Checkbox
                  checked={excludeDays.includes(el)}
                  name={el}
                  onChange={(e) => handleExclusionDays(e)} />} label={el} />
              </td>
            )
          })}
        </table>

        {course && (
          <>
            <Typography variant="h6" className={classes.spacing}>
              Sessions
         </Typography>

            {sessions.map((el, i) => {
              function toDateTime(secs) {
                var t = new Date(1970, 0, 1); // Epoch
                t.setSeconds(secs);
                return t;
              }

              console.log(el.endTime, timeConversion(formatDateString(el.endTime)))
              return (
                <tr>
                  <td>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel>Date</InputLabel>
                      <OutlinedInput
                        name="spaces"
                        label="Spaces"
                        disabled
                        value={moment(toDateTime(el.sessionDate._seconds)).format('MMMM Do YYYY')}
                      />
                    </FormControl>
                  </td>
                  <td>
                    <FormControl variant="outlined" className={classes.formControl}>

                      <TextField
                        // value={timeConversion(formatDateString(el.startTime))}
                        value={timeConversion(formatDateString(el.startTime))}
                        name='startTime'
                        label="Start Time"
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => updateOtherCourseExisting(e, i)}
                      />
                    </FormControl>
                  </td>
                  <td>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <TextField
                        value={timeConversion(formatDateString(el.endTime))}
                        name='endTime'
                        label="End Time"
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={(e) => updateOtherCourseExisting(e, i)}
                      />
                    </FormControl>
                  </td>
                  <td>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel>Spaces</InputLabel>
                      <OutlinedInput
                        name="spaces"
                        label="Spaces"
                        value={sessions[i].spaces}
                        onChange={(e) => updateOtherCourseExisting(e, i)}
                      />
                    </FormControl>
                  </td>
                </tr>
              )
            })}
          </>
        )}


        <Typography variant="h6" className={classes.spacing}>
          Booking Options
        </Typography>


        <FormControl
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>Total cost of camp (£)</InputLabel>
          <OutlinedInput
            name="cost"
            value={campCost}
            label="Total cost of camp (£)"
            onChange={(e) => updateOtherCourseNew(e)}
          />
        </FormControl>

{/* 
        <FormControlLabel control={<Checkbox
          checked={individualDayBookings}
          onClick={() => setCourseDetails({
            ...courseDetails, individualDayBookings:
              !courseDetails.individualDayBookings
          })} />} label='Customers can book individual days' />

        {courseDetails.individualDayBookings && (
          <FormControl
            variant="outlined"
            className={classes.formControl}
          >
            <InputLabel>Cost per day (£)</InputLabel>
            <OutlinedInput
              name="dayCost"
              value={dayCost}
              label="£ Cost per day"
              onChange={(e) => updateOtherCourseInfo(e)}
            />
          </FormControl>

        )} */}

        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          DONE
        </Button>

      </form>

      {open && <ResetCampDetailsDialogue
        open={open}
        courseId={course.courseId}
        handleCampResetInformation={courseId => handleCampResetInformation(courseId)}
        handleClose={() => handleClose()}
      />}
    </Container>
  );
}
