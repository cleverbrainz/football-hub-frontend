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
import { coachCollection } from "../../lib/firebase";
import { firebaselooper } from "../../lib/tools";
import auth from '../../lib/auth'

import axios from 'axios'

const useStyles = makeStyles(() => ({
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
        setState(res.data[0].coaches)
      
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);


  return (
    <Container className={classes.container}>
      <Typography variant="h4"> COACHES</Typography>

      {state && state.map((data, i) => {
      return (
        <div key={i}>
          <Card className={classes.card}>
            <Link
              to={{
                pathname: "/companyDashboard/coachDetails",
                state: data,
              }}
            >
              <CardContent>
                <Typography variant="h6">{data.coach_name}</Typography>
                <div>{data.coaching_level}</div>
              </CardContent>
            </Link>
          </Card>
        </div>
      )
    })}

      <Link to="/companyDashboard/addCoaches">
        <Button variant="contained" color="primary">
          ADD ANOTHER COACH
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
