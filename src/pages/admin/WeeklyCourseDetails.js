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
import TableComponent from "./TestComponent";
import axios from 'axios'
import auth from '../../lib/auth'

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

  const [courseDetails, setCourseDetails] = React.useState({
    startDate: '',
    endDate: '',
    sessions: [],
    cost: '',
    courseType: 'weekly',
    paymentInterval: '',
    age: location.state
  })

  const { startDate, endDate } = courseDetails

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(courseDetails)

    axios.post('/companies/courses', {
      courseDetails,
      companyId: auth.getUserId()

    })
      .then(res => {
        console.log(res.data);
        history.push('/companyDashboard/courses')
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  function updateCourseDays(index, event) {

    const { name, value } = event.target
    const courseDays = [...courseDetails.sessions]
    courseDays[index] = { ...courseDays[index], [name]: value }

    setCourseDetails({ ...courseDetails, sessions: courseDays })
  }

  function updateOtherCourseInfo(event) {
    const { name, value } = event.target
    setCourseDetails({ ...courseDetails, [name]: value })
  }


  return (
    <Container className={classes.container}>

      <form
        onSubmit={handleSubmit}
      >
         <Typography variant="h4"> {location.state} </Typography>

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
          onChange={e => updateOtherCourseInfo(e)}
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
          onChange={e => updateOtherCourseInfo(e)}
        />
     
        {rows.map((el, i) => {
          return (
            <TableComponent
              classes={classes}
              updateCourseDays={(e) => updateCourseDays(i, e)}
              key={i}
            />
          );
        })}

        <Button
          variant="contained" color="primary"
          onClick={() => setRows([...rows, 1])}>
          Add another session
          </Button>

        <Typography variant="h5">Cost</Typography>
        <div>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>£</InputLabel>
            <OutlinedInput
              name="cost"
              type='number'
              id="cost"
              label="£"
              onChange={e => updateOtherCourseInfo(e)}
            />
          </FormControl>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Select</InputLabel>
            <Select
              label="Select"
              name='paymentInterval'
              onChange={e => updateOtherCourseInfo(e)}
            >
              <MenuItem aria-label="Select">
                None
              </MenuItem>
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
          DONE
        </Button>
        <div>
          <Link to="/companyDashboard/weeklyCourses">
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
    </Container >
  );
}
