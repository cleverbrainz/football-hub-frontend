import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Container } from "@material-ui/core";
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
  spacing: {
    margin: "15px 0",
  },
  form: {
    width: "40%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-around",
  },
  upload: {
    margin: "20px auto",
  },
}));

export default function ContainedButtons({ history, service, getData, handleChange }) {
  const classes = useStyles();

  const [form, setForm] = useState({
    name: service ? service.name : '',
    description: service ? service.description : '',
    companyId: auth.getUserId(),
  })

  const handleSubmit = (e) => {
    e.preventDefault();


    if (service) {
      return axios
        .patch("/companies/array/services", { ...form, serviceId: service.serviceId },
          { headers: { Authorization: `Bearer ${auth.getToken()}` } })
        .then((res) => {
          getData()
          handleChange(e,0)
        })
        .catch((error) => {
          getData()
          handleChange(e,0)
        });

    } else {
      return axios
        .post("/companies/services", form, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
        .then((res) => {
          getData()
          handleChange(e,0)
        })
        .catch((error) => {
          getData()
          handleChange(e,0)
        });
    }

  };

  const { name, description } = form

  const updateFormDetails = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  return (
    <Container className={classes.container}>
      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >

        <TextField
          className={classes.spacing}
          id="outlined-basic"
          label="Service name"
          variant="outlined"
          name='name'
          value={name}
          onChange={(e) => updateFormDetails(e)}
        />
        <TextField
          className={classes.spacing}
          id="outlined-basic"
          label="Service description"
          name='description'
          multiline
          rows={8}
          variant="outlined"
          value={description}
          onChange={(e) => updateFormDetails(e)}
        />
        <Button
          className={classes.spacing}
          type="submit"
          variant="contained"
          color="primary"
        >
          SAVE
        </Button>
      </form>
    </Container>
  );
}
