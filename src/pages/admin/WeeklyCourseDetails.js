// import "date-fns";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FormControl,
  Container,
  InputLabel,
  OutlinedInput,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TableComponent from "./TestComponent";
import axios from "axios";
import auth from "../../lib/auth";
import ResetCampDetailsDialogue from '../../components/ResetCampDetailsDialogue'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
    allowWeeklyPayment: course ? course.courseDetails.allowWeeklyPayment : false,
    age: course ? course.courseDetails.age : "",
    spaces: course ? course.courseDetails.spaces : "",
    courseCategory: course ? course.courseDetails.courseCategory : "",
    service: course ? course.courseDetails.service : ""
  });

  const { startDate, courseCategory, service, endDate, sessions, cost, optionalName,
    courseType, paymentInterval, age, location } = formDetails;

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
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
    } else {
      courseDays[index] = { ...courseDays[index], [name]: value };
    }

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

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Age Group</InputLabel>
            <Select
              value={age}
              label="Age Group"
              name="age"
              onChange={(e) => updateOtherCourseInfo(e)}
            >
              {ageGroups && ageGroups.map((el, i) => {
                const text = el.startAge === 'Adults' ? 'Adults' : `${el.startAge}-${el.endAge}`
                return (
                  <MenuItem key={i} value={text}>
                    {text}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

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
                checked={formDetails.allowWeeklyPayment}
                onChange={(e) => setFormDetails({ ...formDetails, allowWeeklyPayment: e.target.checked })}
                name="checkedB"
                color="primary"
              />
            }
            label="Allow the option to pay on a weekly basis?"
          />
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
