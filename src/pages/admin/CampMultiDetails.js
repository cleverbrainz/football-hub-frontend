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
    firstDay: course ? course.courseDetails.firstDay : "",
    lastDay: course ? course.courseDetails.lastDay : "",
    location: course ? course.courseDetails.location : "",
    excludeDays: course ? course.courseDetails.excludeDays : [],
    sessions: course ? course.courseDetails.sessions : [],
    courseType: "Camp",
    campCost: course ? course.courseDetails.campCost : "",
    dayCost: course ? course.courseDetails.dayCost : "",
    age: course ? course.courseDetails.age : "",
    individualDayBookings: course ? course.courseDetails.individualDayBookings : false,
    spaces: course ? course.courseDetails.spaces : "",
    startTime: course ? course.courseDetails.startTime : "",
    endTime: course ? course.courseDetails.endTime : ""
  });
  const { sessions, firstDay, lastDay, location, campCost, dayCost, age, excludeDays, individualDayBookings, spaces, startTime, endTime } = courseDetails;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const times = [6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];


  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        const locationArr = []
        const ageArr = []
        res.data[0].locations.map(el => locationArr.push(el.venue));
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

    const requestObj = { ...courseDetails }
    if (!requestObj.individualDayBookings) requestObj.dayCost = ''
    if (course) requestObj.courseId = course.courseId

    console.log(requestObj)

    if (course) {
      console.log(course)
      return axios
        .patch("/companies/array/courses", { ...course, courseDetails: requestObj},
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

  function updateOtherCourseInfo(event, index) {
    const { name, value } = event.target;
    const sessionsArr = ['spaces', 'startTime', 'endTime']

    if (course && (name === 'firstDay' || name === 'lastDay')) setOpen(true)
    else if (course && (sessionsArr.includes(name))) {
      const newSessionsArr = [...sessions]
      newSessionsArr[index] = { ...newSessionsArr[index], [name]: value }
      setCourseDetails({ ...courseDetails, sessions: newSessionsArr })
    }
    else setCourseDetails({ ...courseDetails, [name]: value })
  }


  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Location</InputLabel>
          <Select
            label="Location"
            name="location"
            value={location}
            onChange={(e) => updateOtherCourseInfo(e)}
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
            onChange={(e) => updateOtherCourseInfo(e)}
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
            defaultValue="2017-05-24"
            className={classes.spacing}
            InputLabelProps={{
              shrink: true,
            }}
            name="firstDay"
            value={firstDay}
            onChange={(e) => updateOtherCourseInfo(e)}
          />

          <TextField
            id="date"
            label="Last day"
            type="date"
            variant="outlined"
            defaultValue="2017-05-24"
            className={classes.spacing}
            InputLabelProps={{
              shrink: true,
            }}
            name="lastDay"
            value={lastDay}
            onChange={(e) => updateOtherCourseInfo(e)}
          />
        </tr>

        {!course && (
          <tr>
            <td>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Start</InputLabel>
                <Select label="Start" name="startTime"
                  value={startTime}
                  onChange={(e) => updateOtherCourseInfo(e)}
                >
                  {times.map((el, i) => {
                    const time = i < 6 ? el + "am" : el + "pm";
                    return <MenuItem value={time}> {time} </MenuItem>;
                  })}
                </Select>
              </FormControl>
            </td>
            <td>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Finish</InputLabel>
                <Select label="Finish" name="endTime"
                  value={endTime}
                  onChange={(e) => updateOtherCourseInfo(e)}
                >
                  {times.map((el, i) => {
                    const time = i < 6 ? el + "am" : el + "pm";
                    return <MenuItem value={time}> {time} </MenuItem>;
                  })}
                </Select>
              </FormControl>
            </td>
            <td>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel>Spaces</InputLabel>
                <OutlinedInput
                  name="spaces"
                  label="Spaces"
                  value={spaces}
                  onChange={(e) => updateOtherCourseInfo(e)}
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
                      <InputLabel>Start Time</InputLabel>
                      <Select label="Start Time" name="startTime"
                        value={sessions[i].startTime}
                        onChange={(e) => updateOtherCourseInfo(e, i)}
                      >
                        {times.map((el, i) => {
                          const time = i < 6 ? el + "am" : el + "pm";
                          return <MenuItem value={time}> {time} </MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </td>
                  <td>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel>Finish Time</InputLabel>
                      <Select label="Finish Time" name="endTime"
                        value={sessions[i].endTime}
                        onChange={(e) => updateOtherCourseInfo(e, i)}
                      >
                        {times.map((el, i) => {
                          const time = i < 6 ? el + "am" : el + "pm";
                          return <MenuItem value={time}> {time} </MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </td>
                  <td>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel>Spaces</InputLabel>
                      <OutlinedInput
                        name="spaces"
                        label="Spaces"
                        value={sessions[i].spaces}
                        onChange={(e) => updateOtherCourseInfo(e, i)}
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
            name="campCost"
            value={campCost}
            label="Total cost of camp (£)"
            onChange={(e) => updateOtherCourseInfo(e)}
          />
        </FormControl>


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

        )}

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
