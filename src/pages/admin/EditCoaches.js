import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Checkbox,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  OutlinedInput,
  Container,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { storage, coachCollection } from "../../lib/firebase";
import axios from 'axios'
import auth from '../../lib/auth'

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: "10px 0",
    textAlign: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
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
    width: "30%",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    height: "55%",
    justifyContent: "space-around",
  },
  button: {
    position: "relative",
    margin: "10px 0",
  },
  upload: {
    margin: "20px auto",
  },
  center: {
    margin: "0 auto",
  },
}));

export default function FormPropsTextFields({ location, history }) {
  const classes = useStyles();

  const { coachId, imageURL } = location.state 

  const [image, setImage] = React.useState(null);
  const [url, setUrl] = React.useState("");

  const [name, setName] = React.useState(location.state.coach_name);
  const [email, setEmail] = React.useState(location.state.coach_email);
  const [phone, setPhone] = React.useState(location.state.coach_number);
  const [level, setLevel] = React.useState(location.state.coaching_level);

  const [state, setState] = React.useState({
    checked: false,
    details: null,
  });

  const handleUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.patch('/companies/coaches', {
      imageURL,
      coach_name: name,
      coach_email: email,
      coach_number: phone,
      coaching_level: level,
      coachId
    }, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res.data)
        history.push("/companyDashboard/coaches");
      })
      .catch((error) => {
        alert(error.message);
      });

    if (image) {
      const uploadTask = storage.ref(`coaches/${image.name}`).put(image);

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

    // setName("");
    // setEmail("");
    // setPhone("");
    // setLevel("");
  };

  //console.log("image: ", image);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (
    <Container className={classes.container}>
      <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h4"> EDIT COACHES </Typography>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Coach name </InputLabel>
          <OutlinedInput
            label="Coach name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></OutlinedInput>
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Coach email </InputLabel>
          <OutlinedInput
            label="Coach email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined">
            {" "}
            Coach phone number{" "}
          </InputLabel>
          <OutlinedInput
            label="Coach phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormControl>

        <FormControl variant="outlined">
          <InputLabel htmlFor="component-outlined" id="level">
            Coach Badges
          </InputLabel>
          <Select
            label="Coach Badges"
            id="select-level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"FA Level 1"}>FA Level 1</MenuItem>
            <MenuItem value={"FA Level 2"}>FA Level 2</MenuItem>
            <MenuItem value={"FA Level 3 (UEFA B)"}>
              FA Level 3 (UEFA B)
            </MenuItem>
            <MenuItem value={"FA Level 4 (UEFA A)"}>
              FA Level 4 (UEFA A)
            </MenuItem>
            <MenuItem value={"FA Level 5 (UEFA PRO)"}>
              FA Level 5 (UEFA PRO)
            </MenuItem>
          </Select>
        </FormControl>

        <input
          id="upload-photo"
          className={classes.upload}
          type="file"
          onChange={handleUpload}
        />

        <Typography variant="h5"> DBS Check </Typography>

        <FormControlLabel
          control={
            <Checkbox
              color="default"
              checked={state.checked}
              onChange={handleChange}
              name="checked"
            />
          }
          className={classes.center}
          label="Yes, this coach has a clean record"
        />

        <input
          id="upload-photo"
          className={classes.upload}
          type="file"
          onChange={handleUpload}
        />

        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          Save
        </Button>

        {/* <Link
          to={{
            pathname: "/coachDetails",
            state: location.state,
          }}
        >
          <Button
            onClick={() => history.push("/coachDetails")}
            className={classes.button}
            variant="outlined"
            color="primary"
          >
            Back
          </Button>
        </Link> */}
      </form>
    </Container>
  );
}
