import React, { useState, useEffect } from 'react';
import { languages, marketing } from './LanguageSkeleton'
import {
  Typography,
  Grid,
  Fab,
  Box,
  Switch,
  Card,
  CardActions,
  CardContent,
  Button
} from "@material-ui/core";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import HomeNav from '../components/Navbars/HomeNav'
import StarsSharpIcon from '@material-ui/icons/StarsSharp';
import EventSharpIcon from '@material-ui/icons/EventSharp';
import ScheduleSharpIcon from '@material-ui/icons/ScheduleSharp';
import RoomSharpIcon from '@material-ui/icons/RoomSharp';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  main: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '120px',
    [theme.breakpoints.up('md')]: {
      width: '80%',
    },
  },
  title: {
    margin: '40px'
  },
  jumbotron: {
    minHeight: '50vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:nth-of-type(2)': {
      margin: '20px 0',

    },
    '&:nth-of-type(3)': {
      margin: '0',
      flexDirection: 'column-reverse'
    },
    // '&:nth-of-type(2)': {
    //   flexDirection: 'column-reverse'
    // },

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      '&:nth-of-type(3)': {
        flexDirection: 'row'
      },
    },

  },
  media: {
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '49%',
    },
  },
  jumbotronText: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '50vh',
    [theme.breakpoints.up('md')]: {
      width: '45%',
    },
    textAlign: 'initial'
  },
  list: {
    margin: '5px 0',
    listStyleType: 'circle'
  },
  subsection: {
    width: '100%',
    minHeight: '75vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 40,
    '&:nth-of-type(1)': {
      minHeight: '60vh',
    },

    [theme.breakpoints.up('md')]: {
      width: '80%',
      '&:nth-of-type(1)': {
        minHeight: '75vh',
      },
    },
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'nowrap',
    width: '100%',
    overflow: 'scroll',
    padding: '0 20px',
    flex: 1,
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      alignContent: 'space-evenly',
      flexWrap: 'wrap',
      height: '100%',
      justifyContent: 'space-around',
    },
  },
  card: {
    minWidth: 320,
    width: '80%',
    margin: '0 15px',
    minHeight: 230,
    backgroundColor: '#f1f1f1',
    textAlign: 'left',
    [theme.breakpoints.up('md')]: {
      width: '30%',
      margin: '0',
      minHeight: 200,
      minWidth: 220,
    },
  },
  campCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  campCard: {
    height: '30vh',
    width: '80%',
    position: 'relative',
    margin: '20px 0',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
    },
    [theme.breakpoints.up('md')]: {
      width: '30%',

    },

  },
  campCardTextContainer: {
    height: '80%'
  },
  campCardText: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 30px'
  },
  button: {
    position: 'absolute',
    bottom: '4%',
    right: '3%'

  },
  campSubText: {
    width: '80%',
    margin: '10px auto 40px auto',
    textAlign: 'initial',
    [theme.breakpoints.up('md')]: {
      width: '90%',
      textAlign: 'center',
    },

  }
}));

const Marketing = (props) => {
  const classes = useStyles()
  const { locale, history } = props

  const {
    mainTitle,
    headerMain,
    headerParagraph,
    headerList,
    subSectionHeaders,
    subSectionCards,
    subSectionCampsTitle,
    subSectionCampsCards,
    subSectionCampsCardButton
  } = languages[locale].marketingPage



  useEffect(() => {
    console.log(marketing)
  }, [])


  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Typography
          className={classes.title}
          component='div' >
          <Box
            fontSize={35} fontWeight="fontWeightBold" m={0}>
            {marketing[1][locale]}
          </Box>
        </Typography>

        <div className={classes.jumbotron}>
          <img className={classes.media}
            src="https://images.unsplash.com/photo-1529153348965-3de49b6188bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />

          <section className={classes.jumbotronText}>
            <Typography component='div' >
              <Box
                fontSize={28} fontWeight="fontWeightRegular" m={0}>
                {marketing['2a'][locale]}
              </Box>
            </Typography>

            <p>
              {marketing['2b'][locale].split('/')[0]}
            </p>

            <p>
              {marketing['2b'][locale].split('/')[1]}
            </p>
          </section>
        </div>
      </main>

      <section className={classes.subsection}>
        <Typography component='div'>
          <Box
            style={{ margin: '10px 0 15px 0' }}
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            {marketing['3a'][locale]}
          </Box>
          <Box
            fontSize={16} fontWeight="fontWeightRegular" m={0}>
            {marketing['3b'][locale]}
          </Box>
        </Typography>

        <div className={classes.cardContainer}>
          {[{ ...marketing['4a'] }, { ...marketing['4b'] }, { ...marketing['4c'] },
          { ...marketing['4d'] }, { ...marketing['4e'] }, { ...marketing['4f'] }].map(el => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  <Typography
                    style={{ marginBottom: '20px' }}
                    variant="h6" component="h6">
                    {el[locale].split('/')[0]}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {el[locale].split('/')[1]}
                  </Typography>
                </CardContent>
                <CardActions>
                  <StarsSharpIcon />
                </CardActions>
              </Card>
            )
          })}
        </div>

      </section>

      <section className={classes.subsection}>
        <Typography style={{ marginBottom: '25px' }} component='div'>
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            {marketing['5a'][locale]}
          </Box>
        </Typography>

        <div className={classes.jumbotron}>

          <section className={classes.jumbotronText}>

            <Typography component='div' >
              <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                {marketing['5b'][locale]}
              </Box>

              <ul>
                {marketing['5c'][locale].split('.').map(sentence => {
                  return <li className={classes.list}> {sentence} </li>
                })}
              </ul>
            </Typography>
          </section>
          <img className={classes.media}
            src="https://images.unsplash.com/photo-1493662404096-9ecc84ebba6b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80" alt="" />
        </div>
      </section>

      <section className={classes.subsection}>
        <Typography style={{ marginBottom: '25px' }} component='div'>
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            {marketing['6a'][locale]}
          </Box>

          <Box
            className={classes.campSubText}
            fontSize={16} fontWeight="fontWeightRegular" m={0}>
            {marketing['6b'][locale]}
          </Box>
        </Typography>

        <div className={classes.jumbotron}>

          <img className={classes.media}
            src="https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />
          <section className={classes.jumbotronText} >
            <Typography component='div' >
              <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                {marketing['6c'][locale]}
              </Box>

              <p>
                {marketing['6d'][locale].split('/')[0]}
              </p>
              <br />
              <p>
                {marketing['6d'][locale].split('/')[1]}
              </p>

            </Typography>
          </section>

        </div>

        <div className={classes.jumbotron}>


          <section className={classes.jumbotronText}>
            <Typography component='div' >
              <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                {marketing['6e'][locale]}
              </Box>

              <p>
                {marketing['6f'][locale]}
              </p>
              <br />
              <ul>
                {marketing['6g'][locale].split('.').map(sentence => {
                  return <li className={classes.list}> {sentence} </li>
                })}
              </ul>

            </Typography>
          </section>

          <img className={classes.media}
            src="https://images.unsplash.com/photo-1431440869543-efaf3388c585?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />

        </div>

      </section>

      <section className={classes.subsection}>
        <Typography style={{ marginBottom: '25px' }} component='div'>
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            {marketing['7a'][locale]}
          </Box>
          <Box
            className={classes.campSubText}
            fontSize={16} fontWeight="fontWeightRegular" m={0}>
            {marketing['7b'][locale]}
          </Box>
          <Box
            fontSize={16} fontWeight="fontWeightBold" m={0}>
            {marketing['7c'][locale]}
          </Box>
        </Typography>

        <div className={classes.campCardContainer}>

          {[{ ...marketing['7d'] }, { ...marketing['7e'] },
          { ...marketing['7f'] }].map(el => {
            return (
              <Card variant="outlined" className={classes.campCard}>
                <CardContent className={classes.campCardTextContainer}>
                  <Typography variant="h6" component="h2">
                    {el[locale].split('.')[0]}
                  </Typography>
                  <Typography
                    className={classes.campCardText}
                    variant="body2" component="p">
                    <EventSharpIcon
                      style={{ marginRight: '15px' }} />  {el[locale].split('.')[1]}
                  </Typography>
                  
                  {locale === 'en' &&
                    <Typography
                      className={classes.campCardText}
                      variant="body2" component="p">
                      <ScheduleSharpIcon
                        style={{ marginRight: '15px' }} />  {el[locale].split('.')[2]}
                    </Typography>}

                  <Typography
                    className={classes.campCardText}
                    variant="body2" component="p">
                    <RoomSharpIcon
                      style={{ marginRight: '15px' }} /> {el[locale].split('.')[locale === 'en' ? 3 : 2]}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    onClick={() => history.push('/authentication')}
                    endIcon={<ArrowForwardIcon />}>
                    {el[locale].split('.')[locale === 'en' ? 4 : 3]}
                  </Button>
                </CardActions>
              </Card>
            )
          })}
        </div>
      </section>

    </div>
  );
};

export default Marketing;