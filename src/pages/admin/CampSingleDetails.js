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

export default function MaterialUIPickers({ location, history }) {
  const classes = useStyles();
  const [rows, setRows] = React.useState([1]);
  const [campDetails, setCampDetails] = React.useState({
    startDate: "",
    dayCost: "",
    // excludeDays: "",
    courseType: "Camp",
    sessions: [],
  });
  const { startDate, dayCost, sessions } = campDetails;

  const handleSubmit = (e) => {
    e.preventDefault();

    e.preventDefault();

    console.log(campDetails);

    axios
      .post("/companies/courses", {
        campDetails,
        companyId: auth.getUserId(),
      })
      .then((res) => {
        console.log(res.data);
        history.push("/companyDashboard/courses");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  function updateCampDays(index, event) {
    const { name, value } = event.target;
    const campDays = [...campDetails.sessions];
    campDays[index] = { ...campDays[index], [name]: value };
    setCampDetails({ ...campDetails, sessions: campDays });
  }
  function updateOtherCampInfo(event) {
    const { name, value } = event.target;
    setCampDetails({ ...campDetails, [name]: value });
  }

  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>
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
          onChange={(e) => updateOtherCampInfo(e)}
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>£ Cost per day</InputLabel>
          <OutlinedInput
            name="£ Cost per day"
            id="cost"
            label="£ Cost per day"
            value={dayCost}
            name="dayCost"
            onChange={(e) => updateOtherCampInfo(e)}
          />
        </FormControl>

        {rows.map((el, i) => {
          return (
            <SingleComponent
              classes={classes}
              updateCampDays={(e) => updateCampDays(i, e)}
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
