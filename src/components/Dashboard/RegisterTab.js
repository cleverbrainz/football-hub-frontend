import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import auth from '../../lib/auth'
import {
  Typography,
  Button,
  Select,
  Container
} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ExploreSharpIcon from '@material-ui/icons/ExploreSharp';
import AddLocationSharpIcon from '@material-ui/icons/AddLocationSharp';
import HistoryIcon from '@material-ui/icons/History';
import Box from '@material-ui/core/Box';
import CourseRegister from '../../pages/CourseRegister'

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





export default function Registers() {

  const date = moment()
  const [value, setValue] = useState(0);
  const classes = useStyles()
  const [companyCourses, setCompanyCourses] = useState({ active: [], past: [] })
  const [registers, setRegisters] = useState([])
  const [open, setOpen] = useState(false)
  const [stateRefreshInProgress, setStateRefreshInProgress] = useState(false)
  const [courseIdToBeDeleted, setCourseIdToBeDeleted] = useState()
  const [newCourseDetail, setNewCourseDetail] = useState()
  const [courseToBeEdited, setCourseToBeEdited] = useState()
  const [companyCoachIds, setCompanyCoachIds] = useState([])
  const [companyCoachInfo, setCompanyCoachInfo] = useState([])
  const [thisWeek, setThisWeek] = useState([])

  const [viewRegister, setViewRegister] = useState({
    selected: false,
    courseId: '',
    session: ''
  })

  async function getData() {
    let activeRegisterArray = []
    let pastRegisterArray = []
    let coachArray = []
    const response = await axios.get(`/users/${auth.getUserId()}`)
    const data = await response.data[0]
    // console.log(data)

    for (const course of data.courses.active) {
      let register
      const response = await axios.get(`/courses/${course.courseId}`)
      register = await response.data
      console.log(register)
      // console.log(register.register)
      // console.log('data', data)
      if (!register.register) {
        const response = await axios.get(`/courses/${course.courseId}/emptyRegister`)
        const newRegister = await response.data.course
        console.log(newRegister)
        activeRegisterArray.push([course.courseDetails, course.courseId, newRegister.register.sessions])
      } else {
        activeRegisterArray.push([course.courseDetails, course.courseId, register.register.sessions])
      }
    }
    for (const course of data.courses.past) {
      let register
      const response = await axios.get(`/courses/${course.courseId}`)
      register = await response.data
      // console.log(register.register)
      // console.log('data', data)
      if (!register.register) {
        const response = await axios.get(`/courses/${course.courseId}/emptyRegister`)
        const newRegister = await response.data.course
        console.log(newRegister)
        pastRegisterArray.push([course.courseDetails, course.courseId, newRegister.register.sessions])
      } else {
        pastRegisterArray.push([course.courseDetails, course.courseId, register.register.sessions])
      }
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
    setRegisters({ active: activeRegisterArray, past: pastRegisterArray })
    setThisWeek(sortRegisters(pastRegisterArray.concat(activeRegisterArray)))
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

    console.log(weekdays)

    return weekdays
  }

  useEffect(() => {
    getData()
  }, [!stateRefreshInProgress]);

  const handleChange = (event, newValue) => {
    if (newValue !== 2) {
      setViewRegister({ ...viewRegister, selected: false })
    }
    setValue(newValue);

  };

  console.log({companyCourses})

  return (
    <>
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
          <Tab label="Past Courses" icon={<HistoryIcon />} {...a11yProps(1)} />
          {viewRegister.selected && <Tab label="View" icon={<HistoryIcon />} {...a11yProps(2)} />}
        </Tabs>
      </AppBar>

      {/* tab 1 content */}
      <TabPanel value={value} index={0}>
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>This Weeks Sessions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container>

              {Object.keys(thisWeek).map(day => {
                if (thisWeek[day].length !== 0) {
                  return (
                    <>
                      <Typography gutterBottom={true} variant="h5">{moment(day).format('dddd Do')}</Typography>
                      {thisWeek[day].map(([courseDetails, id, sessionInfo]) => {
                        return (
                          <Typography gutterBottom={true} variant="h6">
                            {`${courseDetails.optionalName}: ${sessionInfo.startTime} - ${sessionInfo.endTime}, ${courseDetails.courseType === 'Camp' ? courseDetails.location : sessionInfo.location} : `}

                            <Button onClick={() => {
                              setValue(2)
                              setViewRegister({
                                selected: true,
                                courseId: id,
                                session: day
                              })
                            }}> View Register </Button>

                          </Typography>
                        )
                      })}

                    </>

                  )
                }
              })}
            </Container>
          </AccordionDetails>
        </Accordion>
        <br />
        <Typography>All Active Courses</Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Course Location</TableCell>
                <TableCell align="right">Start Date</TableCell>
                <TableCell align="right">End Date</TableCell>
                <TableCell align="right">Age Group</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companyCourses.active.map((el, i) => {
                console.log({el})
                const { optionalName, sessions, startDate, endDate, age, location, courseType, firstDay, lastDay } = el.courseDetails
                return (<TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {optionalName}
                  </TableCell>
                  <TableCell align='right'>
                    {courseType === 'Camp' ? location : sessions[0].location}
                  </TableCell>
                  <TableCell align="right">{startDate ? moment(startDate).format('DD/MM/YYYY') : moment(firstDay).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="right">{endDate ? moment(endDate).format('DD/MM/YYYY') : moment(lastDay).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="right">{age}</TableCell>
                  <TableCell align="right">

                    <Button onClick={() => {
                      setValue(2)
                      setViewRegister({
                        selected: true,
                        courseId: el.courseId,
                        session: ''
                      })
                    }}> View Full Register </Button>

                    {/* <Link to={`/courses/${el.courseId}/register/full`}>View Full Register</Link> */}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={value} index={1}>
      <Typography>All Past Courses</Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Course Location</TableCell>
                <TableCell align="right">Start Date</TableCell>
                <TableCell align="right">End Date</TableCell>
                <TableCell align="right">Age Group</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companyCourses.past.map((el, i) => {
                const { optionalName, sessions, startDate, endDate, age, location, courseType, firstDay, lastDay } = el.courseDetails
                return ( <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {optionalName}
                  </TableCell>
                  <TableCell align='right'>
                    {courseType === 'Camp' ? location : sessions[0].location}
                  </TableCell>
                  <TableCell align="right">{startDate ? moment(startDate).format('DD/MM/YYYY') : moment(firstDay).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="right">{endDate ? moment(endDate).format('DD/MM/YYYY') : moment(lastDay).format('DD/MM/YYYY')}</TableCell>
                  <TableCell align="right">{age}</TableCell>
                  <TableCell align="right">

                    <Button onClick={() => {
                      setValue(2)
                      setViewRegister({
                        selected: true,
                        courseId: el.courseId,
                        session: ''
                      })
                    }}> View Full Register </Button>

                    {/* <Link to={`/courses/${el.courseId}/register/full`}>View Full Register</Link> */}
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </TableContainer>

      </TabPanel>

      {/* tab 2 content */}
      <TabPanel className={classes.formContainer} value={value} index={2}>
        {viewRegister && <CourseRegister
          courseId={viewRegister.courseId}
          session={viewRegister.session} />}
      </TabPanel>

    </>
  )

}