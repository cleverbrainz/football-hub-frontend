import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Container, Typography } from "@material-ui/core";
import { db, storage, serviceCollection } from "../../lib/firebase";
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

export default function ContainedButtons() {
  const classes = useStyles();
  const [image, setImage] = React.useState(null);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [url, setUrl] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/companies/services', {
      service_name: name,
      service_description: description,
      // companyId: '7DK37g0zVmNowHax6cEJ'
      companyId: auth.getUserId()
    })
      .then(res => {
        console.log(res.data);
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



    setName("");
    setDescription("");
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
        <Typography variant="h4"> SERVICES</Typography>
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

        <Link to="/companyDashboard/services">
          <Button variant="outlined" color="primary">
            Back
          </Button>
        </Link>
      </form>
    </Container>
  );
}
