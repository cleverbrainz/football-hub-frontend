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
        Service Name
      </Typography>
      <div>{location.state.service_name}</div>
      <Typography variant="h6" className={classes.heading}>
        Service Description
      </Typography>
      <div>{location.state.service_description}</div>

      <Link
        to={{
          pathname: "/companyDashboard/editServices",
          state: location.state,
        }}
      >
        <Button className={classes.button} variant="contained" color="primary">
          Make Changes
          <EditIcon />
        </Button>
      </Link>

      <Link to={{ pathname: "/companyDashboard/services" }}>
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
    </Container>
  );
}
