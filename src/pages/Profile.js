import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';
import auth from '../lib/auth'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import EditSharpIcon from '@material-ui/icons/EditSharp';
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  root: {
    height: window.innerHeight - 80,
    [theme.breakpoints.up('sm')]: {
      height: window.innerHeight - 80,
    },
    width: '100%',
    // backgroundColor: 'pink',
    display: 'flex',
    justifyContent: 'center',
    padding: '25px 0',
    position: 'relative'
  },
  progress: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    // transform: 'translate(-50%, -50%)'
  },
  subContainer: {
    width: '95%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      width: '65%',
    },
    // backgroundColor: 'lightblue',
  },
  leftContainer: {
    [theme.breakpoints.up('sm')]: {
      width: '40%',
    },
    height: '100%',
    width: '100%',
    // backgroundColor: 'lightblue',
    padding: '0 15px',
  },
  avatar: {
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(37),
      height: theme.spacing(37),
    },
    width: theme.spacing(30),
    height: theme.spacing(30),
    margin: '0 auto',
    '&:hover': {
      cursor: 'pointer',
      filter: 'grayscale(50%)'
    }
  },
  rightContainer: {
    [theme.breakpoints.up('sm')]: {
      width: '60%',
    },
    height: '100%',
    width: '100%',
    backgroundColor: 'lightgreen',
  },

}));

const Profile = () => {

  const [user, setUser] = useState()
  const input = useRef()
  const [imageUpload, setImageUpload] = useState(false)

  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => setUser(res.data[0]))
  }, [!imageUpload])

  const classes = useStyles();


  const handleMediaChange = (e) => {
    setImageUpload(true)
    const image = e.target.files
    const picture = new FormData()
    picture.append('owner', auth.getUserId())
    picture.append('picture', image[0], image[0].name)

    axios.post('/user/image', picture, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res.data)
        setImageUpload(false)
      })
      .catch(err => console.error(err))
  }

  return (
    <div className={classes.root}>
      <div className={classes.subContainer}>
        <div className={classes.leftContainer}>

        <input ref={input} 
        style={{ display: 'none' }} onChange={(e) => handleMediaChange(e)} type="file" />
        
          <Avatar 
          onClick={(e) => input.current.click()}
          className={classes.avatar} src={user && user.imageURL} 
     
          />




          <Typography style={{ margin: '10px 0', textAlign: 'center' }} component='div' >
            <Box
              fontSize={30} fontWeight="fontWeightBold" m={0}>
              {user && user.fullName}
            </Box>
            <small style={{ fontStyle: 'italic' }}>
              Joined: {user && moment(new Date(user.joined._seconds * 1000 + user.joined._nanoseconds / 1000000)).format('DD-MM-YYYY')}
            </small>
          </Typography>

          <Typography style={{ margin: '10px 0' }} component='div' >
            <Box
              fontSize={16} fontWeight="fontWeightRegular" m={0}>
              <span style={{ fontWeight: 'bold', display: 'block' }}> Player ID </span> {user && user.userId}
            </Box>
          </Typography>

          <Typography style={{ margin: '10px 0' }} component='div' >
            <Box
              fontSize={16} fontWeight="fontWeightRegular" m={0}>
              <span style={{ fontWeight: 'bold', display: 'block' }}> Email </span> {user && user.email}
            </Box>
          </Typography>

          <Typography style={{ margin: '10px 0' }} component='div' >
            <Box
              fontSize={16} fontWeight="fontWeightRegular" m={0}>
              <span style={{ fontWeight: 'bold', display: 'block' }}> DOB </span>
              {user && moment(new Date(user.dob._seconds * 1000 + user.dob._nanoseconds / 1000000)).format('DD-MM-YYYY')}
            </Box>
          </Typography>

        </div>
        <div className={classes.rightContainer}>

        </div>
      </div>

      {imageUpload && <CircularProgress size={100} className={classes.progress} />}
    </div>
  );
};

export default Profile;