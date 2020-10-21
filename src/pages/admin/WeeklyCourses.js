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
    textDecoration: "inherit",
    color: "inherit",
  },
}));

export default function ContainedButtons() {
  const classes = useStyles();
  //const ageGroups = ["4-6", "7-9", "10-12", "13-15", "16-18", "Adults"];
  const [state, setState] = React.useState();
  //const [ageValues, setAgeValues] = React.useState([]);

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      .then((res) => {
        console.log(res.data);
        setState(res.data[0].ageDetails);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Container className={classes.container}>
      <Typography variant="h4">SELECT THE AGE GROUP</Typography>
      {/* {!state && (
        <Button className={classes.form} variant="outlined" color="primary">
          <Link to="/companyDashboard/addAgeGroup">
            <Typography variant="h6">Add Age Details</Typography>
          </Link>
        </Button>
      )} */}

      {!state ? (
        <Card className={classes.form} variant="outlined" color="primary">
          <Link to="/companyDashboard/addAgeGroup">
            <CardContent>
              <Typography variant="h6">Add Age Groups</Typography>
            </CardContent>
          </Link>
        </Card>
      ) : (
        state.map((data, i) => {
          const years =
            (data.startAge || data.endAge) === `Adults` ? "" : `years old`;
          let age;
          if (!data.startAge || data.startAge === data.endAge) {
            age = `${data.endAge} ${years}`;
          } else if (!data.endAge) {
            age = `${data.startAge} ${years}`;
          } else age = `${data.startAge} - ${data.endAge} ${years}`;
          //console.log(data.ageDetails.length - 1);

          return (
            <div key={i}>
              <Button
                className={classes.form}
                variant="outlined"
                color="primary"
              >
                <Link
                  to={{
                    pathname: "/companyDashboard/weeklyCourseDetails",
                    state: age,
                  }}
                >
                  <Typography variant="h6">{age}</Typography>
                </Link>
              </Button>
            </div>
          );
        })
      )}
      {/* {ageGroups.map((el, i) => {
        const age = i !== ageGroups.length - 1 ? `${el} years` : el;
        return (
          <Link
            to={{
              pathname: "/companyDashboard/weeklyCourseDetails",
              state: age,
            }}
          >
            <Button
              className={classes.form}
              variant="contained"
              color="primary"
            >
              {age}
            </Button>
          </Link>
        );
      })} */}
      <Button className={classes.button} variant="contained" color="primary">
        DONE
      </Button>
      <Link to="/companyDashboard/addCourses">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
    </Container>
  );
}
