import React, { useEffect, useState } from 'react';
import moment from 'moment'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import AddLocationSharpIcon from '@material-ui/icons/AddLocationSharp';
import HistoryIcon from '@material-ui/icons/History';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {
  Typography,
  Button,
  Select
} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import axios from 'axios'
import auth from '../../lib/auth'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';
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




export default function CoachSessions() {
  const date = moment()
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [courses, setCourses] = useState([])
  const [registers, setRegisters] = useState([])
  const [open, setOpen] = useState(false)
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const [courseIdToBeDeleted, setCourseIdToBeDeleted] = useState()
  const [newCourseDetail, setNewCourseDetail] = useState()
  const [courseToBeEdited, setCourseToBeEdited] = useState()
  const [companyCoaches, setCompanyCoaches] = useState([])
  const [thisWeek, setThisWeek] = useState([])

  async function getData() {
    let coursesArray = []
    const registerArray = []
    const response = await axios.get(`/users/${auth.getUserId()}`)
    const data = await response.data[0]
    console.log(data)
    for (const course of Object.keys(data.courses)) {
    console.log('objkeys', course, data.courses[course])
    let courses
    const response = await axios.get(`/users/${course}`)
    courses = await response.data[0].courses
    for (const compCourse of courses.active) {
      if (data.courses[course].active.some(id => id === compCourse.courseId)) {
        coursesArray.push([compCourse, response.data[0].name])
        const registerResponse = await axios.get(`/courses/${compCourse.courseId}`)
        const registerData = await registerResponse.data
        if (registerData.register) registerArray.push([compCourse.courseDetails, compCourse.courseId, registerData.register.sessions])
      }
    }
    // console.log('data', data)
    // 
    }
    setCourses(coursesArray)
    setRegisters(registerArray)
    setThisWeek(sortRegisters(registerArray))
    }


    const sortRegisters = registers => {
      const monday = date.startOf('week')
      const weekdays = {}
      for (let i = 1; i <= 7; i++) {
        weekdays[(monday.add(1, 'days').format('YYYY-MM-DD'))] = []
      }

      registers.forEach(([courseDetails, id, sessionDates]) => {
        for (const session of sessionDates) {
          if (Object.keys(weekdays).indexOf(session) !== -1) {
            const correctSession = courseDetails.sessions.filter(infoSession => infoSession.day === moment(session).format('dddd'))[0]
            weekdays[session].push([courseDetails, id, correctSession])
          }
        }
      })

      console.log(weekdays)
      
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

  console.log({courses, registers, date})

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

  if (courses.length === 0) return null
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
          <Tab label="Current Courses" icon={<ExploreSharpIcon />} {...a11yProps(0)} />
          <Tab label="Past Courses" icon={<HistoryIcon />} {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
      <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Company</TableCell>
            <TableCell align="right">Course Location</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="right">Age Group</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map(([el, id], i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {el.courseDetails.optionalName}
              </TableCell>
              <TableCell component="th" scope="row">
            {id}
          </TableCell>
          <TableCell align='right'>
            {el.courseDetails.location}
          </TableCell>
          <TableCell align="right">{el.courseDetails.startDate}</TableCell>
          <TableCell align="right">{el.courseDetails.endDate}</TableCell>
          <TableCell align="right">{el.courseDetails.age}</TableCell>
              <TableCell align="right">
                <Link to={`/courses/${el.courseId}/register/full`}>View Full Register</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
<br></br>
    <Typography variant="h4" >This Weeks Sessions</Typography>
    <Container>

    { Object.keys(thisWeek).map(day => {
      if (thisWeek[day].length !== 0) {
        return (
        <>
        <Typography gutterBottom={true} variant="h5">{moment(day).format('dddd Do')}</Typography>
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


    {/* <TableContainer component={Paper}>
    <Table className={classes.table} aria-label="simple table">
    <TableHead>
          <TableRow>
            <TableCell align="right">Monday</TableCell>
            <TableCell align="right">Tuesday</TableCell>
            <TableCell align="right">Wednesday</TableCell>
            <TableCell align="right">Thursday</TableCell>
            <TableCell align="right">Friday</TableCell>
            <TableCell align="right">Saturday</TableCell>
            <TableCell align="right">Sunday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(thisWeek).map(day => {
            if (thisWeek[day].length === 0) return <h1>hello</h1>
          })}
        </TableBody>
    </Table>
    </TableContainer> */}


      </TabPanel>

     
    </div>
  );
}



