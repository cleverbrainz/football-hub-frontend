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

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
    margin: "200px auto",
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

export default function MaterialUIPickers({ location, history }) {
  const classes = useStyles();
  const [rows, setRows] = React.useState([1]);
  const [costType, setCostType] = React.useState(false);
  const locations = ["Epsom College", "Goals North Cheam"];
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [courseDetails, setCourseDetails] = React.useState({
    firstDay: "",
    lastDay: "",
    // excludeDays: "",
    sessions: [],
    courseType: "Camp",
    campCost: "",
    dayCost: "",
  });
  const { firstDay, lastDay } = courseDetails;

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setError(false);
    setCostType(false);
  };

  const handleSubmit = (e) => {
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
        <Typography variant="h6" className={classes.spacing}>
          Exclude any days
        </Typography>

        <table>
          <tr>
            <td className={classes.spacing}>
              <FormControlLabel control={<Checkbox />} label="Monday" />
            </td>
            <td className={classes.spacing}>
              <FormControlLabel control={<Checkbox />} label="Tuesday" />
            </td>
          </tr>
          <tr>
            <td className={classes.spacing}>
              <FormControlLabel control={<Checkbox />} label="Wednesday" />
            </td>
            <td className={classes.spacing}>
              <FormControlLabel control={<Checkbox />} label="Thursday" />
            </td>
          </tr>
          <tr>
            <td className={classes.spacing}>
              <FormControlLabel control={<Checkbox />} label="Friday" />
            </td>
            <td className={classes.spacing}>
              <FormControlLabel control={<Checkbox />} label="Saturday" />
            </td>
          </tr>
          <tr>
            <td className={classes.spacing}>
              <FormControlLabel control={<Checkbox />} label="Sunday" />
            </td>
          </tr>
        </table>

        {rows.map((el, i) => {
          return (
            <MultiComponent
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
          Add another age group
        </Button>

        <Typography variant="h6" className={classes.spacing}>
          Booking Options
        </Typography>
        <RadioGroup
          aria-label="quiz"
          name="quiz"
          value={value}
          onChange={handleRadioChange}
        >
          <FormControl component="fieldset">
            <FormControlLabel
              value="whole"
              control={<Radio />}
              label="Customers can book as a whole only"
              onClick={() => setCostType(true)}
            />
            <FormControlLabel
              value="one or more"
              control={<Radio />}
              label="Customers can book onto one or more days"
              onClick={() => setCostType(true)}
            />
          </FormControl>
        </RadioGroup>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>£ Cost per camp</InputLabel>
          <OutlinedInput
            name="campCost"
            id="cost"
            label="£ Cost per camp"
            //value={campCost}
            onChange={(e) => updateOtherCourseInfo(e)}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>£ Cost per day</InputLabel>
          <OutlinedInput
            name="dayCost"
            id="cost"
            label="£ Cost per day"
            //value={dayCost}
            onChange={(e) => updateOtherCourseInfo(e)}
          />
        </FormControl>

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
