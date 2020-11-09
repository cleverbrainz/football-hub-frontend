// import "date-fns";
import React, { useState } from "react";
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
import TableComponent from "./EditWeeklyCourseComponent";
import axios from "axios";
import auth from "../../lib/auth";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "100px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  form: {
    width: "40%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-around",
    margin: "20px 0",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "100px",
    margin: "20px 10px",
  },
  button: {
    position: "relative",
    margin: "15px 0",
  },
}));
export default function MaterialUIPickers({ location, history }) {
  const classes = useStyles();
  const { courseId, courseDetails } = location.state;
  const {
    startDate,
    endDate,
    cost,
    sessions,
    paymentInterval,
  } = courseDetails;

const [formDetails, setFormDetails] = useState({
    startDate,
    endDate,
    cost,
    sessions,
    paymentInterval,
})

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestBody = {...location.state, courseDetails: {...courseDetails, ...formDetails}}

    console.log(requestBody)

    axios
      .patch(
        "/companies/array/courses", requestBody,
        { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then((res) => {
        history.push("/companyDashboard/courses");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  function updateCourseDays(index, event) {
    const { name, value } = event.target;
    const courseDays = formDetails.sessions
    courseDays[index] = { ...courseDays[index], [name]: value };

    setFormDetails({ ...formDetails, sessions: courseDays })

  }

  function updateOtherCourseDetails(event) {
    const { name, value } = event.target;
    setFormDetails({...formDetails, [name]: value})
  }

  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit}>
        <Typography variant="h4"> Edit Weekly</Typography>

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
          value={formDetails.startDate}
          onChange={(e) => updateOtherCourseDetails(e)}
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
          value={formDetails.endDate}
          onChange={(e) => updateOtherCourseDetails(e)}
        />

        {formDetails.sessions.map((el, i) => {
          return (
            <TableComponent
              classes={classes}
              key={i}
              updateCourseDays={(e) => updateCourseDays(i, e)}
              session={formDetails.sessions[i]}
            />
          );
        })}

        {formDetails.sessions.length < 8 && <Button
              variant="contained" color="primary"
              onClick={() => {
                  setFormDetails({ ...formDetails, sessions: [...formDetails.sessions, {
                    day: '',
                    endTime: '',
                    startTime: '',
                    spaces: ''
                  }]})
                }
              }>
              Add another reason
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
              value={formDetails.cost}
              onChange={(e) => updateOtherCourseDetails(e)}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Select</InputLabel>
            <Select
              label="Select"
              name="paymentInterval"
              value={formDetails.paymentInterval}
              onChange={(e) => updateOtherCourseDetails(e)}
            >
              <MenuItem aria-label="Select">None</MenuItem>
              <MenuItem value="Session">Session</MenuItem>
              <MenuItem value="Course">Course</MenuItem>
              <MenuItem value="Term">Term</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          SAVE
        </Button>
        <div>
          <Link
            to={{
              pathname: "/companyDashboard/weeklyDetails",
              state: location.state,
            }}
          >
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
            >
              Back
            </Button>
          </Link>
        </div>
      </form>
    </Container>
  );
}
