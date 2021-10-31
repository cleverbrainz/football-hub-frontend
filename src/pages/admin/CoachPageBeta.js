import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';
import PersonAddSharpIcon from '@material-ui/icons/PersonAddSharp';
import {
  Typography,
  OutlinedInput,
  Button,
  Box,
  Tab,
  Tabs,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  AppBar
} from "@material-ui/core";
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from '../../Dashboards/dashboardComponents/DeleteComponent'
import CoachPageBetaTable from '../../components/CoachPageBetaTable'
import { withRouter } from 'react-router-dom';
import CompanyAddCoach from '../CompanyAddCoach';
import CoachSearch from './CoachSearch';
import Profile from '../Profile';
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import BackupIcon from "@material-ui/icons/Backup";
import CheckIcon from '@material-ui/icons/Check';
import CrossIcon from '@material-ui/icons/Clear'
import { ReactComponent as InviteIcon } from '../../assets/img/invite_sent.svg';

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
  },
  circle: {
    width: '80px',
    height: '80px',
    backgroundColor: 'transparent',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderColor: '#00000',
    borderWidth: '2px',
    margin: 'auto' 
  },
  stepContainer: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100px'
  },
  spacing: {
    margin: '20px 0',
    minWidth: '300px'
  },
  stepNext: {
    backgroundColor: '#02a7f0',
    color: 'white',
    '&:hover': {
      backgroundColor: '#02a7f0'
    },
    position: "relative",
    minWidth: '170px',
    minHeight: '40px'
  },
  stepBack: {
    backgroundColor: 'transparent',
    border: 'solid',
    borderColor: '#02a7f0',
    borderWidth: '2px',
    position: "relative",
    minWidth: '170px',
    minHeight: '40px'
  },
  backup: {
    width: '80px',
    height: '80px',
    margin: 'auto 0',
    color: 'grey',
    '&:hover': {
      cursor: 'pointer',
      filter: 'grayscale(50%)'
    },
  },
  verify: {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    textAlign: 'center'
  },
  buttonContainer: {
    display: 'flex',
    marginTop: '50px',
    marginBottom: '20px',
    justifyContent: 'center',
    alignItems: 'center'
  }, 
}));


function getSteps() {
  return ['', '', ''];
}

function CoachPageBeta({ componentTabValue, handleComponentChange, history }) {
  const classes = useStyles();
  const [value, setValue] = useState(componentTabValue);
  const [coaches, setCoaches] = useState([])
  const [user, setUser] = useState({})
  const [alreadyCoach, setAlreadyCoach] = useState(false)
  const [coachEditPending, setCoachEditPending] = useState(false)
  const [newCoachDetail, setNewCoachDetail] = useState('')
  const [externalCoachDetail, setExternalCoachDetail] = useState()
  const [open, setOpen] = useState(false)
  const [CoachEditOpen, setCoachEditOpen] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)
  const [coachIdToBeDeleted, setCoachIdToBeDeleted] = useState()
  const [newExternalCoachDetails, setNewExternalCoachDetails] = useState({
    fullName: '',
    email: ''
  })
  const [message, setMessage] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isEmptyCoaches, setIsEmptyCoaches] = useState(true)
  const [coachInfo, setCoachInfo] = useState({})
  const [coachTpye, setCoachType] = useState('')
  const [activeStep, setActiveStep] = useState(0)
  const steps = getSteps()
  const [dataChange, setDataChange] = useState({
    coachingCertificate: false,
    dbsCertificate: false,
  })
  const [isDBSCerticate, setIsDBSCertificate] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newCoach, setNewCoach] = useState(false)
  const [sentInvite, setSentInvite] = useState(false)


  const dbsInput = useRef();
  const coachingInput = useRef();
  

  async function getData() {
    let coachArray = []
    let user
    const response = await axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    const data = await response.data[0]
    user = data
    for (const request of data.coaches) {
      let coach
      if (typeof request === 'string') {
        const response = await axios.get(`/users/${request}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
        coach = await response.data[0]
      } else {
        coach = request
      }
      if (coach.userId === auth.getUserId()) setAlreadyCoach(true)
      coachArray.push(coach)
    }
    if (coachArray.length !== 0) {
      setIsEmptyCoaches(false)
    } 
    setUser(user)
    setCoaches(coachArray)
    setIsLoading(false)
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
      }, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        // console.log(res)
        setMessage('Email Sent!')
        setNewExternalCoachDetails({ email: '', fullName: '' })
      })
  }

  const handleChange = (event, newValue, pending=coachEditPending) => {
    if (!pending) {
      setCoachEditOpen(false)
      setValue(newValue);
      setCoachEditPending(false)
      setDeleteInProgress(false)
    } else {
      setCoachEditOpen(true)
    }
  };

  const InternalCoachForm = (
    // <FormPropsTextFields classes={classes} />

    <CompanyAddCoach changePage={handleChange} refreshState={setDeleteInProgress} info={user} setInfo={setUser} />
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

  const handleStepNext = () => {    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleStepBack = () => {    
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleDocumentUpload = (e) => {

    const type = e.target.name
    setDataChange({ ...dataChange, [type]: true })
    const image = e.target.files; 
    const document = new FormData();

    document.append("owner", auth.getUserId());
    document.append("document", image[0], image[0].name);

    axios
      .patch(`/coaches/${auth.getUserId()}/document/${type}`, document, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        const updatedUser = res.data.data ? res.data.data : res.data
        const resInfo = res.data.coachInfo ? res.data.coachInfo : res.data.data.coachInfo
        setUser({ ...user, coachInfo:  updatedUser.coachInfo})
        if (type === 'coachingCertificate') {
          setCoachInfo({ ...coachInfo, [type]: resInfo.coachingCertificate})
        } else {
          setCoachInfo({ ...coachInfo, [type]: resInfo.dbsCertificate})
        }
        setDataChange({ ...dataChange, [type]: false })
      })
      .catch((err) => {
        console.error(err);
        setDataChange({ ...dataChange, [type]: false })
      });
  };

  const handleAddCoach = () => {
    let userId = auth.getUserId()
    axios
      .patch(
        `/companies/addSelfCoach`,
        {
          userId,
          updates: { ...user, coachInfo: { ...coachInfo, name: coachInfo.name ? coachInfo.name : user.name } },
          type: 'coachInfo'
        },
        { headers: { Authorization: `Bearer ${auth.getToken()}` } }
      )
      .then((res) => {      
        setDialogOpen(true)
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    handleComponentChange('Summary', 0)
  }

  const handleAddAnother = () => {
    setDialogOpen(false)
    setCoachType('other')
    setSentInvite(false)
  }

  const firstStep = (
    <>
      <FormControl variant="outlined" className={classes.spacing}>
        <InputLabel htmlFor="component-outlined"> Your Email </InputLabel>
        <OutlinedInput
          label="Your Email"
          value={user.email}
          disabled
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </FormControl>

      <FormControl variant="outlined" className={classes.spacing}>
        <InputLabel htmlFor="component-outlined"> Your Phone Number </InputLabel>
        <OutlinedInput
          label="Your Phone Number"
          value={user.main_contact_number ? user.main_contact_number : ''}
          onChange={(e) =>
            setUser({ ...user, main_contact_number: e.target.value })
          }
        />
      </FormControl>

      <Button
        className={classes.stepNext}
        onClick={() => handleStepNext()}>
          Next
      </Button>
    </>
  )
  
  const secondStep = (
    <>
      <Typography variant='h6' style={{fontWeight: 'bold', marginBottom: '40px'}}> What level badge are you? </Typography>

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

      <Typography variant='h6' style={{fontWeight: 'bold', marginBottom: '20px', marginTop: '30px'}}> Upload Your Badge Certificate </Typography>

      <input
        name="coachingCertificate"
        ref={coachingInput}
        style={{ display: "none" }}
        onChange={(e) => handleDocumentUpload(e)}
        type="file"
      />
      <div style={{textAlign: 'center'}}>
        <BackupIcon className={classes.backup}
          onClick={(e) => coachingInput.current.click()}
        />
      </div>
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
          { user.verification.coachDocumentationCheck && <div className={classes.verify}><CheckIcon /><p>Verified</p></div>}
        </div>
      ) : (
        <p>no document uploaded</p>
      )}

      <div className={classes.buttonContainer}>
        <Button 
          className={classes.stepBack}   
          style={{marginRight: '5px'}}      
          onClick={() => handleStepBack()}
        >
          Back
        </Button>
        <Button
          className={classes.stepNext}
          style={{marginLeft: '5px'}}
          onClick={() => handleStepNext()}>
            Next
        </Button>
      </div>
    </>
  )

  const thirdStep = (
    <div style={{padding: '20px'}}>
      <Typography variant='h6' style={{fontWeight: 'bold', marginBottom: '20px'}}> Do you have a current DBS certificate? </Typography>
      <div style={{marginTop: '50px', textAlign: 'center'}}>
        <Button className={classes.circle}
          onClick={() => setIsDBSCertificate(true)}>
          Yes
        </Button>
        <Button className={classes.circle}
          style={{marginLeft: '100px'}}
          onClick={() => setIsDBSCertificate(false)}>
          No
        </Button>
      </div>

      {isDBSCerticate && <div>
        <Typography variant='h6' style={{fontWeight: 'bold', marginBottom: '20px', marginTop: '30px'}}> Upload Your DBS Certificate </Typography>
        <input
          name="dbsCertificate"
          ref={dbsInput}
          style={{ display: "none" }}
          onChange={(e) => handleDocumentUpload(e)}
          type="file"
        />
        <div style={{textAlign: 'center'}}>
          <BackupIcon className={classes.backup}
            onClick={(e) => dbsInput.current.click()}
          />
        </div>
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
            { user.verification.coachDocumentationCheck && <div className={classes.verify}><CheckIcon /><p>Verified</p></div>}
          </div>
        ) : (
          <p>no document uploaded</p>
        )}
      </div>}

      {(!isDBSCerticate && isDBSCerticate !== null) && <div style={{textAlign: 'center', marginTop: '50px'}}><Typography style={{}}> Unfortunately we cannot add you as a coach if you don’t have an up to date DBS certificate </Typography></div>}

      <div className={classes.buttonContainer}>
        <Button 
          className={classes.stepBack}   
          style={{marginRight: '5px'}}      
          onClick={() => isDBSCerticate === null ? handleStepBack() : handleAddCoach()}
        >
          {isDBSCerticate !== null ? "Finish" : "Back"}
        </Button>
      </div>
    </div>
  )

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return firstStep;
      case 1:
        return secondStep;
      case 2:
        return thirdStep;
      default:
        return 'Unknown stepIndex';
    }
  }

  return (
    <div className={classes.root}>
      {isLoading && <div>
        <CircularProgress style= {{position: 'absolute', left: 'calc(50% - 50px)', top: 'calc(50% - 50px)', width: '100px', height: '100px', margin: 'auto'}}/>
      </div>}

      {(!isLoading && isEmptyCoaches) && <div>
        {coachTpye === '' && <div style={{textAlign: 'center', marginTop: '100px'}}>
          <Typography variant='h6' style={{fontWeight: 'bold', marginBottom: '20px'}}> Do you want to add yourself as a coach? </Typography>
          <Typography> Answer "Yes" if you will be running any of the courses </Typography>
          <div style={{marginTop: '80px'}}>
            <Button className={classes.circle}
              onClick={() => setCoachType('self')}>
              Yes
            </Button>
            <Button className={classes.circle}
              style={{marginLeft: '100px'}}
              onClick={() => setCoachType('other')}>
              No
            </Button>
          </div>
        </div>}
        {coachTpye === 'self' && <div className={classes.stepContainer}>
        <>
          {getStepContent(activeStep)}         
        </>
        <Stepper style={{ width: '100%', backgroundColor: 'transparent' }} activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        </div>}
        {(coachTpye === 'other' && !sentInvite) && <div className={classes.stepContainer} style={{padding: '20px', textAlign: 'center'}}>
          <Typography variant='h6' style={{fontWeight: 'bold', marginBottom: '50px'}}>Let's see if the coach is already on ftballer</Typography>
          <CoachSearch setNewCoach={setNewCoach} setSentInvite={setSentInvite}/>

          {/* <div>
            <Button style={{backgroundColor: '#02a7f0', maxWidth: '370px', marginTop: '50px', marginBottom: '20px', color: 'white'}}
              onClick={() => setNewCoach(true)}>
              Invite a new not registered coach
            </Button>
          </div> */}

          {newCoach && <div style={{display: 'grid', justifyContent: 'center', marginTop: '50px'}}>
            
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
              >
                {message ? message : 'Send Registration Prompt'}
              </Button>            
          </div>}
        </div>}

        {(coachTpye === 'other' && sentInvite) && <div className={classes.stepContainer} style={{padding: '20px', textAlign: 'center'}}>
          <Typography variant='h6' style={{fontWeight: 'bold', marginBottom: '50px'}}>Let's see if the coach is already on ftballer</Typography>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px'}}>
            <InviteIcon/>
            <Typography variant='h6' style={{fontWeight: 'bold', marginLeft: '30px'}}>INVITE SENT</Typography>
          </div>
          <Button 
            style={{backgroundColor: '#02a7f0', color: 'white', marginTop: '70px'}}
            onClick={() => setDialogOpen(true)}>Finish</Button>
        </div>}
      </div>}
      
      
      {(!isLoading && !isEmptyCoaches) && <div>
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
            {alreadyCoach && <Tab label="Edit Details" icon={<PersonAddSharpIcon />} {...a11yProps(2)} />}
            {alreadyCoach && <Tab label="Coach Profile" icon={<PersonAddSharpIcon />} {...a11yProps(3)} />}
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
          <CompanyAddCoach 
            changePage={handleChange} 
            handleComponentChange={handleComponentChange} 
            refreshState={setDeleteInProgress} 
            setPending={setCoachEditPending} 
            pending={coachEditPending} 
            info={user}
            modal={CoachEditOpen}
            setModal={setCoachEditOpen} />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <Profile info={user} handleChange={handleChange}/>
        </TabPanel>

        <DeleteComponent
          open={open}
          handleDelete={e => handleDelete(e)}
          handleClose={e => handleClose(e)}
          name='coach' />
      </div>}

      <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="add-location-dialog-title">
            {"Do you want to add another coach?"}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleAddAnother}>Yes</Button>
            <Button onClick={handleDialogClose}>No</Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}



export default withRouter(CoachPageBeta)