import React from "react";
import { Button, Container, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  makeStyles,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@material-ui/core";
import AgeComponent from "./AgeComponent";

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: "200px",
    margin: "20px 10px",
  },
  rowHead: {
    position: "relative",
    top: "-8px",
    margin: "40px",
  },
}));

export default function AddAgeGroup() {
  const classes = useStyles();
  const [rows, setRows] = React.useState([1]);

  const [ageDetails, setAgeDetails] = React.useState({
    ages: "",
  });

  function updateAges(index, event) {
    const { name, value } = event.target;
    const ages = [...ageDetails.sessions];
    ages[index] = { ...ages[index], [name]: value };

    setAgeDetails({ ...ageDetails, sessions: ages });
  }

  return (
    <Container className={classes.container}>
      <Typography variant="h3">AGE GROUPS</Typography>
      <div>
        Add the age groups you work with here. This is important for when you
        add your courses for the ages they apply to.
      </div>
      <table>
        <tbody>
          <tr>
            {rows.map((el, i) => {
              return (
                <>
                  <Typography variant="h6">{i + 1}: Age Group</Typography>
                  <AgeComponent
                    classes={classes}
                    updateAgeDays={(e) => updateAges(i, e)}
                    key={i}
                  />
                </>
              );
            })}
          </tr>
        </tbody>
      </table>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setRows([...rows, 1])}
      >
        Add more
      </Button>
      <Button className={classes.button} variant="contained" color="primary">
        DONE
      </Button>
      <Link to="/companyDashboard">
        <Button className={classes.button} variant="outlined" color="primary">
          Back
        </Button>
      </Link>
    </Container>
  );
}
