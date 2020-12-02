import React, { useState } from "react";
import { Button, Container, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import AgeComponent from "./AgeComponent";
import axios from "axios";
import auth from "../../lib/auth";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
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

export default function AddAgeGroup({ handleStateRefresh }) {
  const classes = useStyles();
  const [rows, setRows] = React.useState([1]);

  const [ageDetails, setAgeDetails] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(ageDetails);

    axios
      .post("/companies/age", ageDetails,
        { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then((res) => {
        handleStateRefresh()
        console.log(res.data);
      })
      .catch((error) => {
        handleStateRefresh()
        console.log(error);
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
        <p> Add the age groups you work with here. This is important for when you
        add your courses for the ages they apply to.
        </p>
        <table>
          <tbody>
            <tr>
              {rows.map((el, i) => {
                return (
                  <div style={{ display: 'flex' }}>
                    <Typography variant="p">{i + 1} </Typography>
                    <AgeComponent
                      classes={classes}
                      updateAges={(e) => updateAges(i, e)}
                      key={i}
                    />
                  </div>
                );
              })}
            </tr>
          </tbody>

          <tr>
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: '10px' }}
              onClick={() => setRows([...rows, 1])}
            >
              Add more
        </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              SAVE
        </Button>
          </tr>
        </table>


      </form>
    </Container>
  );
}
