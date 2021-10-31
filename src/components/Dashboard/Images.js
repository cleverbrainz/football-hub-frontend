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
    width: '85%',
    margin: '0 auto'
  },
  imageContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  frame: {
    width: '22%',
    minWidth: '240px',
    margin: '15px',
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

const Images = ({ history }) => {
  const classes = useStyles();
  const [user, setUser] = useState()
  const input = useRef()
  const [emptyImageSlots, setEmptyImageSlots] = useState([])
  const [dataChange, setDataChange] = useState(false)

  useEffect(() => updateUser(), [!dataChange])


  function updateUser() {
    axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        const emptyImageSlots = []
        for (let i = 0; i < 8 - res.data[0].images.length; i++) {
          emptyImageSlots.push(1)
        }
        setUser(res.data[0])
        setEmptyImageSlots(emptyImageSlots)
      })
      .catch(err => console.log(err))
  }


  const HandleChange = (e) => {
    setDataChange(true)
    const image = e.target.files
    const picture = new FormData()
    picture.append('owner', auth.getUserId())
    picture.append('picture', image[0], image[0].name)

    axios.post(`/user/${auth.getUserId()}/image`,
      picture, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => setDataChange(false))
      .catch(err => {
        setDataChange(false)
      })
  }

  const HandleDelete = (e) => {
    setDataChange(true)
    if (e.target.tagName === 'path') e.target = e.target.parentNode

    axios.delete(`/user/image/${e.target.id}/`, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        // console.log(res.data)
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

      </form>

      {dataChange && <CircularProgress size={100} className={classes.progress} />}
    </div>

  );
};

export default Images;