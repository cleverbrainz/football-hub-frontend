import React from "react";
import { Button, Container, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import AgeComponent from "./AgeComponent";
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

  const [ageDetails, setAgeDetails] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(ageDetails);

    axios
      .post(
        "/companies/age",
        {
          ageDetails,
        },
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  function updateAges(index, event) {
    const { name, value } = event.target;
    const ages = [...ageDetails];
    ages[index] = { ...ages[index], [name]: value };
    setAgeDetails(ages);
  }

  return (
    <Container className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.container}>
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
                      updateAges={(e) => updateAges(i, e)}
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
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          type="submit"
        >
          DONE
        </Button>
        <Link to="/companyDashboard">
          <Button className={classes.button} variant="outlined" color="primary">
            Back
          </Button>
        </Link>
      </form>
    </Container>
  );
}
