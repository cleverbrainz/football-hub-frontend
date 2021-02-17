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
    minHeight: 250,
    backgroundColor: '#f1f1f1',
    textAlign: 'left',
    [theme.breakpoints.up('md')]: {
      width: '30%',
      margin: '0',
      minHeight: 180,
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



  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Typography 
        className={classes.title}
        component='div' >
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

            {/* <p> {headerParagraph} </p> */}

            <p>
              Indulge football are proud to host Benfica FC and to welcome them for the very first time
              to South Korea. We have partnered with Benfica to create Korea's first elite football talent identification
              camp experience.
            </p>

            <p>
              Indulge football has created the perfect expereince for football players aged between 15-18 to experience
        a gret methodology from the world famous and award-winning Benfica FC Academy. Benfica will be selecting players from each age grou[ for an
        all-expenses paid 2 week professional trial at the Benfica Campus in Portugal.
            </p>
          </section>
        </div>
      </main>

      <section className={classes.subsection}>
        <Typography component='div'>
          <Box
            style={{ margin: '10px 0 15px 0' }}
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            Why apply to the project?
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
                  <Typography
                    style={{ marginBottom: '20px' }}
                    variant="h6" component="h6">
                    Be one of the first
                  </Typography>
                  <Typography variant="body2" component="p">
                    This is the first footballing experience in Korea which guarantees the opportunity for a professional
                    trial in Portugal with Benfica FC following a successful..
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
            About the Camp
          </Box>
        </Typography>

        <div className={classes.jumbotron}>
        
          <section className={classes.jumbotronText}>
        
            <Typography component='div' >
              <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                What can you expect?
              </Box>

              <ul>
                <li className={classes.list}> 4 nights' accommodation in a 4* hotel. Choice of single or twin room </li>
                <li className={classes.list}> Full board menu designed for professional athletes </li>
                <li className={classes.list}> At least 4 hours of football coaching a day </li>
                <li className={classes.list}> 3 football education seminars across the camp </li>
                <li className={classes.list}> Official Benfica FC & Indulge Football training kit including tracksuit, wet top, and 2 x shirt, shorts and socks </li>
                <li className={classes.list}> Individual player feedback reports </li>
                <li className={classes.list}> Benfica FC completion certificate</li>
                <li className={classes.list}> Individual player performance tracking technology </li>
                <li className={classes.list}> Transfers between hotel and training ground </li>
                <li className={classes.list}> COVID-19 testing </li>
                <li className={classes.list}> Sports insurance </li>
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
            About Benfica FC
          </Box>
        </Typography>

        <div className={classes.jumbotron}>
          
        <img className={classes.media}
            src="https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />
          <section className={classes.jumbotronText} >
            <Typography component='div' >
              <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                The Methodology
              </Box>

              <p>
                The methodology applied in Project Football will be the same that Sport
  Lisboa e Benfica uses in the training of its athletes, and which guarantees the
  sustainability of its professional squads. Through specific training that Sport Lisboa e
  Benfica will provide, you will be able to develop your technical, tactical, physical and
  psychological skills. Aspects like, running technique, relationship with the ball, tactical
  circulation and attacking and defensive game principles will be worked on a daily basis
  in both individual and collective contexts.
            </p>

              <p>
                The training schedules will be developed by SL Benfica's coaches, accredited by
    the Federação Portuguesa de Futebol (FPF) and UEFA. There will be 3 categories
    (U16 to U18), each having specific technical-tactical training. In addition, you will
    also be observed and evaluated by Sport Lisboa e Benfica's Technical and Scouting
    Departments.
            </p>
            </Typography>
          </section>
          
        </div>

        <div className={classes.jumbotron}>
       

          <section className={classes.jumbotronText}>
            <Typography component='div' >
              <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                The Coaches
              </Box>

              <p>
                Accredited by the Portuguese Football Federation (FPF) and UEFA, the SL Benfica
  coaches are decisive elements in the development of the Club's young athletes. It will
  be them following your evolution during Project Football. The technical director in
  charge will be Pedro Marques:
            </p>

              <p>
                UEFA A Licence
  Graduated in Physical Education and Sports Science at the Faculty of Human Kinetics
  in Lisbon. Post-Graduation in High-Performance Training at the Faculty of Human Kinetics in
  Lisbon. Technical Director of Sport Lisboa e Benfica's Youth Football.
            </p>
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
            How to apply?
          </Box>
          <Box
        className={classes.campSubText}
            fontSize={16} fontWeight="fontWeightRegular" m={0}>
            All players will need to apply for this experience via ftballer.com. You will create your own player profile
            and will asked to complete several football related challenges as part of your assessment. Your profile will then
            be assessed by the UEFA coaches from EPL Academies and senior staff from NYSES. Successful applicats will then be
            invited into camp.
          </Box>
          <Box
            fontSize={16} fontWeight="fontWeightBold" m={0}>
            Select your age group and apply
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