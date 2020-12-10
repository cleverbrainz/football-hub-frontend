import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import DeleteForeverSharpIcon from '@material-ui/icons/DeleteForeverSharp';
import moment from 'moment'
import { toDate } from 'date-fns';
import CreateSharpIcon from '@material-ui/icons/CreateSharp';
import axios from 'axios'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    }
  },
  icons: {
    "&:hover": {
      cursor: "pointer",
    },
  }
});



export default function SessionsPageTable({ companyCoachIds, companyCoachInfo, courses, handleEditCourse, handleCourseDeletion, registers }) {

  function WeeklyRow({ course }) {
    const { courseId, companyId, coaches } = course
    const { startDate, endDate, paymentInterval, cost, age, location, optionalName } = course.courseDetails
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const [courseCoaches, setCourseCoaches] = React.useState(coaches)
    console.log(courseCoaches, companyCoachInfo)

    const handleChange = (event) => {
      setCourseCoaches(event.target.value);
      axios.patch(`/courses/${courseId}/coaches`, { coaches: event.target.value, companyId: companyId, courseId: courseId })
      .then(res => {
        console.log(res)
      })
    };
  
    const handleChangeMultiple = (event) => {
      const { options } = event.target;
      const value = [];
      for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
      setCourseCoaches(value);
    };

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>


          <TableCell component="th" scope="row">
            {optionalName}
          </TableCell>
          <TableCell align='right'>
            {location}
          </TableCell>
          <TableCell align="right">{startDate}</TableCell>
          <TableCell align="right">{endDate}</TableCell>
          <TableCell align="right">{age}</TableCell>
          <TableCell align="right">{cost}</TableCell>
          <TableCell align="right">{paymentInterval}</TableCell>
          <TableCell align="right">
            <CreateSharpIcon
              style={{ color: '#709995' }}
              onClick={() => handleEditCourse(course)}
              className={classes.icon}
            />
          </TableCell>
          <TableCell align="right">
            <DeleteForeverSharpIcon
              style={{ color: '#EF5B5B' }}
              onClick={() => handleCourseDeletion(courseId)}
              className={classes.icon}
            />
          </TableCell>
        </TableRow>



        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Sessions
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell align="right">End Time</TableCell>
                      <TableCell align="right">Spaces</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>


                    {course && course.courseDetails.sessions.map((session, i) => {
                      const { day, startTime, endTime, spaces } = session
                      return (
                        <TableRow key={i} >
                          <TableCell component="th" scope="row">
                            {day}
                          </TableCell>
                          <TableCell>{startTime}</TableCell>
                          <TableCell align="right">{endTime}</TableCell>
                          <TableCell align="right">
                            {spaces}
                          </TableCell>
                        </TableRow>
                      )
                    })}

          

                      <Typography variant="h6" gutterBottom component="div">
                              Register
                          </Typography>
                          {
                        (registers.length !== 0) ? registers.map(register => {
                          if (register.courseId === course.courseId) {
                          return (
                          <Link to={`/courses/${register.courseId}/register`} state={{register}}></Link> 
                          )
                        }}) :               
                            <Typography>
                              No students yet
                            </Typography>
                          }

                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
          <Typography variant="h6" gutterBottom component="div">
                  Assigned Coaches
                </Typography>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-mutiple-checkbox-label">Select Coaches</InputLabel>
                      <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={courseCoaches}
                        onChange={handleChange}
                        input={<Input />}
                        renderValue={(selected) => selected.map(item => {
                          console.log('selected', selected)
                          for (const coach of companyCoachInfo) {
                            if (item === coach.userId) {
                              return coach.coachInfo.name
                            }
                          }
                        }).join(', ')}
                        // MenuProps={MenuProps}
                        >
                          {companyCoachInfo.map((name) => {
                            return (
                            <MenuItem 
                              disabled={name.message === 'Documents verifed' ? false : true} 
                              key={name.userId} 
                              value={name.userId}
                              >
                              <Checkbox checked={courseCoaches.indexOf(name.userId) > -1} />
                              <ListItemText primary={name.coachInfo.name} />
                            </MenuItem>
                          )})
                        }
                        </Select>
                      </FormControl>
                      </Box>
                      </Collapse>
                      </TableCell>
        </TableRow>
      </React.Fragment >
    );
  }

  function CampRow({ course }) {
    const { courseId } = course
    const { lastDay, firstDay, location, sessions, dayCost, campCost, age } = course.courseDetails
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>


          <TableCell component="th" scope="row">
            {courseId}
          </TableCell>
          <TableCell align="right">{firstDay}</TableCell>
          <TableCell align="right">{lastDay}</TableCell>
          <TableCell align="right">{location}</TableCell>
          <TableCell align="right">{age}</TableCell>
          <TableCell align="right">{campCost}</TableCell>
          <TableCell align="right">{dayCost}</TableCell>
          <TableCell align="right">
            <CreateSharpIcon
              style={{ color: '#709995' }}
              onClick={() => handleEditCourse(course)}
              className={classes.icon}
            />
          </TableCell>
          <TableCell align="right">
            <DeleteForeverSharpIcon
              style={{ color: '#EF5B5B' }}
              onClick={() => handleCourseDeletion(courseId)}
              className={classes.icon}
            />
          </TableCell>
        </TableRow>



        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Sessions
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Start Time</TableCell>
                      <TableCell align="right">End Time</TableCell>
                      <TableCell align="right">Spaces</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>


                    {course && course.courseDetails.sessions.map((session, i) => {
                      function toDateTime(secs) {
                        var t = new Date(1970, 0, 1); // Epoch
                        t.setSeconds(secs);
                        return t;
                      }
                      const { sessionDate, startTime, endTime, spaces } = session

                      return (
                        <TableRow key={i} >
                          <TableCell component="th" scope="row">
                            {sessionDate && moment(toDateTime(sessionDate._seconds)).format('MMMM Do YYYY')}
                          </TableCell>
                          <TableCell>{startTime}</TableCell>
                          <TableCell align="right">{endTime}</TableCell>
                          <TableCell align="right"> {spaces} </TableCell>
                        </TableRow>
                      )
                    })}

                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment >
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom component="div">
        Courses
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell align="right">Venue </TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Age Group</TableCell>
              <TableCell align="right">Cost</TableCell>
              <TableCell align="right">Payment Interval</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses && courses.map((course, i) => {
              const { courseType } = course.courseDetails
              if (courseType === 'Weekly') return <WeeklyRow key={i} course={course} companyCoaches={companyCoachIds} />
            }
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography style={{ marginTop: '30px' }} variant="h6" gutterBottom component="div">
        Camps
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID </TableCell>
              <TableCell align="right">Start Date</TableCell>
              <TableCell align="right">End Date</TableCell>
              <TableCell align="right">Venue</TableCell>
              <TableCell align="right">Age Group</TableCell>
              <TableCell align="right">Camp Cost</TableCell>
              <TableCell align="right">Day Cost</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses && courses.map((course, i) => {
              const { courseType } = course.courseDetails
              if (courseType === 'Camp') return <CampRow key={i} course={course} />
            }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
