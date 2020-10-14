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

  const {
    coach_name,
    coach_email,
    coach_number,
    coaching_level,
    imageURL
  } = location.state;
  return (
    <Container className={classes.container}>
      <Typography variant="h6" className={classes.heading}>
        Coach Name
      </Typography>
      <div>{coach_name && coach_name}</div>
      <Typography variant="h6" className={classes.heading}>
        Email address
      </Typography>
      <div>{coach_email && coach_email}</div>
      <Typography variant="h6" className={classes.heading}>
        Main Contact Number
      </Typography>
      <div>{coach_number && coach_number}</div>
      <Typography variant="h6" className={classes.heading}>
        Coaching badge
      </Typography>
      <div>{coaching_level && coaching_level}</div>
      <Typography variant="h6" className={classes.heading}>
        DBS Check
      </Typography>

      <Link
        to={{
          pathname: "/companyDashboard/editCoaches",
          state: location.state,
        }}
      >
        <Button className={classes.button} variant="contained" color="primary">
          Make Changes
          <EditIcon />
        </Button>
      </Link>

      <Link to="/companyDashboard/coaches">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
    </Container>
  );
}
