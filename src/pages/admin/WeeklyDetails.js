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
        Age
      </Typography>
      <div>{location.state.courseDetails.age}</div>
      <Typography variant="h6" className={classes.heading}>
        Start Date
      </Typography>
      <div>{location.state.courseDetails.startDate}</div>
      <Typography variant="h6" className={classes.heading}>
        End Date
      </Typography>
      <div>{location.state.courseDetails.endDate}</div>
      <Typography variant="h6" className={classes.heading}>
        Cost
      </Typography>
      <div>{location.state.courseDetails.cost}</div>
      <Typography variant="h6" className={classes.heading}>
        Payment Intervals
      </Typography>
      <div>{location.state.courseDetails.paymentInterval}</div>
      <Link
        to={{
          pathname: "/companyDashboard/editWeeklyCourse",
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
