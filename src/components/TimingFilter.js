import React, { useState } from 'react'
import { FormControl, Button, Typography, Box, FormLabel, FormGroup, FormControlLabel, FormHelperText, Checkbox } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles';


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



const TimingFilter = ({ toggleModal, 
  handleFilterSubmit,
  handleTimingChange, 
  filterDetails }) => {

  const classes = useStyles();

  // console.log(filterDetails)
  return (

    <>

      <Typography component='div'>
        <Box fontSize={18} fontWeight="fontWeightBold" m={0}>
          Select Days
        </Box>
      </Typography>
      
        {Object.keys(filterDetails.timing.days).map((el, i) => {
          return (
            <FormControlLabel

              control={<Checkbox id='days' checked={filterDetails.timing.days[el]}
                onChange={handleTimingChange}
                name={el} />}
              label={el.charAt(0).toUpperCase() + el.slice(1)}
            />
          )
        })}

      <Typography component='div'>
        <Box fontSize={18} fontWeight="fontWeightBold" m={5}>
          Select Start Times
        </Box>
      </Typography>

      {Object.keys(filterDetails.timing.times).map((el, i) => {
        let upper = el.charAt(0).toUpperCase() + el.slice(1)
        let text
        if (i === 0) text = `${upper} (8am - 12pm)`
        else if (i === 1) text = `${upper} (12pm - 6pm)`
        else text = `${upper} (6pm - 10pm)`
        return (
          <FormControlLabel
            control={<Checkbox id='times' checked={filterDetails.timing.times[el]}
              onChange={handleTimingChange}
              name={el} />}
            label={text}
          />
        )
      })}

      <Button
        style={{ margin:'20px 0', width: '230px', borderRadius: '20px' }}
        onClick={handleFilterSubmit}
        variant="contained" color="primary">

        Search
            </Button>

    </>
  )
}


export default TimingFilter