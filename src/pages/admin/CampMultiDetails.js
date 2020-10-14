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
  Typography,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { db } from "../../lib/firebase";

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

export default function MaterialUIPickers() {
  const classes = useStyles();

  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [age, setAge] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  const [spaces, setSpaces] = React.useState("");
  const [campCost, setCampCost] = React.useState("");
  const [dayCost, setDayCost] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    db.collection("CampMultiDay")
      .add({
        startDate: startDate,
        endDate: endDate,
        age: age,
        startTime: startTime,
        endTime: endTime,
        spaces: spaces,
        campCost: campCost,
        dayCost: dayCost,
      })
      .then(() => {
        alert("Message has been submitted!");
      })
      .catch((error) => {
        alert(error.message);
      });

    setStartDate("");
    setEndDate("");
    setAge("");
    setStartTime("");
    setEndTime("");
    setSpaces("");
    setCampCost("");
    setDayCost("");
  };

  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>
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
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
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
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
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

        <table>
          <tbody>
            <tr>
              <td>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Age group</InputLabel>
                  <Select
                    label="Age group"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={"4-6 years"}>4-6 years</MenuItem>
                    <MenuItem value={"7-9 years"}>7-9 years</MenuItem>
                    <MenuItem value={"10-12 years"}>10-12 years</MenuItem>
                  </Select>
                </FormControl>
              </td>
              <td>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Start</InputLabel>
                  <Select
                    label="Start"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  >
                    <MenuItem aria-label="Select" value="" />
                    <MenuItem value={"6am"}>6am</MenuItem>
                    <MenuItem value={"7am"}>7am</MenuItem>
                    <MenuItem value={"8am"}>8am</MenuItem>
                    <MenuItem value={"9am"}>9am</MenuItem>
                    <MenuItem value={"10am"}>10am</MenuItem>
                    <MenuItem value={"11am"}>11am</MenuItem>
                    <MenuItem value={"1pm"}>1pm</MenuItem>
                    <MenuItem value={"2pm"}>2pm</MenuItem>
                    <MenuItem value={"3pm"}>3pm</MenuItem>
                    <MenuItem value={"4pm"}>4pm</MenuItem>
                    <MenuItem value={"5pm"}>5pm</MenuItem>
                    <MenuItem value={"6pm"}>6pm</MenuItem>
                    <MenuItem value={"7pm"}>7pm</MenuItem>
                    <MenuItem value={"8pm"}>8pm</MenuItem>
                    <MenuItem value={"9pm"}>9pm</MenuItem>
                    <MenuItem value={"10pm"}>10pm</MenuItem>
                    <MenuItem value={"11pm"}>11pm</MenuItem>
                  </Select>
                </FormControl>
              </td>

              <td>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Finish</InputLabel>
                  <Select
                    label="Finish"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  >
                    <MenuItem aria-label="Select" value="" />
                    <MenuItem value={"6am"}>6am</MenuItem>
                    <MenuItem value={"7am"}>7am</MenuItem>
                    <MenuItem value={"8am"}>8am</MenuItem>
                    <MenuItem value={"9am"}>9am</MenuItem>
                    <MenuItem value={"10am"}>10am</MenuItem>
                    <MenuItem value={"11am"}>11am</MenuItem>
                    <MenuItem value={"1pm"}>1pm</MenuItem>
                    <MenuItem value={"2pm"}>2pm</MenuItem>
                    <MenuItem value={"3pm"}>3pm</MenuItem>
                    <MenuItem value={"4pm"}>4pm</MenuItem>
                    <MenuItem value={"5pm"}>5pm</MenuItem>
                    <MenuItem value={"6pm"}>6pm</MenuItem>
                    <MenuItem value={"7pm"}>7pm</MenuItem>
                    <MenuItem value={"8pm"}>8pm</MenuItem>
                    <MenuItem value={"9pm"}>9pm</MenuItem>
                    <MenuItem value={"10pm"}>10pm</MenuItem>
                    <MenuItem value={"11pm"}>11pm</MenuItem>
                  </Select>
                </FormControl>
              </td>
              <td>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel>Spaces</InputLabel>
                  <OutlinedInput
                    name="spaces"
                    id="spaces"
                    label="Spaces"
                    value={spaces}
                    onChange={(e) => setSpaces(e.target.value)}
                  />
                </FormControl>
              </td>
            </tr>
          </tbody>
        </table>
        <div>Add another row</div>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>£ Cost per camp</InputLabel>
          <OutlinedInput
            name="cost"
            id="cost"
            label="£ Cost per camp"
            value={campCost}
            onChange={(e) => setCampCost(e.target.value)}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>£ Cost per day</InputLabel>
          <OutlinedInput
            name="cost"
            id="cost"
            label="£ Cost per day"
            value={dayCost}
            onChange={(e) => setDayCost(e.target.value)}
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
