import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  spacing: {
    margin: "20px 0",
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

  return (
    <Container className={classes.container}>
      <Typography variant="h4">SELECT COURSE TYPE</Typography>
      <Link to="/companyDashboard/weeklyCourseDetails">
        <Button className={classes.form} variant="contained" color="primary">
          WEEKLY
        </Button>
      </Link>
      <Link to="/companyDashboard/campOptions">
        <Button className={classes.form} variant="contained" color="primary">
          CAMP
        </Button>
      </Link>
      {/* <Link>
                <Button className={classes.form} variant="contained" color="primary">
                    PACKAGE
      </Button>
            </Link> 
      <Link>
        <Button className={classes.form} variant="contained" color="primary">
          ONE 2 ONE
        </Button>
      </Link> */}
      <Link to="/companyDashboard/courses">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
    </Container>
  );
}
