import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Container, Typography } from "@material-ui/core";
import { serviceCollection, storage } from "../../lib/firebase";
import axios from 'axios'
import auth from '../../lib/auth'

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: `${window.innerHeight - 100}px`,
    textAlign: "center",
  },
  spacing: {
    margin: "20px 0",
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

export default function ContainedButtons({ location, history }) {
  const classes = useStyles();
  const { service_description, service_name, serviceId } = location.state;
  const [image, setImage] = React.useState(null);
  const [name, setName] = React.useState(service_name);
  const [description, setDescription] = React.useState(service_description);
  const [url, setUrl] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.patch('/companies/services', {
      service_name: name,
      service_description: description,
      serviceId
    }, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res.data)
        history.push("/companyDashboard/services");
      })
      .catch((error) => {
        alert(error.message);
      });

    if (image) {
      const uploadTask = storage.ref(`services/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);
            });
        }
      );
    }
  };

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <Container className={classes.container}>
      <form
        className={classes.form}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4"> EDIT SERVICES</Typography>
        <TextField
          className={classes.spacing}
          id="outlined-basic"
          label="Service name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          className={classes.spacing}
          id="outlined-basic"
          label="Service description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          id="upload-photo"
          className={classes.upload}
          type="file"
          onChange={handleUpload}
        />

        <Button
          className={classes.spacing}
          type="submit"
          variant="contained"
          color="primary"
        >
          SAVE
        </Button>

        {/* <Link to="/serviceDetails">
          <Button variant="outlined" color="primary">
            Back
          </Button>
        </Link> */}
      </form>
    </Container>
  );
}
