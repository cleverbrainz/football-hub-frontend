import React, { useEffect } from "react";
import { Container, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  heading: {
    color: "blue",
  },
  button: {
    position: "relative",
    margin: "15px 0",
  },
}));

export default function CompanyDetailsApproved({ location }) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    details: null,
  });
  return (
    <Container className={classes.container}>
      <Typography variant="h6" className={classes.heading}>
        Course Type
      </Typography>
      <div>{location.state.courseDetails.courseType}</div>
      <Typography variant="h6" className={classes.heading}>
        Course Id
      </Typography>
      <div>{location.state.courseId}</div>
      <Typography variant="h6" className={classes.heading}>
        First Day
      </Typography>
      <div>{location.state.courseDetails.firstDay}</div>
      <Typography variant="h6" className={classes.heading}>
        Last Day
      </Typography>
      <div>{location.state.courseDetails.lastDay}</div>
      <Typography variant="h6" className={classes.heading}>
        Day Cost
      </Typography>
      <div>{location.state.courseDetails.dayCost}</div>
      <Typography variant="h6" className={classes.heading}>
        Camp Cost
      </Typography>
      <div>{location.state.courseDetails.campCost}</div>
      <Link
        to={{
          pathname: "/companyDashboard/editCourses",
          state: location.state,
        }}
      >
        <Button className={classes.button} variant="contained" color="primary">
          Make Changes
          <EditIcon />
        </Button>
      </Link>

      <Link to={{ pathname: "/companyDashboard/courses" }}>
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
    </Container>
  );
}
