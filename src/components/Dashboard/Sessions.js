import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import AddLocationSharpIcon from '@material-ui/icons/AddLocationSharp';
import {
  Typography,
  Select,
  Container,
  MenuItem,
  Box, 
  Tab, 
  Tabs,
  AppBar,
  FormControl,
  InputLabel
} from "@material-ui/core";
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from '../../Dashboards/dashboardComponents/DeleteComponent'
import SessionsPageTable from '../../components/SessionsPageTable'
import MaterialUIPickers from '../../pages/admin/CampMultiDetails'
import WeeklyCourseDetails from '../../pages/admin/WeeklyCourseDetails'
import CircularProgress from '@material-ui/core/CircularProgress'
import AddNewCourse from '../../pages/admin/AddNewCourse'

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
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    textAlign: "center",
  },
  select: {
    width: `${(window.innerWidth - 100) / 3}px`,
    marginBottom: '30px'
  },
  inputs: {
    margin: '7px 0',
    width: `${(window.innerWidth - 100) / 3}px`
  },
  stepContainer: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    position: "relative",
    margin: "10px 0",
    minWidth: '170px',
    minHeight: '40px'
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    margin: 'auto',
    color: 'black'
  }, 
  circle: {
    display: 'flex',
    width: '70px',
    height: '70px',
    backgroundColor: 'transparent',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderColor: '#00000',
    borderWidth: '2px',
    margin: 'auto' 
  }, 
  excludeButton: {
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: '1px',
    margin: '5px 20px'
  }
}));

export default function Sessions({ componentTabValue }) {
  const date = moment()
  const classes = useStyles();
  const [value, setValue] = useState(componentTabValue);
  const [companyCourses, setCompanyCourses] = useState()
  const [registers, setRegisters] = useState([])
  const [open, setOpen] = useState(false)
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const [courseIdToBeDeleted, setCourseIdToBeDeleted] = useState()
  const [newCourseDetail, setNewCourseDetail] = useState('weekly')
  const [courseToBeEdited, setCourseToBeEdited] = useState()
  const [companyCoachIds, setCompanyCoachIds] = useState([])
  const [companyCoachInfo, setCompanyCoachInfo] = useState([])
  const [thisWeek, setThisWeek] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddNewcourse, setIsAddNewCourse] = useState(false)
  const [isEditCourse, setIsEditCourse] = useState(false)
  const [editCourse, setEditCourse] = useState({})

  async function getData() {
    let activeRegisterArray = []
    let pastRegisterArray = []
    let coachArray = []
    const response = await axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    const data = await response.data[0]    

    if ((data.courses.active.length === 0) && (data.courses.past.length === 0)) {
      setIsAddNewCourse(true)
    }
    // axios.get(`/users/${auth.getUserId()}`)
    //   .then(res => {

    //   })
    //   .catch(err => console.log(err))
    // console.log(data, 'hellooooo')

    // for (const course of data.courses) {
    // let register
    // const response = await axios.get(`/courses/${course.courseId}`)
    // register = await response.data
    // console.log(register.register)
    // // console.log('data', data)
    // if (register.register) registerArray.push([course.courseDetails, course.courseId, register.register.sessions])
    // }

    for (const course of data.courses.active) {
      let register
      const response = await axios.get(`/courses/${course.courseId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      register = await response.data
      // console.log({register})
      if (register.register) activeRegisterArray.push([course.courseDetails, course.courseId, register.register.sessions])
    }

    for (const course of data.courses.past) {
      let register
      const response = await axios.get(`/courses/${course.courseId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      register = await response.data

      if (register.register) pastRegisterArray.push([course.courseDetails, course.courseId, register.register.sessions])
    }

    for (const coach of data.coaches) {
      let coachInfo
      const response = await axios.get(`/users/${coach}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      coachInfo = await response.data[0]
      coachArray.push(coachInfo)
    }
    setCompanyCoachIds(data.coaches)
    setCompanyCoachInfo(coachArray)
    setCompanyCourses(data.courses)
    setRegisters({ active: activeRegisterArray, past: pastRegisterArray })
    setThisWeek(sortRegisters(pastRegisterArray.concat(activeRegisterArray)))
    setIsLoading(false)
  }

  const sortRegisters = (registers) => {
    const monday = date.startOf('week')
    const weekdays = {}
    for (let i = 1; i <= 7; i++) {
      weekdays[(monday.add(1, 'days').format('YYYY-MM-DD'))] = []
    }

    registers.forEach(([courseDetails, id, sessionDates]) => {
      for (const session of sessionDates) {
        if (Object.keys(weekdays).indexOf(session) !== -1) {
          const correctSession = courseDetails.courseType === 'Camp' ?
            courseDetails.sessions.filter(infoSession => moment.unix(infoSession.sessionDate._seconds).format('dddd') === moment(session).format('dddd'))[0]
            :
            courseDetails.sessions.filter(infoSession => infoSession.day === moment(session).format('dddd'))[0]
          weekdays[session].push([courseDetails, id, correctSession])
        }
      }
    })
    return weekdays
  }

  useEffect(() => {
    getData()
  }, [!stateRefreshInProgress]);

  const handleCourseDeletion = courseId => {
    setOpen(true)
    setCourseIdToBeDeleted(courseId)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleStateRefresh = async () => {
    await setStateRefreshInProgress(!stateRefreshInProgress)
    setValue(0)
  }

  const handleIsNewCourse = () => {
    setIsAddNewCourse(false)
  }

  function handleCampResetInformation(courseId) {
    const { courseType } = courseToBeEdited.courseDetails
    setStateRefreshInProgress(true);
    axios
      .delete(`/companies/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        setValue(1)
        setStateRefreshInProgress(false);
        if (courseType === 'Weekly') setNewCourseDetail('weekly')
        else setNewCourseDetail('camp')
      })
      .catch(err => {
        setStateRefreshInProgress(false);
        console.error(err)
      });
  }

  const handleDelete = () => {
    setStateRefreshInProgress(true);
    axios
      .delete(`/courses/${courseIdToBeDeleted}`, {
        headers: { Authorization: `Bearer ${auth.getToken()}` },
      })
      .then((res) => {
        console.log(res.data);
        setStateRefreshInProgress(false);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        setStateRefreshInProgress(false);
        handleClose();
      });
  };

  const handleEditCourse = (course) => {
    setValue(2)
    setCourseToBeEdited(course)
  };

  const handleChange = (event, newValue) => {
    setCourseToBeEdited(null)
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      {isLoading && <div>
        <CircularProgress style= {{position: 'absolute', left: 'calc(50% - 50px)', top: 'calc(50% - 50px)', width: '100px', height: '100px', margin: 'auto'}}/>
      </div>}
      {(!isLoading && isAddNewcourse) && <AddNewCourse classes={classes} handleStateRefresh={() => handleStateRefresh()} handleIsNewCourse={() => handleIsNewCourse()} setStateRefreshInProgress={setStateRefreshInProgress}/>}
      {(!isLoading && !isAddNewcourse) &&
        <div className={classes.root}>        
          {!isEditCourse && <SessionsPageTable
            classes={classes}
            handleEditCourse={e => handleEditCourse(e)}
            handleCourseDeletion={e => handleCourseDeletion(e)}
            courseToBeEdited={courseToBeEdited}
            courses={companyCourses}
            companyCoachIds={companyCoachIds}
            companyCoachInfo={companyCoachInfo}
            registers={registers} 
            setIsEditCourse={setIsEditCourse}
            setEditCourse={setEditCourse}
            setIsAddNewCourse={setIsAddNewCourse}
            />}
          {isEditCourse && <AddNewCourse classes={classes} handleStateRefresh={() => handleStateRefresh()} handleIsNewCourse={() => handleIsNewCourse()} editCourse={editCourse} setIsEditCourse={() => setIsEditCourse()} setStateRefreshInProgress={setStateRefreshInProgress}/>}
          <DeleteComponent
            open={open}
            handleDelete={e => handleDelete(e)}
            handleClose={e => handleClose(e)}
            name='course/camp' />
        </div>}
    </div>
  );
}

{/* <AppBar position="static" color="default">
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
            <Tab label="Current" icon={<ExploreSharpIcon />} {...a11yProps(0)} />
            <Tab label="Add New" icon={<AddLocationSharpIcon />} {...a11yProps(2)} />
          {courseToBeEdited && <Tab label="Edit Existing" icon={<AddLocationSharpIcon />} {...a11yProps(3)} /> } 
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <SessionsPageTable
            classes={classes}
            handleEditCourse={e => handleEditCourse(e)}
            handleCourseDeletion={e => handleCourseDeletion(e)}
            courseToBeEdited={courseToBeEdited}
            courses={companyCourses}
            companyCoachIds={companyCoachIds}
            companyCoachInfo={companyCoachInfo}
            registers={registers} />

          <br></br>
          <Typography variant="h4" >This Weeks Sessions</Typography>
          <Container>
            {Object.keys(thisWeek).map(day => {
              if (thisWeek[day].length !== 0) {
                return (
                  <>
                    <Typography gutterBottom={true} variant="h5">{moment(day).format('dddd')}</Typography>
                    {thisWeek[day].map(([courseDetails, id, sessionInfo]) => {
                      return (
                        <Typography gutterBottom={true} variant="h6">
                          {sessionInfo.startTime} - {sessionInfo.endTime}, {courseDetails.courseType === 'Camp' ? courseDetails.location : courseDetails.sessions[0].location}:
                          <Link to={`/courses/${id}/register/${day}`}>
                            {`${courseDetails.optionalName}`}
                          </Link>
                        </Typography>
                      )
                    })}
                  </>
                )
              }
            })}
          </Container>
        </TabPanel>
        
        <TabPanel className={classes.formContainer} value={value} index={1}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">What type of course are you adding?</InputLabel>
            <Select
              className={classes.select}
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              label='Who type of course are you adding?'
              value={newCourseDetail}
              onChange={e => setNewCourseDetail(e.target.value)}
            >
              <MenuItem value='camp'> Camp </MenuItem>
              <MenuItem value='weekly'> Weekly Course</MenuItem>
            </Select>
          </FormControl>

          {newCourseDetail ? newCourseDetail === 'camp' ?
            <MaterialUIPickers
              handleStateRefresh={() => handleStateRefresh()}
            />
            : (
              <WeeklyCourseDetails
                handleStateRefresh={() => handleStateRefresh()}
              />
            ) : null}
        </TabPanel>
        
        <TabPanel className={classes.formContainer} value={value} index={2}>
          {courseToBeEdited ? courseToBeEdited.courseDetails.courseType === 'Camp' ?
            <MaterialUIPickers
              handleCampResetInformation={e => handleCampResetInformation(e)}
              handleStateRefresh={() => handleStateRefresh()}
              course={courseToBeEdited}
            />
            :
            (
              <WeeklyCourseDetails
                course={courseToBeEdited}
                handleStateRefresh={() => handleStateRefresh()}
                handleCampResetInformation={e => handleCampResetInformation(e)} />
            ) : null}
        </TabPanel> */}



