import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import {
  CircularProgress,
  Paper,
  Typography,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Snackbar,
  TableCell,
  Button
} from '@material-ui/core'
import auth from '../lib/auth'
import axios from 'axios'
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '95%',
    height: '100%',
    paddingTop: '110px',
    paddingBottom: '50px',
    position: 'relative',
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      width: '75%',
    },
    [theme.breakpoints.up('md')]: {
      width: '55%',
    },
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '3px',
    fontSize: '13px',
    display: 'block'
  },
  field: {
    flex: 1,
    margin: '1rem 0',
    [theme.breakpoints.up('md')]: {
      margin: '1rem 0'
    },

  },
  button: {
    padding: '1rem 0',
    textAlign: 'right',
    position: 'relative'
  },
  progress: {
    position: 'absolute'
  }

}))

const PostAppForm = ({ location, history }) => {


  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState()
  const [form, setForm] = useState(null)
  const state = useRef(location.state)

  useEffect(() => {
    if (state.current.hasOwnProperty('post_app_actions')) {
      const { kit_size_top, kit_size_bottom, others, injuries, allergies } = state.current.post_app_actions
      const obj = {
        kit_size_top,
        kit_size_bottom,
        others: !others ? 'no' : 'yes',
        injuries: !injuries ? 'no' : 'yes',
        allergies: !allergies ? 'no' : 'yes',
        others_text: !others ? '' : others,
        injuries_text: !injuries ? '' : injuries,
        allergies_text: !allergies ?  '' : allergies
      }
      setForm(obj)
    } else {
      setForm({
        kit_size_top: '',
        kit_size_bottom: '',
        others: '',
        injuries: '',
        allergies: '',
        others_text: '',
        injuries_text: '',
        allergies_text: ''
      })
    }
  }, [])

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleFormChange = (e) => {
    const { name, value, id } = e.target

    setForm({
      ...form,
      ...(!id ? {
        [name]: value
      } : {
          [name]: id
        })
    })
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setMessage();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    const obj = {
      kit_size_top: form.kit_size_top,
      kit_size_bottom: form.kit_size_bottom,
      injuries: form.injuries === 'yes' ? form.injuries_text : false,
      allergies: form.allergies === 'yes' ? form.allergies_text : false,
      others: form.others === 'yes' ? form.others_text : false
    }

    axios.patch(`/users/${auth.getUserId()}`, {
      userId: auth.getUserId(),
      updates: {
        applications: {
          ajax_application: {
            ...state.current,
            post_app_actions: {
              ...state.current.post_app_actions,
              ...obj
            }
          }
        }
      }
    }, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        setMessage({ success: 'Successfully saved. Redirecting back to profile.' })
        setIsLoading(false)
        setTimeout(() => {
          history.goBack()
        }, 2000);
      })
      .catch(res => {
        setMessage({ error: 'Something went wrong. Please try again' })
        setIsLoading(false)
      })
  }

  return (

    <div className={classes.root}>

      {form && (
        <>
          <Typography component='div' >
            <Box
              fontSize={20} align='center'
              fontWeight="fontWeightBold" mt={3} mb={6}>
              PDP - Camp Training Programme Participating Player Questions
        </Box>
          </Typography>

          <form onChange={(e) => handleFormChange(e)} onSubmit={(e) => handleFormSubmit(e)}>

            <div style={{ transform: 'translateY(12px)' }} className={classes.label}>
              <label > Kit Size </label>
            </div>


            <div class="field-body">

              <div className={classes.field} style={{ flex: '0.2' }}>
                <div className={classes.label}>
                  <label > <span style={{ color: 'red' }}>*</span>  Top </label>
                </div>
                <div class="field is-narrow">
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select value={form.kit_size_top} name='kit_size_top'>
                        <option disabled={form.kit_size_top && form.kit_size_top !== ''}></option>
                        <option value='80'>80</option>
                        <option value='85'>85</option>
                        <option value='90'>90</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>


              <div className={classes.field} style={{ flex: '0.2' }}>
                <div className={classes.label}>
                  <label > <span style={{ color: 'red' }}>*</span>  Bottom </label>
                </div>
                <div class="field is-narrow">
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select value={form.kit_size_bottom} name='kit_size_bottom'>
                        <option disabled={form.kit_size_bottom && form.kit_size_bottom !== ''}></option>
                        <option value='80'>80</option>
                        <option value='85'>85</option>
                        <option value='90'>90</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* injuries */}
            <div className={classes.field} style={{ flex: '0.2' }}>
              <div className={classes.label}>
                <label > <span style={{ color: 'red' }}>*</span>  Do you have any injuries? </label>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select is-fullwidth">
                    <select value={form.injuries} name='injuries'>
                      <option disabled={form.injuries && form.injuries !== ''}></option>
                      <option value='yes'>Yes</option>
                      <option value='no'>No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {form.injuries === 'yes' && (
              <div className={classes.field}>
                <div className={classes.label}>
                  <label> Please let us know below </label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <textarea value={form.injuries_text} class="textarea" name='injuries_text'></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* allergies */}
            <div className={classes.field} style={{ flex: '0.2' }}>
              <div className={classes.label}>
                <label > <span style={{ color: 'red' }}>*</span>  Do you have any allergies? </label>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select is-fullwidth">
                    <select value={form.allergies} name='allergies'>
                      <option disabled={form.allergies && form.allergies !== ''}></option>
                      <option value='yes'>Yes</option>
                      <option value='no'>No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>


            {form.allergies === 'yes' && (
              <div className={classes.field}>
                <div className={classes.label}>
                  <label> Please let us know below </label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <textarea class="textarea" value={form.allergies_text} name='allergies_text'></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* others */}
            <div className={classes.field} style={{ flex: '0.2' }}>
              <div className={classes.label}>
                <label> <span style={{ color: 'red' }}>*</span>  Do you have any other concerning health conditions? </label>
              </div>
              <div class="field is-narrow">
                <div class="control">
                  <div class="select is-fullwidth">
                    <select value={form.others} name='others'>
                      <option disabled={form.others && form.others !== ''}></option>
                      <option value='yes'>Yes</option>
                      <option value='no'>No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>


            {form.others === 'yes' && (
              <div className={classes.field}>
                <div className={classes.label}>
                  <label> Please let us know below </label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <textarea class="textarea" value={form.others_text} name='others_text'></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}


            <div className={classes.field}>
              <div class="field-body">
                <div class="field">
                  <div class="control" className={classes.button}>
                    <Button onClick={() => history.goBack()} style={{ transform: 'translateX(-1rem', position: 'relative' }} color='primary' variant='outlined'>
                      Back
                  {isLoading && <CircularProgress size={30} className={classes.progress} />}
                    </Button>
                    <Button style={{ position: 'relative' }} type='submit' color='primary' variant='contained'>
                      Save
                  {isLoading && <CircularProgress size={30} className={classes.progress} />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {message && <Snackbar
            open={message}
            autoHideDuration={5000}
            onClose={closeSnackBar}>
            <Alert onClose={closeSnackBar} severity={Object.keys(message)[0]}>
              {message[Object.keys(message)[0]]}
            </Alert>
          </Snackbar>}

        </>

      )}


    </div>
  );
};

export default PostAppForm;