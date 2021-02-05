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
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: "10px 0",
    textAlign: "center",
  },
  formControl: {
    margin: theme.spacing(1),

  },
  subContainer: {
    width: "100%",
    [theme.breakpoints.up('sm')]: {
      width: "30%",
    },
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    width: "100%",
    display: "flex",
    height: "55%",
    justifyContent: "space-between",
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row'
    },
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

    width: theme.spacing(30),
    height: theme.spacing(30),
    margin: '0 auto',
    '&:hover': {
      cursor: 'pointer',
      filter: 'grayscale(50%)'
    },
  },
}));

export default function CompanyAddCoach({ info, changePage, refreshState }) {
  const classes = useStyles();

  console.log(info)

  const { userId, imageURL } = info;

  const [user, setUser] = useState(info)




  const [image, setImage] = React.useState(null);
  const [url, setUrl] = React.useState("");
  // const [dataChange, setDataChange] = useState(false);
  const [avatarImage, setAvatarImage] = useState()
  const [name, setName] = React.useState(info.name);
  const [email, setEmail] = React.useState(info.email);
  const [phone, setPhone] = React.useState(info.main_contact_number);
  const [level, setLevel] = React.useState();
  const [coachInfo, setCoachInfo] = React.useState(info.coachInfo);
  const [verified, setVerified] = React.useState(info.verified);
  const [existing, setExisting] = React.useState(info.companies ? true : false)
  const [imageUpload, setImageUpload] = useState(false)
  const [dataChange, setDataChange] = useState({
    coachingCertificate: false,
    dbsCertificate: false,
  })


  const dbsInput = useRef();
  const coachingInput = useRef();
  const imageInput = useRef();

  const [state, setState] = React.useState({
    checked: false,
    details: null,
  });

  const handleSubmit = (e) => {
    console.log(e)
    refreshState(true);
    // setDataChange({ ...dataChange, [e.target.name]: true })
    e.preventDefault();
    console.log(imageURL)
    const path = existing ? `/users/${userId}` : `/companies/addSelfCoach`
    axios
      .patch(
        path,
        {
          userId,
          updates: { ...user, coachInfo: { ...coachInfo } },
          type: 'coachInfo'
        },
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      )
      .then((res) => {
        console.log(res.data);
        // setDataChange({ ...dataChange, [e.target.name]: false })
        
        changePage(e, 0)
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleDocumentUpload = (e) => {
    const type = e.target.name
    setDataChange({ ...dataChange, [type]: true })
    console.log("type", type);
    const image = e.target.files; 
    const document = new FormData();

    document.append("owner", auth.getUserId());
    document.append("document", image[0], image[0].name);

    console.log(document);

    axios
      .patch(`/coaches/${userId}/document/${type}`, document, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data)
        const resInfo = res.data.coachInfo ? res.data.coachInfo : res.data.data.coachInfo 
        console.log(resInfo);
        setCoachInfo({ ...coachInfo, ...resInfo })
        setDataChange({ ...dataChange, [type]: false })
        // setDataChange(false);
      })
      .catch((err) => {
        console.error(err);
        setDataChange({ ...dataChange, [type]: false })
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


  // if (!coachInfo) return null
  return (
    <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>

      <input
        ref={imageInput}
        style={{ display: "none" }}
        onChange={(e) => handleMediaChange(e)}
        type="file"
      />

      <div className={classes.subContainer}>
        <Avatar
          onClick={(e) => imageInput.current.click()}
          className={classes.avatar} src={avatarImage}
        />

      </div>


      <div className={classes.subContainer}>

        {/* <FormControl variant="outlined" className={classes.spacing}>
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
        </FormControl> */}


<FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Coach name </InputLabel>
          <OutlinedInput
            label="Coach name"
            value={coachInfo?.name ? coachInfo.name: user.name}
            onChange={(e) => setCoachInfo({ ...coachInfo, name: e.target.value })}
          ></OutlinedInput>
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Coach email </InputLabel>
          <OutlinedInput
            label="Coach email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </FormControl>

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined">
            {' '}
            Coach phone number{' '}
          </InputLabel>
          <OutlinedInput
            label="Coach phone number"
            value={user.main_contact_number}
            onChange={(e) =>
              setUser({ ...user, main_contact_number: e.target.value })
            }
          />
        </FormControl>


      </div>


      <div className={classes.subContainer}>
      <FormControl variant="outlined">
          <InputLabel htmlFor="component-outlined" id="level">
            Coach Badges
          </InputLabel>
          <Select
            label="Coach Badges"
            id="select-level"
            value={coachInfo?.coaching_level ? coachInfo.coaching_level : ''}
            onChange={(e) =>
              setCoachInfo({ ...coachInfo, coaching_level: e.target.value })
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'FA Level 1'}>FA Level 1</MenuItem>
            <MenuItem value={'FA Level 2'}>FA Level 2</MenuItem>
            <MenuItem value={'FA Level 3 (UEFA B)'}>
              FA Level 3 (UEFA B)
            </MenuItem>
            <MenuItem value={'FA Level 4 (UEFA A)'}>
              FA Level 4 (UEFA A)
            </MenuItem>
            <MenuItem value={'FA Level 5 (UEFA PRO)'}>
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
        {coachInfo && coachInfo.coachingCertificate ? (
          <div className={classes.wrapper}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={coachInfo.coachingCertificate}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={dataChange.coachingCertificate}
              >
                Uploaded Document
              </Button>
            </a>
            {dataChange.coachingCertificate && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        ) : (
          <p>no document uploaded</p>
        )}

        {/* <Typography variant="p"> DBS Check </Typography> */}

        {/* <FormControlLabel
          control={
            <Checkbox
              color="default"
              checked={state.checked}
              onChange={handleChange}
              name="checked"
            />
          }
          label="Yes, this coach has a clean record" */}
        {/* /> */}

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
          {coachInfo && coachInfo.dbsCertificate ? (
          <div className={classes.wrapper}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={coachInfo.dbsCertificate}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={dataChange.dbsCertificate}
              >
                Uploaded Document
              </Button>
            </a>
            {dataChange.dbsCertificate && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        ) : (
          <p>no document uploaded</p>
        )}

        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          Save
        </Button>
      </div>

    </form>
  );
}
