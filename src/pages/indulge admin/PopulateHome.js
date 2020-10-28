import React, { useState, useEffect } from 'react';
import Home from '././EditHome'
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Button, TextField } from "@material-ui/core";
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: window.innerHeight - 80,
    display: 'flex'
  },
  homeComponent: {
    maxWidth: '50%',
    border: '1.5px black solid',
    height: '100%',
    resize: 'horizontal',
    overflow: 'auto',
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block'
    }
  },
  componentEdit: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50%'
    }
  },
  form: {
    width: '60%',
    [theme.breakpoints.up('md')]: {
      width: '80%'
    },
    margin: '0 auto'
  },
  inputs: {
    margin: '20px auto',
    width: '100%'
  }
}));



const PopulateHome = () => {
  const classes = useStyles();

  const [form, setForm] = useState({
    pathwayBox: '',
    adviceBox: '',
    lookingForBox: ''
  })

  const [dataChange, setDataChange] = useState(false)


  useEffect(() => {
    axios.get('/admin/RwlT9uMWhORyHNNQOell')
      .then(res => {
        // console.log(res.data)
        if (res.data.pathwayBox) setForm({ ...form, ...res.data });
      })
      .catch(err => console.log(err))
  }, [!dataChange])

  function handleFormChange(e) {
    const { name, value } = e.target
    // console.log(name, value)
    setForm({ ...form, [name]: value })
  }


  function handleFormSubmit(e) {
    e.preventDefault()
    setDataChange(true)

    axios.post('/admin/RwlT9uMWhORyHNNQOell', form)
      .then(res => {
        console.log(res.data)
        setDataChange(false)
      })
      .catch(err => {
        console.log(err)
        setDataChange(false)
      })

  }

  return (
    <div className={classes.root}>

      <div className={classes.homeComponent}>
        <Home form={form} />
      </div>
      <div className={classes.componentEdit}>
        <Typography style={{ margin: '20px 0' }} component='div' >
          <Box style={{ textAlign: 'center' }}
            fontSize={25} fontWeight="fontWeightBold" m={0}>
            Edit Homepage
          </Box>
        </Typography>

        <form
          autoComplete="off"
          onChange={(e) => handleFormChange(e)}
          onSubmit={(e) => handleFormSubmit(e)}
          className={classes.form}>

          <TextField className={classes.inputs} id="outlined-basic"
            value={form.pathwayBox}
            label="Pathway Edit"
            variant="outlined"
            multiline
            rows={4}
            name='pathwayBox' />

          <TextField className={classes.inputs} id="outlined-basic"
            value={form.adviceBox}
            label="Advice Edit"
            variant="outlined"
            multiline
            rows={4}
            name='adviceBox' />

          <TextField className={classes.inputs} id="outlined-basic"
            value={form.lookingForBox}
            label="Looking For Edit"
            variant="outlined"
            multiline
            rows={4}
            name='lookingForBox' />

          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Save changes
        </Button>

        </form>
      </div>
    </div>
  );
};

export default PopulateHome;