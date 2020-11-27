import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
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

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    }
  },
  icons: {
    color: "#EF5B5B",
    "&:hover": {
      cursor: "pointer",
    },
  }
});



export default function SessionsPageTable({ courses, handleEditCourse }) {

  function WeeklyRow({ course }) {
    const { courseId } = course
    const { startDate, endDate, paymentInterval, cost, age, location } = course.courseDetails
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
              onClick={() => handleEditCourse(course)}
              className={classes.icon}
            />
          </TableCell>
          <TableCell align="right">
            <DeleteForeverSharpIcon
            style={{ color: '#EF5B5B' }}
              // onClick={() => handleSetCoachId(el.coachId)}
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
  
                  </TableBody>
                </Table>
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
              onClick={() => handleEditCourse(course)}
              className={classes.icon}
            />
          </TableCell>
          <TableCell align="right">
            <DeleteForeverSharpIcon
              // onClick={() => handleSetCoachId(el.coachId)}
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
              <TableCell>ID </TableCell>
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
              if (courseType === 'Weekly') return <WeeklyRow key={i} course={course} />
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