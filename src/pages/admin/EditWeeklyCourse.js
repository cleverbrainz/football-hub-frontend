// import "date-fns";
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
  const [rows, setRows] = React.useState([1]);
  const { courseId } = location.state;
  const {
    startDate,
    endDate,
    cost,
    sessions,
    paymentInterval,
  } = location.state.courseDetails;
  const [StartDate, setStartDate] = React.useState(startDate);
  const [Session, setSession] = React.useState(sessions);
  const [EndDate, setEndDate] = React.useState(endDate);
  const [Cost, setCost] = React.useState(cost);
  const [PaymentInterval, setPaymentInterval] = React.useState(paymentInterval);

  console.log(location.state);
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .patch(
        "/companies/courses",
        {
          startDate: StartDate,
          endDate: EndDate,
          sessions: Session,
          cost: Cost,
          paymentInterval: PaymentInterval,
          courseId,
        },
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      )
      .then((res) => {
        console.log(res.data);
        // history.push("/companyDashboard/weeklyDetails");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  function updateCourseDays(index, event) {
    const { name, value } = event.target;
    const courseDays = [...Session.sessions];
    courseDays[index] = { ...courseDays[index], [name]: value };
    setSession({ ...Session, sessions: courseDays });
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
          value={StartDate}
          onChange={(e) => setStartDate(e.target.value)}
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
          value={EndDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {sessions.map((el, i) => {
          // return <h1>Hello</h1>;
          return (
            <TableComponent
              classes={classes}
              key={i}
              updateCourseDays={(e) => updateCourseDays(i, e)}
              Session={sessions[i]}
            />
          );
        })}

        <Button
          variant="contained"
          color="primary"
          onClick={() => setRows([...rows, 1])}
        >
          Add another session
        </Button>

        <Typography variant="h5">Cost</Typography>
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>£</InputLabel>
            <OutlinedInput
              name="cost"
              type="number"
              id="cost"
              label="£"
              value={Cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Select</InputLabel>
            <Select
              label="Select"
              name="paymentInterval"
              value={PaymentInterval}
              onChange={(e) => setPaymentInterval(e.target.value)}
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
