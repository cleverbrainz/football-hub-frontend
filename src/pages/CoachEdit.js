import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
} from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import { storage } from '../lib/firebase'
import axios from 'axios'
import auth from '../lib/auth'
import Avatar from '@material-ui/core/Avatar'
import BackupIcon from '@material-ui/icons/Backup'

const useStyles = makeStyles((theme) => ({
  spacing: {
    margin: '10px 0',
    textAlign: 'center',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  container: {
    margin: '100px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: `${window.innerHeight - 100}px`,
    textAlign: 'center',
  },
  form: {
    width: '30%',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    height: '55%',
    justifyContent: 'space-around',
  },
  button: {
    position: 'relative',
    margin: '10px 0',
  },
  upload: {
    margin: '20px auto',
  },
  center: {
    margin: '0 auto',
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
      filter: 'grayscale(50%)',
    },
    // boxShadow: '1px 1px 2px 2px grey'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: 'green',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

export default function CoachEdit({ history }) {
  const classes = useStyles()

  // console.log(location.state)

  const userId = auth.getUserId()
  const [user, setUser] = useState(null)
  // const [image, setImage] = React.useState(null);
  // const [url, setUrl] = React.useState("");
  const [dataChange, setDataChange] = useState({
    coachingCertificate: false,
    dbsCertificate: false,
  })
  // const [avatarImage, setAvatarImage] = useState(location.state.imageURL)
  // const [name, setName] = React.useState(location.state.coachInfo.name);
  // const [email, setEmail] = React.useState(location.state.email);
  // const [phone, setPhone] = React.useState(location.state.main_contact_number);
  // const [level, setLevel] = React.useState(location.state.coachInfo.coaching_level);
  // const [coachInfo, setCoachInfo] = React.useState(location.state.coachInfo);
  // const [verified, setVerified] = React.useState(location.state.verified);
  const [imageUpload, setImageUpload] = useState(false)

  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then((res) => {
      setUser(res.data[0])
      })
      .catch(err => console.log(err))
  }, [])

  const dbsInput = useRef()
  const coachingInput = useRef()
  const imageInput = useRef()

  const [state, setState] = React.useState({
    checked: false,
    details: null,
  })

  const handleSubmit = (e) => {
    const updates = user
    e.preventDefault()
    axios
      .patch(
        `/users/${userId}`,
        { userId, updates: updates },
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      )
      .then((res) => {
        user.category === 'company'
          ? history.push('/tester')
          : history.push('/testercoach')
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  const handleDocumentUpload = (e) => {
    const type = e.target.name
    setDataChange({ ...dataChange, [type]: true })
    const image = e.target.files
    const document = new FormData()

    document.append('owner', auth.getUserId())
    document.append('document', image[0], image[0].name)

    axios
      .patch(`/coaches/${userId}/document/${type}`, document, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        const coach = res.data.coachInfo ? res.data.coachInfo : res.data.data.coachInfo
        setUser({ ...user, coachInfo: coach })
        // setCoachInfo(res.data.coachInfo)
        setDataChange({ ...dataChange, [type]: false })
      })
      .catch((err) => {
        console.error(err)
        setDataChange({ ...dataChange, [type]: false })
        // setDataChange(false)
      })
  }

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  const handleMediaChange = (e) => {
    setImageUpload(true)
    const image = e.target.files
    const picture = new FormData()
    picture.append('owner', auth.getUserId())
    picture.append('picture', image[0], image[0].name)

    axios
      .post(`/coaches/image/${userId}`, picture, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        setImageUpload(false)
        setUser({ ...user, imageURL: res.data.message })
        // setAvatarImage(res.data.message)
      })
      .catch((err) => console.error(err))
  }

  if (!user) return null
  return (
    <Container className={classes.container}>
      <form className={classes.form} autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h4"> EDIT COACH INFO </Typography>

        <input
          ref={imageInput}
          style={{ display: 'none' }}
          onChange={(e) => handleMediaChange(e)}
          type="file"
        />

        <Avatar
          onClick={(e) => imageInput.current.click()}
          className={classes.avatar}
          src={user.imageURL}
        />

        <FormControl variant="outlined" className={classes.spacing}>
          <InputLabel htmlFor="component-outlined"> Coach name </InputLabel>
          <OutlinedInput
            label="Coach name"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
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

        <FormControl variant="outlined">
          <InputLabel htmlFor="component-outlined" id="level">
            Coach Badges
          </InputLabel>
          <Select
            label="Coach Badges"
            id="select-level"
            value={user.coachInfo.coaching_level}
            onChange={(e) =>
              setUser({
                ...user,
                coachInfo: { ...user.coachInfo, coaching_level: e.target.value },
              })
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
          style={{ display: 'none' }}
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
        {user.coachInfo.coachingCertificate ? (
          <div className={classes.wrapper}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user.coachInfo.coachingCertificate}
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
          style={{ display: 'none' }}
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
        {user.coachInfo.dbsCertificate ? (
          <div className={classes.wrapper}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={user.coachInfo.dbsCertificate}
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

        <Link
          to={{
            pathname: user.category === 'coach' ? '/testercoach' : '/tester'
          }}
        >
          <Button className={classes.button} variant="outlined" color="primary">
            Back
          </Button>
        </Link>
      </form>
    </Container>
  )
}
