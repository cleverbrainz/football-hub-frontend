import React from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  MenuItem,
} from "@material-ui/core";

const AgeComponent = ({ classes }) => {
  const ages = [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "Adults",
  ];

  return (
    <table>
      <tbody>
        <tr>
          {/* <div className={classes.rowHead}> Age group</div> */}
          <td>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>From Age</InputLabel>
              <Select label="From Age" name="age">
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
              <InputLabel>To Age</InputLabel>
              <Select label="To Age" name="age">
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
        </tr>
      </tbody>
    </table>
  );
};

export default AgeComponent;
