import React, { useEffect, useRef, useState } from "react";
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
import { storage } from "../lib/firebase";
import axios from "axios";
import auth from '../lib/auth'
import Avatar from '@material-ui/core/Avatar';
import BackupIcon from "@material-ui/icons/Backup";

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
  avatar: {
    // [theme.breakpoints.up('sm')]: {
    //   width: theme.spacing(38),
    //   height: theme.spacing(38),
    // },
    width: theme.spacing(30),
    height: theme.spacing(30),
    margin: '0 auto',
    '&:hover': {
      cursor: 'pointer',
      filter: 'grayscale(50%)'
    },
    // boxShadow: '1px 1px 2px 2px grey'
  },
}));

export default function CompanyAddCoach({info}) {
  const classes = useStyles();

  console.log(info)

  const { userId, imageURL } = info;
  const [image, setImage] = React.useState(null);
  const [url, setUrl] = React.useState("");
  const [dataChange, setDataChange] = useState(false);
  const [avatarImage, setAvatarImage] = useState()
  const [name, setName] = React.useState(info.name);
  const [email, setEmail] = React.useState(info.email);
  const [phone, setPhone] = React.useState(info.main_contact_number);
  const [level, setLevel] = React.useState();
  const [documents, setDocuments] = React.useState();
  const [verified, setVerified] = React.useState(info.verified);
  const [imageUpload, setImageUpload] = useState(false)


  const dbsInput = useRef();
  const coachingInput = useRef();
  const imageInput = useRef();

  const [state, setState] = React.useState({
    checked: false,
    details: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(imageURL)
    axios
      .patch(
        `/companies/addSelfCoach`,
        { userId,
          updates: {
          'coachInfo.imageURL': avatarImage,
          'coachInfo.name': name,
          'coachInfo.email': email,
          main_contact_number: phone,
          'coachInfo.coaching_level': level,
          'coachInfo.documents': documents
        }
        },
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      )
      .then((res) => {
        console.log(res.data);
        // history.push("/testercoach");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleDocumentUpload = (e) => {
    console.log("hellooo", e.target.name);
    const image = e.target.files;
    const document = new FormData();

    document.append("owner", auth.getUserId());
    document.append("document", image[0], image[0].name);

    console.log(document);

    axios
      .patch(`/coaches/${userId}/document/${e.target.name}`, document, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data);
        setDocuments(res.data.documents)
        // setDataChange(false);
      })
      .catch((err) => {
        console.error(err);
        // setDataChange(false);
      });
  };

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleMediaChange = (e) => {
    setImageUpload(true)
    const image = e.target.files
    const picture = new FormData()
    picture.append('owner', auth.getUserId())
    picture.append('picture', image[0], image[0].name)

    axios.post(`/coaches/image/${userId}`, picture, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res.data)
        setImageUpload(false)
        setAvatarImage(res.data.message)
      })
      .catch(err => console.error(err))
  }

  

  return (
    <Container className={classes.container}>
      <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h4"> EDIT COACHES </Typography>

        <input
          ref={imageInput}
          style={{ display: "none" }}
          onChange={(e) => handleMediaChange(e)}
          type="file"
        />

        <Avatar
            onClick={(e) => imageInput.current.click()}
            className={classes.avatar} src={avatarImage}
          />

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
          name="coachingCertificate"
          ref={coachingInput}
          style={{ display: "none" }}
          onChange={(e) => handleDocumentUpload(e)}
          type="file"
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => coachingInput.current.click()}
        >
          <BackupIcon />
          UPLOAD COACHING CERTIFICATE
        </Button>

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
          name="dbsCertificate"
          ref={dbsInput}
          style={{ display: "none" }}
          onChange={(e) => handleDocumentUpload(e)}
          type="file"
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => dbsInput.current.click()}
        >
          <BackupIcon />
          UPLOAD DBS CERTIFICATE
        </Button>

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
            pathname: "/companyDashboard/coachDetails",
            state: location.state,
          }}
        > */}
          {/* <Button className={classes.button} variant="outlined" color="primary">
            Back
          </Button>
        </Link> */}
      </form>
    </Container>
  );
}
