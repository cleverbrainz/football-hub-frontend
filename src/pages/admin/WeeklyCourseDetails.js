// import "date-fns";
import React, { useEffect } from "react";
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
  const [locations, setLocations] = React.useState([]);
  const [ageGroups, setAgeGroups] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const [formDetails, setFormDetails] = React.useState({
    optionalName: course ? course.courseDetails.optionalName : '',
    startDate: course ? course.courseDetails.startDate : "",
    endDate: course ? course.courseDetails.endDate : "",
    sessions: course ? course.courseDetails.sessions : [],
    cost: course ? course.courseDetails.cost : "",
    courseType: "Weekly",
    paymentInterval: course ? course.courseDetails.paymentInterval : "",
    age: course ? course.courseDetails.age : "",
    location: course ? course.courseDetails.location : "",
    latitude: "",
    longitude: ""
  });

  const { startDate, endDate, sessions, cost, optionalName,
    courseType, paymentInterval, age, location } = formDetails;

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        const locationArr = []
        const ageArr = []
        res.data[0].locations.map(el => locationArr.push(el))
        res.data[0].ageDetails.map(el => ageArr.push(el));
        setLocations(locationArr)
        setAgeGroups(ageArr)
      })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const courseDetails = { ...formDetails }

    locations.map(el => {
      if (el.venue === formDetails.location.replace(/ *\([^)]*\) */g, "")) {
        courseDetails.longitude = el.longitude
        courseDetails.latitude = el.latitude
      }
    })

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
    courseDays[index] = { ...courseDays[index], [name]: value };

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
            <InputLabel>Location</InputLabel>
            <Select
              value={location}
              label="Location"
              name="location"
              onChange={(e) => updateOtherCourseInfo(e)}
            >
              {locations && locations.map((el, i) => (
                <MenuItem key={i} value={`${el.venue} (${el.postCode && el.postCode})`}>
                  {`${el.venue} (${el.postCode && el.postCode})`}
                </MenuItem>
              ))}
            </Select>
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
          defaultValue="2017-05-24"
          InputLabelProps={{
            shrink: true,
          }}
          className={classes.formControl}
          value={endDate}
          onChange={(e) => updateOtherCourseInfo(e)}
        />

        {!course ? rows.map((el, i) => {
          return (
            <TableComponent
              classes={classes}
              updateCourseDays={(e) => updateCourseDays(i, e)}
              key={i}
            />
          );
        }) : (
            sessions.map((el, i) => {
              return (
                <TableComponent
                  el={el}
                  index={i}
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
          onClick={() => setRows([...rows, 1])}
        >
          Add another session
        </Button>}

        <Typography variant="h5">Cost</Typography>
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>£</InputLabel>
            <OutlinedInput
              name="cost"
              type="number"
              id="cost"
              label="£"
              value={cost}
              onChange={(e) => updateOtherCourseInfo(e)}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Select</InputLabel>
            <Select
              label="Select"
              name="paymentInterval"
              value={paymentInterval}
              onChange={(e) => updateOtherCourseInfo(e)}
            >
              <MenuItem value="Session">Session</MenuItem>
              <MenuItem value="Course">Course</MenuItem>
              <MenuItem value="Term">Monthly</MenuItem>
            </Select>
          </FormControl>
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
