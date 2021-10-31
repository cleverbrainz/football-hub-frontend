import React, {useState, useEffect } from 'react'
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





export default function SessionsCoach() {

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

async function getData() {
  let activeRegisterArray = []
  let pastRegisterArray = []
  let coachArray = []
  const response = await axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
  const data = await response.data[0]

  for (const course of data.courses.active) {
  let register
  const response = await axios.get(`/courses/${course.courseId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
  register = await response.data
  console.log(register.register)
  // console.log('data', data)
  if (register.register) activeRegisterArray.push([course.courseDetails, course.courseId, register.register.sessions])
  }
  for (const course of data.courses.past) {
    let register
    const response = await axios.get(`/courses/${course.courseId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    register = await response.data
    if (register.register) pastRegisterArray.push([course.courseDetails, course.courseId, register.register.sessions])
    }
  for (const coach of data.coaches) {
    let coachdetails
    const response = await axios.get(`users/${coach}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    coachdetails = await response.data[0]
    coachArray.push(coachdetails)
  }
  setCompanyCoachIds(data.coaches)
  setCompanyCoachInfo(coachArray)
  setCompanyCourses(data.courses)
  setRegisters({active: activeRegisterArray, past: pastRegisterArray})
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
  // axios
  //   .get(`/users/${auth.getUserId()}`)
  //   .then(res => {
  //     setCompanyCourses(res.data[0].courses);
  //   })
  //   .catch(e => console.log(e))
  getData()
}, [!stateRefreshInProgress]);

const handleChange = (event, newValue) => {
  setValue(newValue);
};


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
          <Tab label="Past Courses" icon={<HistoryIcon />} {...a11yProps(2)} />
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

  { Object.keys(thisWeek).map(day => {
    if (thisWeek[day].length !== 0) {
      return (
      <>
      <Typography gutterBottom={true} variant="h5">{moment(day).format('dddd Do')}</Typography>
      {thisWeek[day].map(([courseDetails, id, sessionInfo]) => {
        return (
          <Typography gutterBottom={true} variant="h6">
          {`${courseDetails.optionalName}: ${sessionInfo.startTime} - ${sessionInfo.endTime}, ${courseDetails.location} : `}
          <Link to={`/courses/${id}/register/${day}`}>
            View Register
          </Link>
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
          {companyCourses.active.map((el, i) => (
            <TableRow key={i}>
              <TableCell component="th" scope="row">
                {el.courseDetails.optionalName}
              </TableCell>
          <TableCell align='right'>
            {el.courseDetails.location}
          </TableCell>
          <TableCell align="right">{el.courseDetails.startDate ? moment(el.courseDetails.startDate).format('DD/MM/YYYY'): moment(el.courseDetails.firstDay).format('DD/MM/YYYY')}</TableCell>
          <TableCell align="right">{el.courseDetails.endDate?  moment(el.courseDetails.endDate).format('DD/MM/YYYY') : moment(el.courseDetails.lastDay).format('DD/MM/YYYY')}</TableCell>
          <TableCell align="right">{el.courseDetails.age}</TableCell>
              <TableCell align="right">
                <Link to={`/courses/${el.courseId}/register/full`}>View Full Register</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </TabPanel>
</>
)

}