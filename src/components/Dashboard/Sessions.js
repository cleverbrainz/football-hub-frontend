import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import AddLocationSharpIcon from '@material-ui/icons/AddLocationSharp';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {
  Typography,
  Button,
  Select,
  Container
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import DeleteComponent from '../../pages/admin/DeleteComponent'
import SessionsPageTable from '../../components/SessionsPageTable'
import MaterialUIPickers from '../../pages/admin/CampMultiDetails'
import WeeklyCourseDetails from '../../pages/admin/WeeklyCourseDetails'


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
    width: '50%',
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
    margin: '7px 0',
    width: `${(window.innerWidth - 100) / 3}px`
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
  const [newCourseDetail, setNewCourseDetail] = useState()
  const [courseToBeEdited, setCourseToBeEdited] = useState()
  const [companyCoachIds, setCompanyCoachIds] = useState([])
  const [companyCoachInfo, setCompanyCoachInfo] = useState([])
  const [thisWeek, setThisWeek] = useState([])

  async function getData() {
    let registerArray = []
    let coachArray = []
    const response = await axios.get(`/users/${auth.getUserId()}`)
    const data = await response.data[0]
    console.log(data)
    for (const course of data.courses) {
      let register
      const response = await axios.get(`/courses/${course.courseId}`)
      register = await response.data
      console.log(register.register)
      // console.log('data', data)
      if (register.register) registerArray.push([course.courseDetails, course.courseId, register.register.sessions])
    }
    for (const coach of data.coaches) {
      let coachdetails
      const response = await axios.get(`users/${coach}`)
      coachdetails = await response.data[0]
      coachArray.push(coachdetails)
    }
    setCompanyCoachIds(data.coaches)
    setCompanyCoachInfo(coachArray)
    setCompanyCourses(data.courses)
    setRegisters(registerArray)
    setThisWeek(sortRegisters(registerArray))
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
    // axios
    //   .get(`/users/${auth.getUserId()}`)
    //   .then(res => {
    //     setCompanyCourses(res.data[0].courses);
    //   })
    //   .catch(e => console.log(e))
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
    console.log(courseIdToBeDeleted);
    axios
      .delete(`/companies/courses/${courseIdToBeDeleted}`, {
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
    console.log(course)
    setValue(2)
    setCourseToBeEdited(course)
  }


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          <Tab label="Current" icon={<ExploreSharpIcon />} {...a11yProps(0)} />
          <Tab label="Add New" icon={<AddLocationSharpIcon />} {...a11yProps(2)} />
          <Tab label="Edit Existing" icon={<AddLocationSharpIcon />} {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
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
                        {sessionInfo.startTime} - {sessionInfo.endTime}, {courseDetails.location}:
            <Link to={`/courses/${id}/register/${day}`}>
                          {` ${courseDetails.optionalName}`}
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

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={1}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="demo-simple-select-outlined-label">Who type of course are you adding?</InputLabel>
          <Select
            className={classes.select}
            labelId="demo-simple-select-filled-label"
            id="demo-simple-select-filled"
            label='Who type of course are you adding?'
            value={newCourseDetail}
            onChange={e => setNewCourseDetail(e.target.value)}
          >

            <MenuItem value='camp'> Camp </MenuItem>
            <MenuItem value='weekly'> Weekly Course </MenuItem>

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

      {/* tab 5 content */}
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
      </TabPanel>

      <DeleteComponent
        open={open}
        handleDelete={e => handleDelete(e)}
        handleClose={e => handleClose(e)}
        name='course/camp' />
    </div>
  );
}



