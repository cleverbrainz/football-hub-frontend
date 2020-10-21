import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Divider, Button } from '@material-ui/core'
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import DirectionsRunSharpIcon from '@material-ui/icons/DirectionsRunSharp';
import BusinessSharpIcon from '@material-ui/icons/BusinessSharp';
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100vw',
    paddingBottom: '30px'
  },
  section: {
    height: '100%',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
    },
  },
  whyJoin: {
    [theme.breakpoints.up('md')]: {
      width: '46%'
    },
  },
  whatYouGet: {
    [theme.breakpoints.up('md')]: {
      width: '46%'
    },
  },
  stats: {
    margin: '70px 0 30px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'space-evenly'
    },
  }
}))

const Join = () => {
  const classes = useStyles()


  return (
    <div className={classes.root}>
      <Typography style={{ margin: '50px 0', textAlign: 'center' }} component='div' >
        <Box
          fontSize={40} fontWeight="fontWeightBold" m={0}>
          Join Us
        </Box>
        Showcase your services to new potential customers
      </Typography>

      <section className={classes.section}>
        <div className={classes.whyJoin}>
          <Typography style={{ margin: '70px 0 30px 0' }} component='div' >
            <Box
              fontSize={25} fontWeight="fontWeightBold" m={0}>
              Why Join?
              </Box>
          </Typography>


          <p style={{ textAlign: "justify" }}>
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the
            more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature,
            discovered the undoubtable source.
          </p>

          <Typography component='div' >
            <Box
              fontSize={17} style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }} fontWeight="fontWeightBold" m={0}>
              <CheckCircleSharpIcon style={{ color: 'lightseagreen', marginRight: '20px' }} />
              Why join us reason 1
            </Box>
          </Typography>

          <Typography component='div' >
            <Box
              fontSize={17} style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }} fontWeight="fontWeightBold" m={0}>
              <CheckCircleSharpIcon style={{ color: 'lightseagreen', marginRight: '20px' }} />
              Why join us reason 2
            </Box>
          </Typography>

          <Typography component='div' >
            <Box
              fontSize={17} style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }} fontWeight="fontWeightBold" m={0}>
              <CheckCircleSharpIcon style={{ color: 'lightseagreen', marginRight: '20px' }} />
              Why join us reason 3
            </Box>
          </Typography>

          <Typography component='div' >
            <Box
              fontSize={17} style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }} fontWeight="fontWeightBold" m={0}>
              <CheckCircleSharpIcon style={{ color: 'lightseagreen', marginRight: '20px' }} />
              Why join us reason 4
            </Box>
          </Typography>



        </div>

        <div className={classes.whatYouGet}>
          <Typography style={{ margin: '70px 0 30px 0' }} component='div' >
            <Box
              fontSize={25} fontWeight="fontWeightBold" m={0}>
              What you get
              </Box>
          </Typography>

          <p style={{ textAlign: "justify" }}>
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the
            more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature,
            discovered the undoubtable source.
          </p>

          <Typography component='div' >
            <Box
              fontSize={17} style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }} fontWeight="fontWeightBold" m={0}>
              <CheckCircleSharpIcon style={{ color: 'lightseagreen', marginRight: '20px' }} />
              What you get reason 1
            </Box>
          </Typography>

          <Typography component='div' >
            <Box
              fontSize={17} style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }} fontWeight="fontWeightBold" m={0}>
              <CheckCircleSharpIcon style={{ color: 'lightseagreen', marginRight: '20px' }} />
              What you get reason 2
            </Box>
          </Typography>

          <Typography component='div' >
            <Box
              fontSize={17} style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }} fontWeight="fontWeightBold" m={0}>
              <CheckCircleSharpIcon style={{ color: 'lightseagreen', marginRight: '20px' }} />
              What you get reason 3
            </Box>
          </Typography>

          <Typography component='div' >
            <Box
              fontSize={17} style={{ display: 'flex', alignItems: 'center', margin: '30px 0' }} fontWeight="fontWeightBold" m={0}>
              <CheckCircleSharpIcon style={{ color: 'lightseagreen', marginRight: '20px' }} />
              What you get reason 4
            </Box>
          </Typography>

        </div>

      </section>

      <Divider style={{ width: '80%', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.2)', margin: '55px 0 30px 0' }} />

      <section style={{ width: '85%' }}>
        <Typography style={{ margin: '40px 0 15px 0', textAlign: 'center' }} component='div' >
          <Box
            fontSize={25} fontWeight="fontWeightBold" m={0}>
            Become part of the family
              </Box>
        </Typography>

        <Typography className={classes.stats} component='div' >
          <Box style={{ textAlign: 'center' }}
            fontSize={18} fontWeight="fontWeightBold" m={0}>
            <DirectionsRunSharpIcon style={{ fontSize: '32px', transform: 'translateY(5px)', marginRight: '6px' }} />
            100,000 players
              </Box>
          <Box style={{ textAlign: 'center' }}
            fontSize={18} fontWeight="fontWeightBold" m={0}>
            <BusinessSharpIcon style={{ fontSize: '32px', transform: 'translateY(5px)', marginRight: '6px' }} />
            5,000 companies
              </Box>
          <Box style={{ textAlign: 'center' }}
            fontSize={18} fontWeight="fontWeightBold" m={0}>
            <PeopleAltSharpIcon style={{ fontSize: '32px', transform: 'translateY(5px)', marginRight: '6px' }} />
            10,000 coaches
              </Box>
        </Typography>


      </section>

      <Divider style={{ width: '80%', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.2)', margin: '55px 0 30px 0' }} />

      <Typography style={{ textAlign: 'center' }} component='div' >
        <Box
          fontSize={25} fontWeight="fontWeightBold" m={5}>
          From only £20 a month
              </Box>
        <Link to='/register'>
          <Button
            className={classes.button}
            variant="contained" color="primary">
            Sign up today
        </Button>
        </Link>

      </Typography>
    </div>
  );
};

export default Join;