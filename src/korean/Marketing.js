import React, { useState, useEffect } from 'react';
import languages from './LanguageSkeleton'
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
  jumbotron: {
    minHeight: '55vh',
    margin: '55px 0',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
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
    height: '55vh',
    [theme.breakpoints.up('md')]: {
      width: '45%',
    },
  },
  list: {
    margin: '13px 0',
    listStyleType: 'circle'
  },
  subsection: {
    width: '100%',
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 40,
    [theme.breakpoints.up('md')]: {
      width: '80%',
    },
  },
  cardContainer: {
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    height: '85%',
    justifyContent: 'space-around',
    alignContent: 'space-evenly'
  },
  card: {
    minWidth: 220,
    width: '23%'
  },
  campCardContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
  },
  campCard: {
    height: '35vh',
    width: '30%',
    position: 'relative'
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



  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Typography component='div' >
          <Box
            fontSize={35} fontWeight="fontWeightBold" m={0}>
            {mainTitle}
          </Box>
        </Typography>

        <div className={classes.jumbotron}>
          <img className={classes.media}
            src="https://images.unsplash.com/photo-1529153348965-3de49b6188bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />

          <section className={classes.jumbotronText}>
            <Typography component='div' >
              <Box
                fontSize={28} fontWeight="fontWeightRegular" m={0}>
                {headerMain}
              </Box>
            </Typography>

            <p> {headerParagraph} </p>

            <ul>
              <li className={classes.list}> {headerList} </li>
              <li className={classes.list}> {headerList} </li>
              <li className={classes.list}> {headerList} </li>
              <li className={classes.list}> {headerList} </li>
            </ul>
          </section>
        </div>
      </main>

      <section className={classes.subsection}>
        <Typography component='div'>
          <Box
            style={{ color: 'orange' }}
            fontSize={14} fontWeight="fontWeightBold" m={0}>
            {subSectionHeaders[0]}
          </Box>
          <Box
            style={{ margin: '10px 0 15px 0' }}
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            {subSectionHeaders[1]}
          </Box>
          <Box
            fontSize={16} fontWeight="fontWeightRegular" m={0}>
            {subSectionHeaders[2]}
          </Box>
        </Typography>

        <div className={classes.cardContainer}>
          {subSectionCards.map(el => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {el.title}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {el.paragraph}
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
            {subSectionCampsTitle}
          </Box>
        </Typography>

        <div className={classes.campCardContainer}>
          {subSectionCampsCards.map(el => {
            return (
              <Card variant="outlined" className={classes.campCard}>
                <CardContent className={classes.campCardTextContainer}>
                  <Typography variant="h6" component="h2">
                    {el.age}
                  </Typography>
                  <Typography
                    className={classes.campCardText}
                    variant="body2" component="p">
                    <EventSharpIcon
                      style={{ marginRight: '15px' }} /> {el.date}
                  </Typography>
                  <Typography
                    className={classes.campCardText}
                    variant="body2" component="p">
                    <ScheduleSharpIcon
                      style={{ marginRight: '15px' }} /> {el.days}
                  </Typography>
                  <Typography
                    className={classes.campCardText}
                    variant="body2" component="p">
                    <RoomSharpIcon
                      style={{ marginRight: '15px' }} /> {el.location}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    onClick={() => history.push('/apply')}
                    endIcon={<ArrowForwardIcon />}>
                    {subSectionCampsCardButton}
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