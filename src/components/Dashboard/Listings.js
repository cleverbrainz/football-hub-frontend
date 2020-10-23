import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  TextField,
  Button,
  CircularProgress
} from '@material-ui/core'
import AddCircleSharpIcon from '@material-ui/icons/AddCircleSharp';
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import { useEffect } from 'react';
import axios from 'axios'
import auth from '../../lib/auth'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: window.innerHeight - 80,
    position: 'relative',
    padding: '50px 0'
  },
  form: {
    // display: 'flex',
    // justifyContent: 'space-between',
    // alignContent: 'space-between',
    width: '85%',
   margin: '0 auto'
    // minHeight: '100%',
    // flexWrap: 'wrap'
  },
  input: {
    width: '100%',
    marginBottom: '15px'
  },
  inputTwo: {
    width: '47.5%',
  },
  subContainer: {
    width: '100%',
    display: 'flex',
    // flexDirection: 'column'
    justifyContent: 'space-around'
  },
  button: {
    width: '20%',
    height: '5%'
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  frame: {
    width: '20%',
    minWidth: '240px',
    margin: '20px',
    height: '230px',
    border: 'solid black 1px',
    backgroundColor: '#dedede',
    position: 'relative'
  },
  images: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  icons: {
    position: 'absolute',
    color: '#EF5B5B',
    top: '-4%',
    right: '-3%',
    fontSize: '28px',
    '&:hover': {
      cursor: 'pointer',
    }
  },
  progress: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },


}));

const Listings = ({ history }) => {
  const classes = useStyles();
  const [user, setUser] = useState()
  const input = useRef()
  const [emptyImageSlots, setEmptyImageSlots] = useState([])
  const [dataChange, setDataChange] = useState(false)
  const [form, setForm] = useState({
    bio: '',
    reasons_to_join: []
  })

  const { bio, reasons_to_join } = form

  useEffect(() => updateUser(), [!dataChange])

  function handleFormSubmit(e) {
    e.preventDefault()
    setDataChange(true)

    axios.post(`/user/${auth.getUserId()}`, form, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res.data)
        setDataChange(false)
      })
      .catch(err => {
        console.error(err)
        setDataChange(false)
      })

  }

  function updateUser() {
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        const { bio, reasons_to_join } = res.data[0]
        setUser(res.data[0])
        setForm({
          ...form,
          bio,
          reasons_to_join
        })
        const slotNumbers = []
        for (let i = 0; i < 8 - res.data[0].images.length; i++) {
          slotNumbers.push(1)
        }
        setEmptyImageSlots(slotNumbers)
      })
  }


  const HandleChange = (e) => {
    setDataChange(true)
    const image = e.target.files
    const picture = new FormData()
    picture.append('owner', auth.getUserId())
    picture.append('picture', image[0], image[0].name)

    axios.post(`/user/${auth.getUserId()}/image`, picture, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => setDataChange(false))
      .catch(err => {
        console.error(err)
        setDataChange(false)
      })
  }

  const HandleDelete = (e) => {
    setDataChange(true)
    if (e.target.tagName === 'path') e.target = e.target.parentNode

    axios.delete(`/user/image/${e.target.id}/`, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        console.log(res.data)
        setDataChange(false)
      })
      .catch(err => {
        console.error(err)
        setDataChange(false)
      })
  }

  return (
    <div className={classes.root}>
      <form
        className={classes.form}>
        <div className={classes.subContainer}>

          <FormControl className={classes.inputTwo} variant="outlined">
            <TextField id="outlined-basic"
              type='text'
              autoComplete='off'
              variant="outlined"
              multiline
              rows={10}
              inputProps={{
                maxLength: 750,
              }}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              helperText={`${bio.split('').length}/750`}
              label='Write about the company?'
            />
          </FormControl>


          <div>
            {reasons_to_join.map((el, i) => {
              return (
                <FormControl className={classes.input} variant="outlined">
                  <TextField id="outlined-basic"
                    type='text'
                    key={i}
                    value={form.reasons_to_join[i]}
                    autoComplete='off'
                    variant="outlined"
                    inputProps={{
                      maxLength: 75,
                    }}
                    onChange={(e) => {
                      const arr = [...reasons_to_join]
                      arr[i] = e.target.value
                      setForm({ ...form, reasons_to_join: arr })
                    }}
                    helperText={`${reasons_to_join[i].split('').length}/75  `}
                    label='A reason to join the company'
                  />
                </FormControl>
              )
            })}
            {reasons_to_join.length < 3 && <Button
              variant="contained" color="primary"
              onClick={() => {
                if (reasons_to_join.length < 3) {
                  setForm({ ...form, reasons_to_join: [...reasons_to_join, ''] })
                }
              }}>
              Add another reason
          </Button>}
          </div>


        </div>



        <section className={classes.imageContainer}>

          <input ref={input} style={{ display: 'none' }} onChange={(e) => HandleChange(e)} type="file" />

          {user && user.images.map((el, i) => {
            return (
              <div className={classes.frame} key={i} >
                <CancelSharpIcon id={i} className={classes.icons} onClick={(e) => HandleDelete(e)} />
                <img className={classes.images} src={el} alt="" />
              </div>
            )
          })}


          {emptyImageSlots && emptyImageSlots.map((el, i) => {
            return (
              <div key={i} className={classes.frame}>
                <AddCircleSharpIcon className={classes.icons} onClick={() => input.current.click()} />
              </div>
            )
          })}
        </section>

        <Button
          onClick={(e) => handleFormSubmit(e)}
          className={classes.button}
          variant="contained" color="primary">
          Save
          </Button>

        <Button
          onClick={() => history.push('/companyDashboard')}
          className={classes.button}
          variant="contained" color="primary">
          Back
          </Button>

      </form>

      {dataChange && <CircularProgress size={100} className={classes.progress} />}
    </div>

  );
};

export default Listings;