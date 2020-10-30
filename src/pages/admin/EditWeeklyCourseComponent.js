import React from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@material-ui/core";
const TableComponent = ({ classes, updateCourseDays, Session }) => {
  console.log(Session);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const times = [6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Day</InputLabel>
              <Select
                label="Day"
                name="day"
                onChange={updateCourseDays}
                value={Session.day}
              >
                <MenuItem>
                  {" "}
                  <em>Select</em>{" "}
                </MenuItem>

                {days.map((el, i) => (
                  <MenuItem key={i} value={el}>
                    {" "}
                    {el}{" "}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </td>
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Start</InputLabel>
              <Select
                label="Start"
                name="startTime"
                onChange={updateCourseDays}
                value={Session.startTime}
              >
                <MenuItem aria-label="Select">None</MenuItem>
                {times.map((el, i) => {
                  const time = i < 6 ? el + "am" : el + "pm";
                  return <MenuItem value={time}> {time} </MenuItem>;
                })}
              </Select>
            </FormControl>
          </td>
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Finish</InputLabel>
              <Select
                label="Finish"
                name="endTime"
                onChange={updateCourseDays}
                value={Session.endTime}
              >
                <MenuItem aria-label="Select">None</MenuItem>
                {times.map((el, i) => {
                  const time = i < 6 ? el + "am" : el + "pm";
                  return <MenuItem value={time}> {time} </MenuItem>;
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
                label="Spaces"
                onChange={updateCourseDays}
                value={Session.spaces}
              />
            </FormControl>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
export default TableComponent;
