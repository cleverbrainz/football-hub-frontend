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

export default function AddLocation({
  handleStateRefresh,
  stateRefreshInProgress,
  classes }) {

  const [formDetails, setformDetails] = useState({
    venue: '',
    fullAddress: '',
    longitude: '',
    latitude: '',
    postCode: '',
    companyId: auth.getUserId()
  })
  const [address, setAddress] = useState()

  const handleFormSubmit = e => {
    e.preventDefault()

    axios.post("/companies/locations", formDetails)
      .then(res => {
        handleStateRefresh()
      })
      .catch(err => {
        handleStateRefresh()
      })
  }

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    console.log(value)
    console.log(results)

    setAddress(value)
    setformDetails({
      ...formDetails,
      fullAddress: value,
      latitude: latLng.lat,
      longitude: latLng.lng
    })
  };


  return (


    <form
      onSubmit={(e) => handleFormSubmit(e)}
      className={classes.form}
    >

      <FormControl variant="outlined"

        className={classes.inputs}
        style={{ marginBottom: '10px' }}>
        <InputLabel>Venue Name</InputLabel>
        <OutlinedInput
          type="text"
          label="Venue Name"
          onChange={e => setformDetails({ ...formDetails, venue: e.target.value })}
        />
      </FormControl>

      <LocationFilter address={address} handleSelect={e => handleSelect(e)} setAddress={setAddress} />

      <FormControl variant="outlined"
        className={classes.inputs}
        style={{ marginBottom: '10px' }}>
        <InputLabel>Post Code</InputLabel>
        <OutlinedInput
          type="text"
          label="Post Code"
          onChange={e => setformDetails({ ...formDetails, postCode: e.target.value })}
        />
      </FormControl>

      <Button
        className={classes.input}
        type='submit'
        variant="contained" color="primary">
        Save
          {/* {isLoading && <CircularProgress size={30} className={classes.progress} />} */}
      </Button>

    </form>
  )
}