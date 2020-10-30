import React, { useState } from 'react'
import { FormControl, FormLabel, Button, FormGroup, FormControlLabel, FormHelperText, Checkbox } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles';


const AgeFilter = ({ toggleModal,
  filterDetails,
  handleFilterSubmit,
  handleAgeChange }) => {

  const useStyles = makeStyles((theme) => ({
  }));

  const classes = useStyles();

  return (

    <>

      {Object.keys(filterDetails.age).map((el, i) => {
        const text = el === 'adults' ? 'Adults' : `${el} years`
        return (
          <FormControlLabel
            control={<Checkbox
              checked={filterDetails.age[el]}
              onChange={handleAgeChange}
              name={el} />}
            label={text}
          />
        )
      })}

      <Button
        style={{ margin: '20px 0', width: '230px', borderRadius: '20px' }}
        onClick={handleFilterSubmit}
        variant="contained" color="primary">

        Search
        </Button>
    </>
  )
}


export default AgeFilter