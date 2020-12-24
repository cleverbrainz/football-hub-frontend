import React, { useState, useCallback, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  ViewState, EditingState, IntegratedEditing
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  Toolbar,
  DragDropProvider,
  DateNavigator,
  TodayButton
} from '@devexpress/dx-react-scheduler-material-ui';
import axios from 'axios'
import Grid from '@material-ui/core/Grid';
import auth from '../../lib/auth'
import Room from '@material-ui/icons/Room';
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles';

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: 'center',
  }
});


const Calendar = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [data, setData] = useState([]);

  function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
  }

  function timeConversion(s) {
    const ampm = s.slice(-2);
    const hours = Number(s.slice(0, 2));
    let time = s.slice(0, -2);
    if (ampm.toLowerCase() === 'am') {
      if (hours === 12) { // 12am edge-case
        return time.replace(s.slice(0, 2), '00');
      }
      // console.log(time)
      return time;
    } else if (ampm.toLowerCase() === 'pm') {
      if (hours !== 12) {
        return time.replace(s.slice(0, 2), String(hours + 12));
      }
      return time; // 12pm edge-case
    }
    return 'Error: am/pm format is not valid';
  }

  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

  function formatDateString(str) {
    if (!isNumeric(str.substring(0, 2))) {
      return `0${str.substring(0, 1)}:00:00${str.slice(-2)}`
    } else {
      return `${str.substring(0, 2)}:00:00${str.slice(-2)}`
    }
  }

  function recurringDate(start, end, day) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    var start = moment(start),
      end = moment(end),
      day = days.indexOf(day)

    var result = [];
    var current = start.clone();

    if (current.day(day)) {
      result.push(current.clone());
    }

    while (current.day(7 + day).isBefore(end)) {
      result.push(current.clone())
    }

    return result.map(m => new Date(m).toString())
  }



  useEffect(() => {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        const { courses } = res.data[0]
        const appointments = []

        courses.active.forEach(el => {
          const  { coaches } = el
          const { optionalName, startDate, endDate, location, courseType, sessions } = el.courseDetails

          if (courseType === 'Camp') {
            sessions.forEach((el, i) => {

              let { sessionDate, startTime, endTime } = el
              const { _seconds } = sessionDate
              const date = moment(toDateTime(_seconds)).format().toString()
              const start = new Date(date.replace('00:00:00', timeConversion(formatDateString(startTime))))
              const end = new Date(date.replace('00:00:00', timeConversion(formatDateString(endTime))))

              appointments.push({
                title: `${optionalName}: Session ${i + 1}`,
                startDate: start,
                endDate: end,
                id: appointments.length + 1,
                location: location,
                coaches: coaches
              })
            })

          } else if (courseType === 'Weekly') {
            sessions.forEach(session => {
              recurringDate(startDate, endDate, session.day).forEach((date, i) => {
                const { startTime, endTime } = session
                const start = new Date(date.replace('00:00:00', timeConversion(formatDateString(startTime))))
                const end = new Date(date.replace('00:00:00', timeConversion(formatDateString(endTime))))


                appointments.push({
                  title: `${optionalName}: Session ${i + 1}`,
                  startDate: start,
                  endDate: end,
                  id: appointments.length + 1,
                  location: location,
                  coaches: coaches
                })
              })
            })


          }
        })
        console.log(appointments)
        setData(appointments)

      })


  }, [])



  const Content = withStyles(style, { name: 'Content' })(({
    children, appointmentData, classes, ...restProps
  }) => (
      <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
        <Grid container alignItems="center">
          <Grid style={{marginTop: '7px'}}item xs={2} className={classes.textCenter}>
            <Room className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            <span> {appointmentData.location} </span>
          </Grid>

          <Grid item xs={2} style={{marginTop: '7px'}} className={classes.textCenter}>
            <PeopleAltSharpIcon className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            {appointmentData.coaches.map(el => <span> {el} </span>)}
          </Grid>
        </Grid>
      </AppointmentTooltip.Content>
    ));


  return (

    <Paper style={{ maxWidth: '95vw', height: '86vh', padding: 0 }}>
      <Scheduler
        data={data}
        height={660}
      >
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={date => setCurrentDate(date)}
        />
        <WeekView
          startDayHour={9}
          endDayHour={23}
        />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments />

        <AppointmentTooltip
          showCloseButton
          contentComponent={Content}
          showOpenButton>

        </AppointmentTooltip>
      </Scheduler>
    </Paper>
  );
};

export default Calendar
