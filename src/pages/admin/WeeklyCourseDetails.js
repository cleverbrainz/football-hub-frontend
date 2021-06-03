
import React, { useEffect, useState } from "react";
import {
  FormControl,
  Container,
  InputLabel,
  OutlinedInput,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableComponent from '../../Dashboards/dashboardComponents/TestComponent';
import axios from "axios";
import auth from "../../lib/auth";
import ResetCampDetailsDialogue from '../../components/ResetCampDetailsDialogue'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment'


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    textAlign: "center",
  },
  form: {
    width: "40%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-evenly",
    margin: "20px 0",
  },
  formControl: {
    // margin: theme.spacing(1),
    minWidth: "100px",
    margin: "20px 10px",
  },
  button: {
    position: "relative",
    margin: "15px 0",
  },
}));
export default function WeeklyformDetails({ history, course, handleCampResetInformation,
  handleStateRefresh }) {
  // console.log(course)
  const classes = useStyles();
  const [rows, setRows] = React.useState([1]);
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [open, setOpen] = useState(false);

  const [formDetails, setFormDetails] = React.useState({
    optionalName: course ? course.courseDetails.optionalName : '',
    startDate: course ? course.courseDetails.startDate : "",
    endDate: course ? course.courseDetails.endDate : "",
    sessions: course ? course.courseDetails.sessions : [],
    cost: course ? course.courseDetails.cost : "",
    courseType: "Weekly",
    allow_weekly_payment: course ? course.courseDetails.allow_weekly_payment : false,
    // age: course ? course.courseDetails.age : "",
    ageFrom: course ? course.courseDetails.age.split(' ')[0] : "",
    ageTo: course ? course.courseDetails.age.split(' ')[2] : "",
    spaces: course ? course.courseDetails.spaces : "",
    courseCategory: course ? course.courseDetails.courseCategory : "",
    service: course ? course.courseDetails.service : ""
  });

  const { startDate, courseCategory, service, endDate, sessions, cost, optionalName,
    courseType, allow_weekly_payment, ageFrom, ageTo, location } = formDetails;

  const handleClose = () => {
    setOpen(false);
  };



  useEffect(() => {

    // document.querySelectorAll('span').forEach(el => {
    //   console.log(el.className)
    // })

    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        const locationArr = []
        const ageArr = []
        const serviceArr = []
        res.data[0].locations.map(el => locationArr.push(el))
        res.data[0].services.map(el => serviceArr.push(el))
        res.data[0].ageDetails.map(el => ageArr.push(el));
        setLocations(locationArr)
        setServices(serviceArr)
        setAgeGroups(ageArr)
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseDetails = { ...formDetails }
    courseDetails.age = `${ageFrom} - ${ageTo}`
    const properties = ['ageFrom', 'ageTo']
    properties.forEach(prop => delete courseDetails[prop])

    if (course) {

      return axios
        .patch("/companies/array/courses", { ...course, courseDetails },
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
        .then((res) => {
          handleStateRefresh()
        })
        .catch((error) => {
          alert(error.message);
        });
    }

  };


  function timeConversion(time) {
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

  function updateCourseDays(index, event) {

    const { name, value } = event.target;
    const courseDays = [...formDetails.sessions];

    if (name === 'location') {
      let longitude, latitude

      locations.map(el => {
        if (el.venue === value.replace(/ *\([^)]*\) */g, "")) {
          longitude = el.longitude
          latitude = el.latitude
        }
      })
      courseDays[index] = { ...courseDays[index], [name]: value, longitude, latitude };
    } else if (name === 'startTime' || name === 'endTime') {
      let endTime
      let startTime
      if (courseDays[index]) {
        if (name === 'startTime') {

          const startMoment = moment(value, 'HH:mm')
          const endMoment = moment(courseDays[index].endTime, 'hh:mma')
          endTime = courseDays[index].endTime
          console.log(endTime, courseDays[index].endTime)
          endTime = moment(startMoment).isSameOrAfter(endMoment) ? timeConversion(value + ':00') : endTime
          console.log(endTime)
          courseDays[index] = { ...courseDays[index], [name]: timeConversion(value + ':00'), endTime: endTime }
        } else if (name === 'endTime') {
          const endMoment = moment(value, 'HH:mm')
          const startMoment = moment(courseDays[index].startTime, 'hh:mma')
          startTime = courseDays[index].startTime
          console.log(startTime, courseDays[index].startTime)
          startTime = moment(endMoment).isSameOrBefore(startMoment) ? timeConversion(value + ':00') : startTime
          console.log(startTime)
          courseDays[index] = { ...courseDays[index], [name]: timeConversion(value + ':00'), startTime: startTime }
        }
      } else {
        courseDays[index] = { ...courseDays[index], [name]: timeConversion(value + ':00') }
      }
    } else {
      courseDays[index] = { ...courseDays[index], [name]: value };
    }
    console.log(courseDays)
    setFormDetails({ ...formDetails, sessions: courseDays });
  }

  function updateOtherCourseInfo(event) {
    const { name, value } = event.target;

    if (course && (name === 'startDate' || name === 'endDate')) setOpen(true)
    else setFormDetails({ ...formDetails, [name]: value });
  }

  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit}>
        <tr>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Optional Name</InputLabel>
            <OutlinedInput
              label='Optional Name'
              name="optionalName"
              type="text"
              value={optionalName}
              onChange={(e) => updateOtherCourseInfo(e)}
            />
          </FormControl>

          {
            [...Array(2).keys()].map((el, i) => {
              const items = ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', 'Adults']
              const label = i === 0 ? 'Age From' : 'Age To'
              const name = i === 0 ? 'ageFrom' : 'ageTo'
              return (
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>{label}</InputLabel>
                  <Select
                    value={i === 0 ? ageFrom : ageTo}
                    label={label}
                    name={name}
                    onChange={(e) => updateOtherCourseInfo(e)}
                  >
                    {items.map((el, i) => {
                      return (
                        <MenuItem key={i} value={el}>
                          {el}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              )
            })
          }





          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Course Category</InputLabel>
            <Select
              value={courseCategory}
              label="Course Category"
              name="courseCategory"
              onChange={(e) => updateOtherCourseInfo(e)}
            >

              <MenuItem value='summer'> Summer </MenuItem>
              <MenuItem value='winter'> Winter </MenuItem>
              <MenuItem value='autumn'> Autumn </MenuItem>
              <MenuItem value='spring'> Spring </MenuItem>

            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Service</InputLabel>
            <Select
              value={service}
              label="Service"
              name="service"
              onChange={(e) => updateOtherCourseInfo(e)}>

              {services && services.map((el, i) => {
                return (
                  <MenuItem key={i} value={el.name}> {el.name} </MenuItem>
                )
              })}
            </Select>
          </FormControl>
        </tr>

        <TextField
          name="startDate"
          label="Start"
          type="date"
          variant="outlined"
          defaultValue="2017-05-24"
          InputLabelProps={{
            shrink: true,
          }}
          className={classes.formControl}
          value={startDate}
          onChange={(e) => updateOtherCourseInfo(e)}
        />
        <TextField
          name="endDate"
          label="End"
          type="date"
          variant="outlined"
          defaultValue={startDate}
          InputLabelProps={{
            shrink: true,
          }}
          className={classes.formControl}
          value={endDate}
          onChange={(e) => updateOtherCourseInfo(e)}
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Spaces</InputLabel>
          <OutlinedInput
            name="spaces"
            id="spaces"
            value={formDetails.spaces}
            label="Spaces"
            onChange={(e) => updateOtherCourseInfo(e)}
          />
        </FormControl>




        {!course ? rows.map((el, i) => {
          return (
            <TableComponent
              classes={classes}
              updateCourseDays={(e) => updateCourseDays(i, e)}
              key={i}
              location={location}
              updateOtherCourseInfo={(e) => updateOtherCourseInfo(e)}
              locations={locations}
              session={sessions[i]}
            />
          );
        }) : (
            sessions.map((el, i) => {
              return (
                <TableComponent
                  el={el}
                  index={i}
                  location={location}
                  locations={locations}
                  updateOtherCourseInfo={(e) => updateOtherCourseInfo(e)}
                  classes={classes}
                  updateCourseDays={(e) => updateCourseDays(i, e)}
                  key={i}
                />
              );
            })
          )}

        {!course && <Button
          variant="contained"
          color="primary"
          onClick={() => setRows([...rows, 1])}>
          Add another session
        </Button>}


        <div style={{ display: 'flex', flexDirection: 'column' }}>

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Total Cost (£)</InputLabel>
            <OutlinedInput
              disabled={course}
              name="cost"
              type="number"
              id="cost"
              label="Total Cost (£)"
              value={cost}
              onChange={(e) => updateOtherCourseInfo(e)}
            />
          </FormControl>


          <FormControlLabel
            control={
              <Checkbox
                disabled={(course && course.courseDetails.allow_weekly_payment) ? true : false}
                checked={allow_weekly_payment}
                onChange={(e) => setFormDetails({ ...formDetails, allow_weekly_payment: e.target.checked })}
                name="checkedB"
                color="primary"
              />
            }
            label="Allow players to subscribe to the course and pay on a weekly basis?"
          />
          {(!course || !course.courseDetails.allow_weekly_payment) &&
            <p style={{ color: 'red' }}>
              Total cost and subscription option (if selected) cannot be changed once saved
          </p>}
        </div>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          DONE
        </Button>
        <div>
        </div>
      </form>

      {open && <ResetCampDetailsDialogue
        open={open}
        courseId={course.courseId}
        handleCampResetInformation={(courseId) => handleCampResetInformation(courseId)}
        handleClose={() => handleClose()}
      />}
    </Container>
  );
}
