import React from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@material-ui/core";
const MultiComponent = ({ classes, updateCampDays }) => {
  const ages = ["4-6", "7-9", "10-12"];

  const times = [6, 7, 8, 9, 10, 11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <table>
      <tbody>
        <tr>
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Age Group</InputLabel>
              <Select label="Age group" name="age" onChange={updateCampDays}>
                <MenuItem>
                  {" "}
                  <em>Select</em>{" "}
                </MenuItem>
                {ages.map((el, i) => (
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
              <Select label="Start" name="startTime" onChange={updateCampDays}>
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
              <Select label="Finish" name="endTime" onChange={updateCampDays}>
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
                onChange={updateCampDays}
              />
            </FormControl>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MultiComponent;
