import React, { useState, useEffect } from 'react';
import Join from '././EditJoin'
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Button, TextField } from "@material-ui/core";
import axios from 'axios'


const useStyles = makeStyles((theme) => ({
  root: {
    height: window.innerHeight - 80,
    display: 'flex'
  },
  joinComponent: {
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
    overflowY: 'scroll',
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
    margin: '10px auto',
    width: '100%'
  }
}));

const PopulateWhyJoin = () => {
  const classes = useStyles();

  const [dataChange, setDataChange] = useState(false)
  const [form, setForm] = useState({
    whyJoin: {
      mainText: '',
      reasons: ['', '', '', '']
    },
    whatYouGet: {
      mainText: '',
      reasons: ['', '', '', '']
    }

  })


  useEffect(() => {
    axios.get('/admin/PGkp8RJmn6XA9uBv5dPg')
      .then(res => {
        // console.log(res.data)
        if (res.data.whyJoin) setForm({ ...form, ...res.data });
      })
      .catch(err => console.log(err))
  }, [!dataChange])


  function handleFormSubmit(e) {
    e.preventDefault()
    console.log(form)
    setDataChange(true)

    axios.post('/admin/PGkp8RJmn6XA9uBv5dPg', form)
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
      <div className={classes.joinComponent}>
        <Join form={form} />
      </div>
      <div className={classes.componentEdit}>
        <Typography style={{ margin: '20px 0' }} component='div' >
          <Box style={{ textAlign: 'center' }}
            fontSize={25} fontWeight="fontWeightBold" m={0}>
            Edit Join us page
          </Box>
        </Typography>

        <form
          autoComplete="off"
          onSubmit={(e) => handleFormSubmit(e)}
          className={classes.form}>

          <TextField className={classes.inputs} id="outlined-basic"
            value={form.whyJoin.mainText}
            onChange={(e) => setForm({ ...form, whyJoin: { ...form.whyJoin, mainText: e.target.value } })}
            label="What Join Main Text"
            variant="outlined"
            multiline
            rows={5}
            name='mainText' />

          {form.whyJoin.reasons.map((el, i) => {
            return (
              <TextField className={classes.inputs}
                onChange={(e) => {
                  const { reasons } = form.whyJoin
                  const arr = [...reasons]
                  arr[i] = e.target.value
                  setForm({ ...form, whyJoin: { ...form.whyJoin, reasons: arr } })
                }}
                id="outlined-basic"
                value={form.whyJoin.reasons[i]}
                label={`Why Join Reason ${i + 1}`}
                variant="outlined" />
            )
          })}

          <TextField className={classes.inputs} id="outlined-basic"
            value={form.whatYouGet.mainText}
            onChange={(e) => setForm({ ...form, whatYouGet: { ...form.whatYouGet, mainText: e.target.value } })}
            label="Why You Get Main Text"
            variant="outlined"
            multiline
            rows={5}
            name='mainText' />

          {form.whatYouGet.reasons.map((el, i) => {
            return (
              <TextField className={classes.inputs}
                onChange={(e) => {
                  const { reasons } = form.whatYouGet
                  const arr = [...reasons]
                  arr[i] = e.target.value
                  setForm({ ...form, whatYouGet: { ...form.whatYouGet, reasons: arr } })
                }}
                id="outlined-basic"
                value={form.whatYouGet.reasons[i]}
                label={`What You Get Reason ${i + 1}`}
                variant="outlined" />
            )
          })}

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

export default PopulateWhyJoin;