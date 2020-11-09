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
  Select,
  MenuItem,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SingleComponent from "./CampSingleComponent";
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
  button: {
    position: "relative",
    margin: "15px 0",
  },
}));

export default function MaterialUIPickers({ history }) {
  const classes = useStyles();
  const [rows, setRows] = React.useState([1]);
  const locations = ["Epsom College", "Goals North Cheam"];
  const [courseDetails, setCourseDetails] = React.useState({
    startDate: "",
    dayCost: "",
    // excludeDays: "",
    courseType: "Single Camp",
    sessions: [],
  });
  const { startDate } = courseDetails;

  const handleSubmit = (e) => {
    e.preventDefault();

    e.preventDefault();

    console.log(courseDetails);

    axios
      .post("/companies/courses", {
        courseDetails,
        companyId: auth.getUserId(),
      })
      .then((res) => {
        console.log(res.data);
        history.push("/companyDashboard/campOptions");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  function updateCourseDays(index, event) {
    const { name, value } = event.target;
    const courseDays = [...courseDetails.sessions];
    courseDays[index] = { ...courseDays[index], [name]: value };
    setCourseDetails({ ...courseDetails, sessions: courseDays });
  }
  function updateOtherCourseInfo(event) {
    const { name, value } = event.target;
    setCourseDetails({ ...courseDetails, [name]: value });
  }

  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Location</InputLabel>
          <Select
            label="Location"
            name="location"
            onChange={(e) => updateOtherCourseInfo(e)}
          >
            <MenuItem>
              {" "}
              <em>Select</em>{" "}
            </MenuItem>
            {locations.map((el, i) => (
              <MenuItem key={i} value={el}>
                {" "}
                {el}{" "}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="date"
          label="Select date"
          type="date"
          className={classes.formControl}
          variant="outlined"
          defaultValue="2017-05-24"
          InputLabelProps={{
            shrink: true,
          }}
          name="startDate"
          value={startDate}
          onChange={(e) => updateOtherCourseInfo(e)}
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>£ Cost per day</InputLabel>
          <OutlinedInput
            name="£ Cost per day"
            id="cost"
            label="£ Cost per day"
            //value={dayCost}
            name="dayCost"
            onChange={(e) => updateOtherCourseInfo(e)}
          />
        </FormControl>

        {rows.map((el, i) => {
          return (
            <SingleComponent
              classes={classes}
              updateCampDays={(e) => updateCourseDays(i, e)}
              key={i}
            />
          );
        })}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setRows([...rows, 1])}
        >
          Add another row
        </Button>

        <Button className={classes.button} variant="contained" color="primary">
          SELECT ANOTHER DATE
        </Button>
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          DONE
        </Button>
        <Link to="/companyDashboard/campOptions">
          <Button className={classes.button} variant="outlined" color="primary">
            Back
          </Button>
        </Link>
      </form>
    </Container>
  );
}
