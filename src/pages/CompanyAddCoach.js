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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CheckIcon from '@material-ui/icons/Check';
import CrossIcon from '@material-ui/icons/Clear'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
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
    width: "90%",
    display: "flex",
    height: "65%",
    justifyContent: "space-between",
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row'
    },
    marginTop: '30px',
    marginBottom: '10px'
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
  verify: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    textAlign: 'center'
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

export default function CompanyAddCoach({ info, setInfo, handleComponentChange, changePage, refreshState, refreshData, pending, setPending, modal, setModal }) {
  const classes = useStyles();

  // console.log(info)
  
  const { userId, imageURL } = info;

  
  // const [pending, setPending] = useState(false)
  const [updated, setUpdated] = useState({})
  const [user, setUser] = useState(info)
  const [image, setImage] = React.useState(null);
  const [url, setUrl] = React.useState("");
  // const [dataChange, setDataChange] = useState(false);
  const [avatarImage, setAvatarImage] = useState(user.coachInfo?.imageURL ? user.coachInfo.imageURL : '')
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [phone, setPhone] = React.useState(user.main_contact_number);
  const [level, setLevel] = React.useState();
  const [coachInfo, setCoachInfo] = React.useState(user.coachInfo);
  // const [documents, setDocuments] = React.useState(user.documents)
  const [verified, setVerified] = React.useState(user.verified);
  const [existing, setExisting] = React.useState(user.companies && user.companies.length > 0 ? true : false)
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
    // console.log(e)
    // refreshState(true);
    // setDataChange({ ...dataChange, [e.target.name]: true })
    e.preventDefault();
    // console.log(imageURL)
    // console.log({existing})
    const path = existing ? `/users/${userId}` : `/companies/addSelfCoach`
    axios
      .patch(
        path,
        {
          userId,
          updates: { ...user, coachInfo: { ...coachInfo, name: coachInfo.name ? coachInfo.name : name } },
          type: 'coachInfo'
        },
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      )
      .then((res) => {        
        // setDataChange({ ...dataChange, [e.target.name]: false })    
      
        refreshState(true)
        if (info.category === 'company') {
          changePage(e, 0, false)
        } else {
          refreshData().then(() => {
            setPending(false)
            handleComponentChange('Summary', 0, false)
          })
        } 
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const handleDocumentUpload = (e) => {
    const type = e.target.name
    setDataChange({ ...dataChange, [type]: true })
    const image = e.target.files; 
    const document = new FormData();

    document.append("owner", auth.getUserId());
    document.append("document", image[0], image[0].name);
    axios
      .patch(`/coaches/${userId}/document/${type}`, document, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        // console.log(res.data)
        const updatedUser = res.data.data ? res.data.data : res.data
        const resInfo = res.data.coachInfo ? res.data.coachInfo : res.data.data.coachInfo
        const updatedVerification = res.data.verification ? res.data.verification : res.data.data.verification
        // console.log(resInfo);
        setPending(true)
        // setInfo({ ...user, ...updatedVerification })
        setUser({ ...updatedUser })
        setCoachInfo({ ...resInfo })
        // setDocuments({ })
        // refreshState(true)
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
        setImageUpload(false)
        setAvatarImage(res.data.message)
        setCoachInfo({ ...coachInfo, imageURL: res.data.message })
      })
      .catch(err => console.error(err))
  }


  // if (!coachInfo) return null
  return (
    <>
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
            value={coachInfo?.name ? coachInfo.name : user.name}
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
            { user.verification.coachDocumentationCheck ? <div className={classes.verify}><CheckIcon /><p>Verified</p></div> : user.verificationId?.coachInfo || pending ? <div className={classes.verify}><HourglassEmptyIcon /><p>Pending</p></div> : <div className={classes.verify}><CrossIcon /><p>Rejected</p></div> }
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
             { user.verification.dbsDocumentationCheck ? <div className={classes.verify}><CheckIcon /><p>Verified</p></div> : user.verificationId?.coachInfo || pending ? <div className={classes.verify}><HourglassEmptyIcon /><p>Pending</p></div> : <div className={classes.verify}><CrossIcon /><p>Rejected</p></div> }
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
    <Typography style={{ textAlign: 'center' }}>Please add the information and documents for your coaching certificate and DBS status.
    {<br/>} Once you have uploaded these ftballer.com will review and advise if they are accepted or not.</Typography>
    <Dialog
      open={modal}
      handleClose={() => setModal(false)}>

      <DialogTitle className={classes.title}>
        There are unsaved changes
      </DialogTitle>

      <DialogContent className={classes.root}>
        <Typography>You have made changes to your documents, do you want to save and submit them for verification?</Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={(event) => {
          handleSubmit(event)
        }} color="primary">
          Save Documents
        </Button>
      </DialogActions>

    </ Dialog>
    </>
  );
}
