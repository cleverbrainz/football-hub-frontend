import React from 'react'
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
  TextField
} from "@material-ui/core";



const TableComponent = ({
  classes,
  updateCourseDays,
  el,
  index,
  location,
  locations,
  session,
  updateOtherCourseInfo }) => {

   if (el) console.log(timeConversion(formatDateString(el.endTime)))

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
      return `0${str.substring(0, 4)}:00${str.slice(-2)}`
    } else {
      return `${str.substring(0, 5)}:00${str.slice(-2)}`
    }
  }




  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  // const times = [6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  return (
    <table>
      <tbody>
        <tr>
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Day</InputLabel>
              <Select
                value={el && el.day}
                label="Day"
                name='day'
                onChange={updateCourseDays}
              >

                {days.map((el, i) => <MenuItem key={i} value={el}> {el} </MenuItem>)}

              </Select>
            </FormControl>
          </td>
          <td>
            <FormControl variant="outlined" name='startTime' className={classes.formControl}>
              <TextField
                value={el ? timeConversion(formatDateString(el.startTime)) : session?.startTime && timeConversion(formatDateString(session.startTime))}
                name='startTime'
                label="Start Time"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={updateCourseDays}
              />

            </FormControl>
          </td>
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <TextField
                value={el ? timeConversion(formatDateString(el.endTime)) : session?.endTime && timeConversion(formatDateString(session.endTime))}
                name='endTime'
                label="End Time"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={updateCourseDays}
              />
            </FormControl>
          </td>

          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Location</InputLabel>
              <Select
                value={el && el.location}
                label="Location"
                name="location"
                onChange={updateCourseDays}
              >
                {locations && locations.map((el, i) => (
                  <MenuItem key={i} value={`${el.venue} (${el.postCode && el.postCode})`}>
                    {`${el.venue} (${el.postCode && el.postCode})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
export default TableComponent