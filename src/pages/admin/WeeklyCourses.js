import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography } from "@material-ui/core";

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
}));

export default function ContainedButtons() {
  const classes = useStyles();
  const ageGroups = ['4-6', '7-9', '10-12', '13-15', '16-18', 'Adults']

  return (
    <Container className={classes.container}>
      <Typography variant="h4">SELECT THE AGE GROUP</Typography>
      {
        ageGroups.map((el, i) => {
          const age = i !== ageGroups.length - 1 ? `${el} years` : el
          return (
            <Link to={{
              pathname: "/companyDashboard/weeklyCourseDetails",
              state: age
            }}>
              <Button className={classes.form} variant="contained" color="primary">
                {age}
              </Button>
            </Link>
          )
        })
      }
      <Button className={classes.button} variant="contained" color="primary">
        DONE
      </Button>
      <Link to="/companyDashboard/addCourses">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
    </Container >
  );
}
