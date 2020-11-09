import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import auth from '../../lib/auth'
import { add } from 'date-fns';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import LocationFilter from '../../components/LocationFilter'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: `${window.innerHeight - 80}px`,
  },
  form: {
    width: '30%',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    height: '60%',
    justifyContent: 'space-evenly'
  },
  button: {
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  }
}));

export default function AddLocation({ history }) {

  const [loginError, setLoginError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [formDetails, setformDetails] = useState({
    venue: '',
    fullAddress: '',
    longitude: '',
    latitude: '',
    companyId: auth.getUserId()
  })
  const [address, setAddress] = useState()
  const classes = useStyles();

  function handleFormSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    console.log(formDetails)

    axios.post("/companies/locations", formDetails)
      .then(res => {
        setIsLoading(false)
        console.log(res.data)
        history.push('/companyDashboard/location')
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
      })
  }

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    setAddress(value)
    setformDetails({ ...formDetails, 
      fullAddress: value,
      latitude: latLng.lat, 
      longitude: latLng.lng })
  };


  return (

    <div className={classes.container}>
      <Typography variant='h4'> Address </Typography>
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className={classes.form}>


        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel>Venue Name</InputLabel>
          <OutlinedInput
            type="text"
            label="Venue Name"
            // value={formDetails.cost}
            onChange={e => setformDetails({ ...formDetails, venue: e.target.value })}
          />
        </FormControl>

        <LocationFilter address={address} handleSelect={e => handleSelect(e)} setAddress={setAddress} />

        {loginError && <p style={{ color: 'red', textAlign: 'center' }}> {loginError.message} </p>}

        <Button disabled={isLoading}
          className={classes.button} type='submit'
          variant="contained" color="primary">
          Save
          {isLoading && <CircularProgress size={30} className={classes.progress} />}
        </Button>

      </form>

    </div>
  )
}