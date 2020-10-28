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
    height: '40%',
    justifyContent: 'space-evenly'
  },
  button: {
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  }
}));

export default function Location({ history }) {

  const [loginError, setLoginError] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [addressFields, setAddressFields] = useState({
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    country: '',
    postcode: ''
  })

  useEffect(() => {
    axios
      .get(`/users/${auth.getUserId()}`)
      .then((res) => {
        console.log(res.data);
        if (res.data[0].location) setAddressFields({...addressFields, ...res.data[0].location});
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const textFields = ['Address Line 1', 'Address Line 2', 'Address Line 3', 'City', 'Country', 'Postcode']
  const classes = useStyles();

  function handleFormChange(e) {
    const { name, value } = e.target
    const fields = { ...addressFields, [name]: value }
    setAddressFields(fields)
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    
    axios.get(`https://api.postcodes.io/postcodes/${addressFields.postcode.replace(/\s/g, '')}`)
    .then(res => {
      const { longitude, latitude } = res.data.result
      return {...addressFields, longitude, latitude}
    })
    .then(res => {
      console.log(res)
      axios.post('/companies/location', res, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        setIsLoading(false)
        console.log(res.data)
        history.push('/companyDashboard')
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
      })
    })
    
  }

  return (

    <div className={classes.container}>
      <Typography variant='h4'> Address </Typography>
      <form
        autoComplete='off'
        onChange={(e) => handleFormChange(e)}
        onSubmit={(e) => handleFormSubmit(e)}
        className={classes.form}>

        {textFields.map((el, i) => {
          const name = el.charAt(0).toLowerCase() + el.slice(1).replace(/\s/g, '');
          return (
            <FormControl style={{margin: '10px 0'}} variant="outlined">
              <InputLabel htmlFor="component-outlined"> {el} </InputLabel>
              <OutlinedInput
                // error={loginError ? true : false}
                value={addressFields[name]}
                type='text'
                name={name} 
                id="component-outlined" 
                label={el}
              />
            </FormControl>
          )
        })}



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