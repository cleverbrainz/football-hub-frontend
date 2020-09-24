import React, { useState } from 'react'
import { FormControl, FormLabel, FormGroup, FormControlLabel, FormHelperText, Checkbox } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles';


const MoreFilters = ({ toggleModal }) => {

  
  const [ageIsChecked, setAgeIsChecked] = useState({
    U7s: false,
    U8s: false,
    U9s: false,
    U10s: false,
    U11s: false,
    U12s: false,
    U13s: false,
    U14s: false,
    U15s: false,
    U16s: false,
    U17s: false,
    U18s: false,
  });

  const useStyles = makeStyles((theme) => ({
    formGroup: {
      margin: theme.spacing(1),
      // minWidth: 120,
      // maxWidth: 300,
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    labels: {
      // width: '100%',
      width: '45%',
      [theme.breakpoints.up('md')]: {
        width: '45%',
        paddingLeft: '1em'
      },
      margin: '10px 0'
    },
    input: {
      width: 50,
      height: 50
    }
  }));

  const classes = useStyles();

  const handleChange = (event) => {
    setAgeIsChecked({ ...ageIsChecked, [event.target.name]: event.target.checked });
  };

  return (
    <FormControl style={{width: '90%'}} component="fieldset" >
      <FormGroup className={classes.formGroup}>

        {Object.keys(ageIsChecked).map((el, i) => {
          return (
            <FormControlLabel
              className={classes.labels}
              control={<Checkbox className={classes.input} checked={ageIsChecked[el]} onChange={handleChange} name={el} />}
              label={el}
            />
          )
        })}

      </FormGroup>
      {/* <FormHelperText>Be careful</FormHelperText> */}
    </FormControl>
  )
}


export default MoreFilters