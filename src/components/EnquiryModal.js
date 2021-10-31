import React from 'react'
import axios from 'axios'
import LocationFilter from './LocationFilter'
// import MoreFilters from './MoreFilters'
import {
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import auth from '../lib/auth'

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // alignItems: 'center'
    width: '70%',
    minWidth: '270px',
    height: '90%'
  }, 
  button: {
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  }
}))


const EnquiryModal = ({ toggleModal, companyId, companyName, openSnackBar }) => {

  const [isLoading, setIsLoading] = useState(false)

  // console.log(auth.getUserId(), companyId)
 
  const [enquiryBody, setEnquiryBody] = useState({
    name: '',
    email: '',
    message: '',
    company: companyName,
    subject: 'helloooo new message',
    userId: auth.getUserId(),
    companyId,
    enquiryType: 'general'
  })

  const [enquiryErr, setEnquiryErr] = useState()

  const classes = useStyles();


  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...enquiryBody, [name]: value }
    setEnquiryBody(fields)
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    axios.post('/enquiries', enquiryBody, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        openSnackBar()
        toggleModal()
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        setEnquiryErr(err.response.data)
      })

  }

  return (

    <div className='modal is-active'>
      <div onClick={toggleModal} className='modal-background'></div>
      <div className="modal-content">

        <Typography style={{ marginTop: '25px' }} component='div' >
          <Box
            fontSize={22} fontWeight="fontWeightBold" m={0}>
            Send an enquiry
          </Box>
        </Typography>

        <form
          autoComplete='off'
          onChange={(e) => handleFormChange(e)}
          onSubmit={(e) => handleFormSubmit(e)}
          className={classes.form}
        >

          <Typography component='div' >
            <Box
              fontSize={16} fontWeight="fontWeightBold" m={0}>
              Re: General Enquiry
            </Box>
          </Typography>

          {Object.keys(enquiryBody).map((el, i) => {
            if (i > 1) return
            const label = el.charAt(0).toUpperCase() + el.slice(1)

            return (
              <FormControl key={i} variant="outlined">
                <InputLabel htmlFor="component-outlined"> {label} </InputLabel>
                <OutlinedInput
                  // error={loginError ? true : false}
                  type='text'
                  name={el} id="component-outlined" label={el} />
              </FormControl>
            )
          })}

          <FormControl variant="outlined">
            <TextField
              id="outlined-textarea"
              label="Message"
              multiline
              name='message'
              rows={8}
              variant="outlined"
            />
          </FormControl>

          {enquiryErr && <p style={{ color: 'red', textAlign: 'center' }}> {enquiryErr.message} </p>}

          <Button
            disabled={isLoading}
            className={classes.button} 
            type='submit'
            variant="contained" color="primary">
            Submit
          {isLoading && <CircularProgress size={30}
             className={classes.progress} 
            />}
          </Button>



        </form>


      </div>
    </div>

  )
}

export default EnquiryModal
