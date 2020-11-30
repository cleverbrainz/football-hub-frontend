import React from 'react'
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@material-ui/core";
const TableComponent = ({ classes, updateCourseDays, el, index }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const times = [6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
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
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Start</InputLabel>
              <Select
                value={el && el.startTime}
                label="Start"
                name='startTime'
                onChange={updateCourseDays}
              >

                {times.map((el, i) => {
                  const time = i < 6 ? el + 'am' : el + 'pm'
                  return (
                    <MenuItem value={time}> {time} </MenuItem>
                  )
                })}

              </Select>
            </FormControl>
          </td>
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Finish</InputLabel>
              <Select
              value={el && el.endTime}
                label="Finish"
                name='endTime'
                onChange={updateCourseDays}
              >
                {times.map((el, i) => {
                  const time = i < 6 ? el + 'am' : el + 'pm'
                  return (
                    <MenuItem value={time}> {time} </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </td>
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Spaces</InputLabel>
              <OutlinedInput
                name="spaces"
                id="spaces"
                value={el && el.spaces}
                label="Spaces"
                onChange={updateCourseDays}
              />
            </FormControl>
          </td>
        </tr>
      </tbody>
    </table>
  )
}
export default TableComponent