import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";

import axios from "axios";
import auth from '../../lib/auth'

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  card: {
    height: "100px",
    width: "200px",
  },
}));

export default function ContainedButtons() {
  const classes = useStyles();

  const [state, setState] = React.useState();

  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        console.log(res.data)
        setState(res.data[0].courses)
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);


  return (
    <Container className={classes.container}>
      <Typography variant="h4">COURSES</Typography>

      {state && state.map((data, i) => {
        const { startDate, endDate } = data.courseDetails
        
        return (
          <div key={i}>
            <Card className={classes.card}>
              <Link to="">
                <CardContent>
                  {/* <Typography variant="h6">{age}</Typography> */}
                  <div>Course {i + 1}</div>
                  <div>{startDate}</div>
                  <div>{endDate}</div>
                </CardContent>
              </Link>
            </Card>
          </div>
        );
      })}

      <Link to="/companyDashboard/addCourses">
        <Button variant="contained" color="primary">
          ADD NEW COURSE
        </Button>
      </Link>
      <Link to="/companyDashboard">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
    </Container>
  );
}
