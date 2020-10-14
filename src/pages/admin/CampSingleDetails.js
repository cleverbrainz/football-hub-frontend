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
import { db } from "../../lib/firebase";

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

export default function MaterialUIPickers() {
  const classes = useStyles();

  const [startDate, setStartDate] = React.useState("");
  const [dayCost, setDayCost] = React.useState("");
  const [age, setAge] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const [spaces, setSpaces] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    db.collection("CampSingleDay")
      .add({
        startDate: startDate,
        dayCost: dayCost,
        age: age,
        startTime: startTime,
        endTime: endTime,
        spaces: spaces,
      })
      .then(() => {
        alert("Message has been submitted!");
      })
      .catch((error) => {
        alert(error.message);
      });

    setStartDate("");
    setDayCost("");
    setAge("");
    setStartTime("");
    setEndTime("");
    setSpaces("");
  };

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
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>£ Cost per day</InputLabel>
          <OutlinedInput
            name="£ Cost per day"
            id="cost"
            label="£ Cost per day"
            value={dayCost}
            onChange={(e) => setDayCost(e.target.value)}
          />
        </FormControl>

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
                    <MenuItem value={"u6s"}>u6s</MenuItem>
                    <MenuItem value={"7-9s"}>7-9s</MenuItem>
                    <MenuItem value={"10-12s"}>10-12s</MenuItem>
                    <MenuItem value={"13-15s"}>13-15s</MenuItem>
                    <MenuItem value={"16-18s"}>16-18s</MenuItem>
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
