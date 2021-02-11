import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormPropsTextFields from '../admin/AddCoaches'
import {
  Typography,
  Card,
  CardContent,
  OutlinedInput,
  Button
} from "@material-ui/core";
import CancelSharpIcon from "@material-ui/icons/CancelSharp";
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from './DeleteComponent'
import CoachEdit from '../CoachEdit'
import CoachPageBetaTable from '../../components/CoachPageBetaTable'
import { withRouter } from 'react-router-dom';
import CompanyAddCoach from '../CompanyAddCoach';
import CoachSearch from './CoachSearch';
import Profile from '../Profile';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
  },
  AppBar: {
    // backgroundColor: 'white',
  },
  card: {
    height: "100px",
    width: "200px",
    margin: '20px',
    position: 'relative'
  },
  icons: {
    zIndex: 5,
    position: "absolute",
    color: "#EF5B5B",
    top: "-2%",
    right: "-2%",
    "&:hover": {
      cursor: "pointer",
    },
  },
  formContainer: {

  },
  form: {
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  select: {
    width: `${(window.innerWidth - 100) / 3}px`,
    marginBottom: '30px'
  },
  inputs: {
    margin: '5px 0',
    width: `${(window.innerWidth - 100) / 3}px`
  }
}));




function CoachPageBeta({ componentTabValue, handleComponentChange }) {
  const classes = useStyles();
  const [value, setValue] = useState(componentTabValue);
  const [coaches, setCoaches] = useState([])
  const [user, setUser] = useState({})
  const [alreadyCoach, setAlreadyCoach] = useState(false)

  const [companyCoaches, setCompanyCoaches] = useState()
  const [allAppCoaches, setAllAppCoaches] = useState()

  const [newCoachDetail, setNewCoachDetail] = useState('')
  const [externalCoachDetail, setExternalCoachDetail] = useState()
  const [open, setOpen] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)
  const [coachIdToBeDeleted, setCoachIdToBeDeleted] = useState()
  const [existingAppCoachToBeAdded, setExistingAppCoachToBeAdded] = useState()
  const [newExternalCoachDetails, setNewExternalCoachDetails] = useState({
    fullName: '',
    email: ''
  })
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState('')


  async function getData() {
    let coachArray = []
    let user
    const response = await axios.get(`/users/${auth.getUserId()}`)
    const data = await response.data[0]
    user = data
    console.log(data)
    for (const request of data.coaches) {
      let coach
      if (typeof request === 'string') {
        const response = await axios.get(`/users/${request}`)
        coach = await response.data[0]
        console.log('data', data)
      } else {
        coach = request
      }
      if (coach.userId === auth.getUserId()) setAlreadyCoach(true)
      coachArray.push(coach)
    }
    setUser(user)
    setCoaches(coachArray)
  }

  // useEffect(() => {
  //   axios
  //     .get(`/users/${auth.getUserId()}`)
  //     .then(res => {
  //       console.log(res.data);
  //       setCoaches(res.data[0].coaches);
  //     })
  //     .catch(e => console.log(e))
  // }, [!deleteInProgress]);

  useEffect(() => {
    getData()
  }, [!deleteInProgress])

  const handleSetCoachId = coachId => {
    setOpen(true)
    setCoachIdToBeDeleted(coachId)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const isValidEmail = string => {
    const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegEx.test(string)
  }

  const handleDelete = () => {
    setDeleteInProgress(true);
    console.log(coachIdToBeDeleted);
    // axios
    //   .delete(`/companies/coaches/${deleteCoachId}`, {
    //     headers: { Authorization: `Bearer ${auth.getToken()}` },
    //   })
    //   .then((res) => {
    //     console.log(res.data);
    //     setDeleteInProgress(false);
    //     handleClose();
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     setDeleteInProgress(false);
    //     handleClose();
    //   });
  };

  const sendEmailRequest = (event) => {
    const { email, fullName } = newExternalCoachDetails
    const { name, userId } = user
    event.preventDefault()

    if (!isValidEmail(email)) {
      setEmailError('Email address provided is not valid. Please try again.')
      return
    }

    axios.post(`/emailRequestCoach`,
      {
        email,
        name: fullName,
        companyName: name,
        companyId: userId,
        type: window.location.hostname
      })
      .then(res => {
        console.log(res)
        setMessage('Email Sent!')
        setNewExternalCoachDetails({ email: '', fullName: '' })
      })
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setDeleteInProgress(false)
  };

  const InternalCoachForm = (
    // <FormPropsTextFields classes={classes} />

    <CompanyAddCoach changePage={handleChange} refreshState={setDeleteInProgress} info={user} />
  )

  const Already = (
    <>
      <h2>Already Registered. Click below to edit details</h2>
      <Link to={{
        pathname: '/testercoach/edit',
        state: user
      }}>

        <Button
          // className={classes.button}
          variant="contained" color="primary">
          Edit Details
  </Button>
      </Link>
    </>
    // <CoachEdit location={{ state: user }}/>
  )

  const ExternalCoachForm = (
    <CoachSearch />
  )


  return (
    <div className={classes.root}>

      <AppBar position="static" color="default">
        <Tabs
          className={classes.AppBar}
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab label="Current Coaches" icon={<PeopleAltSharpIcon />} {...a11yProps(0)} />
          <Tab label="Add New Coach" icon={<PersonAddSharpIcon />} {...a11yProps(1)} />
          <Tab label="Edit Details" icon={<PersonAddSharpIcon />} {...a11yProps(2)} />
          <Tab label="Coach Profile" icon={<PersonAddSharpIcon />} {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        {coaches && <CoachPageBetaTable
          handleSetCoachId={(coachId) => handleSetCoachId(coachId)}
          handleChange={handleChange}
          coaches={coaches} />}
      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        <form className={classes.form} action="">

          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Who are you adding?</InputLabel>
            <Select
              className={classes.select}
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              label='Who are you adding?'
              value={newCoachDetail}
              onChange={e => setNewCoachDetail(e.target.value)}
            >

              <MenuItem value='myself'>Myself as a coach </MenuItem>
              <MenuItem value='someone'>Someone else as a coach</MenuItem>

            </Select>
          </FormControl>

          {newCoachDetail === 'someone' && (
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label"> External or New? </InputLabel>
              <Select
                className={classes.select}
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                label='External or New?'
                value={externalCoachDetail}
                onChange={e => setExternalCoachDetail(e.target.value)}
              >

                <MenuItem value='existing'> Existing coach on system </MenuItem>
                <MenuItem value='new'> New coach (not yet registered) </MenuItem>

              </Select>
            </FormControl>
          )}

          {newCoachDetail ? newCoachDetail === 'myself' ? alreadyCoach ? Already : InternalCoachForm : (
            externalCoachDetail ? externalCoachDetail === 'existing' ? (
              // <FormControl variant="outlined" className={classes.formControl}>
              //   <InputLabel id="demo-simple-select-outlined-label"> Select Existing Coach </InputLabel>
              //   <Select
              //     className={classes.select}
              //     labelId="demo-simple-select-filled-label"
              //     id="demo-simple-select-filled"
              //     label='Select Existing Coach'
              //     value={existingAppCoachToBeAdded}
              //     onChange={e => setExistingAppCoachToBeAdded(e.target.value)}
              //   >

              //     {coaches.map((el, i) => <MenuItem value={el.coachInfo.coach_name}> {el.coachInfo.coach_name} - {el.coachInfo.coach_email} </MenuItem>)}

              //   </Select>
              // </FormControl>
              ExternalCoachForm
            ) : (
                <>
                  <FormControl className={classes.inputs} variant="outlined"
                  >
                    <InputLabel htmlFor="component-outlined"> Full Name </InputLabel>
                    <OutlinedInput
                      label="Full Name"
                      value={newExternalCoachDetails.fullName}
                      onChange={e => setNewExternalCoachDetails({ ...newExternalCoachDetails, fullName: e.target.value })}
                    />
                  </FormControl>

                  <FormControl className={classes.inputs} variant="outlined"
                  >
                    <InputLabel htmlFor="component-outlined"> Email Address </InputLabel>
                    <OutlinedInput
                      error={emailError}
                      label="Email Address"
                      value={newExternalCoachDetails.email}
                      onChange={e => setNewExternalCoachDetails({ ...newExternalCoachDetails, email: e.target.value })}
                    />
                  </FormControl>

                  {emailError && <p style={{ color: 'red', textAlign: 'center' }}> {emailError} </p>}

                  <Button
                    variant="contained"
                    color={message ? "primary" : 'secondary'}
                    className={classes.inputs}
                    onClick={(event) => sendEmailRequest(event)}
                  // onClick={() => input.current.click()}
                  >
                    {message ? message : 'Send Registration Prompt'}
                  </Button>
                </>
              ) : null

          ) : null}


        </form>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <CompanyAddCoach changePage={handleChange} handleComponentChange={handleComponentChange} refreshState={setDeleteInProgress} info={user} />
      </TabPanel>

      <TabPanel value={value} index={3}>
        <Profile info={user} handleChange={handleChange}/>
      </TabPanel>

      <DeleteComponent
        open={open}
        handleDelete={e => handleDelete(e)}
        handleClose={e => handleClose(e)}
        name='coach' />
    </div>
  );
}



export default withRouter(CoachPageBeta)