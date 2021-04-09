import React, { useState, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { ReactComponent as SoccerLogo } from './soccer.svg';
import { ReactComponent as FitnessLogo } from './fitness.svg';
import { ReactComponent as CareerLogo } from './career.svg';
import { ReactComponent as FormLogo } from './form.svg';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import FlightTakeoffSharpIcon from '@material-ui/icons/FlightTakeoffSharp';
import AssignmentSharpIcon from '@material-ui/icons/AssignmentSharp';
import { tabs, buttons, marketing,  } from './LanguageSkeleton'
import StarsSharpIcon from '@material-ui/icons/StarsSharp';
import EventSharpIcon from '@material-ui/icons/EventSharp';
import ScheduleSharpIcon from '@material-ui/icons/ScheduleSharp';
import RoomSharpIcon from '@material-ui/icons/RoomSharp';
import ArrowForwardSharpIcon from '@material-ui/icons/ArrowForwardSharp';
import ContactlessRoundedIcon from '@material-ui/icons/ContactlessRounded'
import RateReviewRoundedIcon from '@material-ui/icons/RateReviewRounded';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import SportsSoccerRoundedIcon from '@material-ui/icons/SportsSoccerRounded';
import {
  Typography,
  Grid,
  Fab,
  Box,
  Button,
  Switch,
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Backdrop,
  Modal,
  Fade,
  Chip
} from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  typography__size__1: {
    fontSize: '1.5rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  },
  typography__size__2: {
    fontSize: '0.9rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  },
  typography__size__3: {
    fontSize: '1.35rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1.5625rem',
    },
  },
  root: {
    width: '100vw',
    height: '100vh',
    margin: '0 auto',
  },
  jumbotron: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f8f8f8',
    padding: '8.5rem 10% 0',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '4rem 10% 0',
    },
  },
  jumbotron__textContainer: {
    width: '90vw',
    [theme.breakpoints.up('md')]: {
      width: '50vw',
    },
  },
  secondarySections: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '4rem 10%',
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row-reverse',
      padding: '6rem 10%',
    },
  },
  secondarySections__textContainer: {
    width: '90vw',
    marginBottom: '3rem',
    [theme.breakpoints.up('md')]: {
      width: '40vw',
      marginBottom: '0rem',
    },
  },
  iconsSectionContainer: {
    width: '80%',
    margin: '0 auto',
    padding: '4rem 0'
  },
  iconsSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row'
    },
  },
  iconsSection__icons: {
    fontSize: '2.5rem',
    display: 'block',
    color: '#71959E',
    margin: '0.75rem auto',
    [theme.breakpoints.up('md')]: {
      fontSize: '3rem',
    },
  },
  iconsSection__desc: {
    fontSize: '0.8rem',
    textAlign: 'center',
    flex: 1,
    marginBottom: '1.5rem',
    [theme.breakpoints.up('md')]: {
      "&:not(:last-child)": {
        borderRight: '1px solid grey',
        fontSize: '0.875rem',
      }
    },

  },
  campCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '60%',
    minHeight: '60vh',
    margin: '0 auto 5rem',
    [theme.breakpoints.up('sm')]: {
      width: '80%',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      width: '80%',
    },
  },
  campCard: {
    position: 'relative',
    padding: '0.75rem 1rem',
    borderRadius: '0.7rem',
    margin: '1rem 0',
    [theme.breakpoints.up('sm')]: {
      width: '50%',
      margin: '1rem 0'
    },
    [theme.breakpoints.up('md')]: {
      width: '27%'
    },
  },
  campCard__icons: {
    color: '#71959E',
    fontSize: '1.1rem',
    transform: 'translateY(-0.1rem)',
  },
  campCard__media: {
    transform: 'translateX(-1rem)',
    opacity: 0.9
  },
  campCard__chip: {
    marginRight: '0.9rem',
    fontSize: '0.8125rem',
    marginBottom: '0.1rem',
    border: 'none',
    transform: 'translateX(-0.2rem)'

  },
  campCard__button: {
    borderRadius: 0,
    position: 'absolute',
    right: 0,
    bottom: '1.75rem',
    padding: '0.5rem 1.75rem',
    fontSize: '12px',
  },
  button: {
    fontSize: '0.75rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '0.875rem',
    },
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'scroll',
    width: '90%',
    margin: '1.5rem auto',
    fontSize: '0.75rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '0.875rem',
    },
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    padding: '0 1.5rem',
    minWidth: '15rem'
  },
  steps__icons: {
    fontSize: '2rem',
    color: '#71959E',
    marginBottom: '0.5rem'
  },
  tabContainer: {
    userSelect: 'none',
    width: '90%',
    margin: '0 auto',
    height: '4rem',
    [theme.breakpoints.up('sm')]: {
      width: '40em',
    },
    [theme.breakpoints.up('md')]: {
      width: '40em',
    },
  },
  tabs: {
    width: '7rem',
    height: '4rem',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    [theme.breakpoints.up('md')]: {
      width: '6em',
    },
  },
  tabPanel: {
    width: '80%',
    margin: '0 auto'
  },
  tabOne__listItems: {
    listStyleType: 'circle',
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  },
  tabOne__applyCardContainer: {
    display: 'flex',
    minHeight: '0vh',
    alignContent: 'space-evenly',
    overflow: 'scroll',
    padding: '1rem 0',
    marginBottom: '2rem',
    [theme.breakpoints.up('md')]: {
      minHeight: '60vh',
      justifyContent: 'space-around',
      flexWrap: 'wrap'
    },
  },
  tabOne__applyCard: {
    width: '30%',
    minWidth: '20rem',
    margin: '0 2rem',
    padding: '0rem',
    [theme.breakpoints.up('md')]: {
      margin: '1rem 0',
      padding: '0.5rem',
    },
  },
  tabOne__cta: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabTwo__container: {
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '2rem',
    "&:nth-of-type(2)": {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      "&:nth-of-type(2)": {
        flexDirection: 'row',
      },
    },
  },
  tabTwo__text: {
    width: '95%',
    margin: '2rem 0',
    [theme.breakpoints.up('md')]: {
      width: '45%',
      margin: 0
    },
  },
  tabTwo__images: {
    width: '100%',
    objectFit: 'cover',
    height: '70vh',
    [theme.breakpoints.up('md')]: {
      width: '30%',
    },
  },
  tabTwo__list: {
    listStyleType: 'circle',
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  },
  tabThree__container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: '0 0 2rem',
    "&:nth-of-type(2)": {
      flexDirection: 'column-reverse',
      marginBottom: '7rem',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      margin: '6rem 0',
      "&:nth-of-type(2)": {
        flexDirection: 'row',

      },
    },
  },
  tabThree__coachContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'scroll'
  },
  tabThree_coachCard: {
    width: '30%',
    minWidth: '15rem',
    padding: '0',
    margin: '0 1rem',
    "&:hover": {
      cursor: 'pointer',
      "& img": {
        transform: 'scale(1.1)',
        transition: 'transform 0.2s',
      }

    },
    [theme.breakpoints.up('md')]: {
      padding: '0 3rem',
      margin: '0',
    },
  },
  tabThree__coachCard__image: {
    borderRadius: '50%',
    width: '8rem',
    height: '8rem',
    objectFit: 'cover',
    margin: '0 auto',
    display: 'block',
    [theme.breakpoints.up('md')]: {
      width: '10rem',
      height: '10rem',
    },
  },
  tabThree__coachCard__title: {
    fontFamily: 'Times New Roman',
    fontSize: '1.1rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1.25rem'
    },
  },
  tabThree__coachCard__subtitle: {
    padding: '1.2rem 0',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  modalCard: {
    backgroundColor: '#f1f1f1',
    height: '80%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'scroll',
    padding: '2rem 3rem',
    [theme.breakpoints.up('sm')]: {
      height: '80%',
      width: '70%',
      padding: '2rem'
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      height: '60%',
      width: '75%',
      padding: '0'
    },
  },
  modalCard__image: {
    height: '70%',
    width: '100%',
    margin: '0 auto',
    objectFit: 'cover',
    [theme.breakpoints.up('md')]: {
      width: '35%',
      height: '100%',
    },
  },
  modalCard__text: {
    padding: '0',
    position: 'relative',
    marginTop: '2rem',
    [theme.breakpoints.up('md')]: {
      padding: '2rem 3rem',
      marginTop: 0,
    },
  },
  modalCard__title: {
    fontFamily: 'Times New Roman',
    color: '#71959E',
    fontSize: '1.75rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '2.1875rem',
    },
  },
  modalCard__list: {
    listStyleType: 'circle'
  },


}))

const CoachModal = ({ modalOpen, setModalOpen, locale, coach }) => {
  const classes = useStyles()
  // const coach = marketing['9d']['en']
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={modalOpen}
      className={classes.modal}
      onClose={() => setModalOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalOpen}>
        <div className={`${classes.modalCard}`}>

          <img className={classes.modalCard__image}
            src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1100&q=80" alt="" />

          <Typography component='div' className={classes.modalCard__text}>
            <Box
              align='left'
              className={classes.modalCard__title}
              fontSize={35} fontWeight="fontWeightBold" mb={0}>
              {coach.split('/')[0]}
            </Box>

            <Box
              fontSize={14} align='left' fontWeight="fontWeightRegular" mb={2}>
              {coach.split('/')[1]}
            </Box>

            <Box
              fontSize={16} align='left' fontWeight="fontWeightRegular" mb={2}>
              {coach.split('/')[2]}
            </Box>

            <Box
              fontSize={16} align='left' fontWeight="fontWeightRegular" mb={2}>
              {coach.split('/')[3]}
            </Box>

          </Typography>

        </div>
      </Fade>
    </Modal>
  )
}

const MarketingDelta = ({ locale, history }) => {
  const classes = useStyles()
  const [tabValue, setTabValue] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeCoach, setActiveCoach] = useState(marketing['11a'][locale])

  function scrollTo(id) {
    document.querySelector(`#${id}`).scrollIntoView({
      block: 'center'
    })
  }

  const camp_card_images = ['https://i.imgur.com/HDBxtvO.jpg', 'https://i.imgur.com/aY9A52u.jpg', 'https://i.imgur.com/CnCfNJp.jpg', 'https://i.imgur.com/jBCtavy.jpg']

  return (
    <div id='korean__marketing' className={classes.root}>

      <main className={classes.jumbotron}>
        <Typography className={classes.jumbotron__textContainer}
          component='div'>
          <Box
            className={classes.typography__size__1}
            fontWeight="fontWeightRegular" mb={2}>
            {marketing['1a'][locale]}
          </Box>
          <Box className={classes.typography__size__2}
            fontWeight="fontWeightRegular" pr={10} mb={4}>
            {marketing['1b'][locale]}
          </Box>

          <div>
            <Button className={classes.button}
              onClick={() => scrollTo('guarantee')}
              color='primary'
              variant='outlined'>  {buttons['1'][locale]} </Button>

            <Button className={classes.button}
              style={{ marginLeft: '1rem' }}
              onClick={() => scrollTo('camp-cards')}
              color='primary'
              variant='contained'> {buttons['2'][locale]} </Button>
          </div>
        </Typography>

        <SoccerLogo />
      </main>

      <section id='guarantee' className={classes.iconsSectionContainer}>
        <Box fontSize={25} align='center'
          fontWeight="fontWeightRegular" mb={5}>
          {marketing['18'][locale]}
        </Box>
        <div className={classes.iconsSection}>

          {marketing['2'][locale].split('.').map((x, i) => {
            const Icon = i === 0 ? PeopleSharpIcon : i === 1 ? AssignmentSharpIcon : FlightTakeoffSharpIcon
            return (
              <p className={classes.iconsSection__desc}>
                <Icon className={classes.iconsSection__icons} />
                {x.split('/')[0]} <br /> {x.split('/')[1]}
              </p>
            )
          })}
        </div>

      </section>

      <section className={classes.secondarySections}>
        <Typography className={classes.secondarySections__textContainer}
          component='div'>
          <Box fontSize={25}
            fontWeight="fontWeightRegular" mb={3}>
            {marketing['3a'][locale]}
          </Box>
          <Box className={classes.typography__size__2}
            fontWeight="fontWeightRegular" mb={2}>
            {marketing['3b'][locale]}
          </Box>
          <Box className={classes.typography__size__2}
            fontWeight="fontWeightRegular" mb={4}>
            {marketing['3c'][locale]}
          </Box>
          <Button color='primary' className={classes.button} onClick={() => scrollTo('steps')} variant='contained'> {buttons['5'][locale]} </Button>
        </Typography>

        <FitnessLogo />
      </section>

      <Box fontSize={25} align='center' mt={8} mb={7} >
        {marketing['19'][locale]}
      </Box>

      <div id='steps' className={classes.stepsContainer}>
        {marketing['4'][locale].split('/').map((step, index) => {
          const Icon = index === 0 ? ContactlessRoundedIcon : index === 1 ? CreateRoundedIcon : index === 2 ? RateReviewRoundedIcon : SportsSoccerRoundedIcon
          return (
            index === 0 ?
              <div className={classes.steps}>
                <Icon className={classes.steps__icons} />
                {step}
              </div> :
              <>
                <ArrowForwardSharpIcon />
                <div className={classes.steps}>
                  {<Icon className={classes.steps__icons} />}
                  {step}
                </div>
              </>
          )
        })}
      </div>


      <div id='camp-cards' className={classes.campCardContainer}>
        {[{ ...marketing['5a'] }, { ...marketing['5b'] },
        { ...marketing['5c'] }, { ...marketing['5d'] }].map((el, i) => {
          return (
            <Paper elevation={2} className={classes.campCard}>
              <CardActionArea>
                <CardContent>
                  <Box fontSize={18} fontWeight="fontWeightRegular" mb={2}>
                    {el[locale].split('.')[0]}
                  </Box>

                  <Chip
                    className={classes.campCard__chip}
                    icon={<EventSharpIcon className={classes.campCard__icons} />}
                    label={el[locale].split('.')[1]}
                    variant="outlined"
                  />
                  <Chip
                    className={classes.campCard__chip}
                    icon={<RoomSharpIcon className={classes.campCard__icons} />}
                    label={el[locale].split('.')[2]}
                    variant="outlined"
                  />

                </CardContent>

                <CardMedia
                  className={classes.campCard__media}
                  component="img"
                  alt="Kids playing football"
                  height="140"
                  src={camp_card_images[i]}
                  title="Contemplative Reptile"
                />
              </CardActionArea>

              <CardActions>
                <Button
                  onClick={() => history.push('/authentication')}
                  className={classes.campCard__button}
                  size="small" variant='contained' color="#71959E">
                  {el[locale].split('.')[3]}
                </Button>
              </CardActions>
            </Paper>
          )
        })}
      </div>



      <Paper className={classes.tabContainer} elevation={3}>
        <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
          {[tabs['1a'][locale], tabs['1b'][locale], tabs['1c'][locale], tabs['1d'][locale]].map((x, i) => {
            return (
              <Tab className={classes.tabs} style={{
                ...(tabValue === i && {
                  backgroundColor: '#f8f8f8',
                  textTransform: 'uppercase'
                })
              }} label={x} />
            )
          })}
        </Tabs>
      </Paper>


      {/* tab 1 */}
      <TabPanel className={classes.tabPanel} value={tabValue} index={0}>

        <Box
          align='center'
          fontSize={25} fontWeight="fontWeightRegular" mt={5} mb={8}>
           {marketing['14'][locale]}
        </Box>

        <div className={classes.tabTwo__container} >
          <Typography component='div' style={{ marginBottom: '2rem' }}>

            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
              {marketing['6a'][locale]}
            </Box>

            <ul>
              {marketing['6b'][locale].split('/').map(sentence => <li className={classes.tabOne__listItems}> {sentence} </li>)}
            </ul>
          </Typography>

          <img
            className={classes.tabTwo__images}
            src="https://i.imgur.com/1CCki8y.jpg" alt="" />
        </div>



        <div >

          <Box
            fontSize={18} fontWeight="fontWeightBold" mt={3} mb={2}>
            {marketing['3a'][locale]}
          </Box>

          <div className={classes.tabOne__applyCardContainer}>
            {[{ ...marketing['7a'] }, { ...marketing['7b'] }, { ...marketing['7c'] },
            { ...marketing['7d'] }, { ...marketing['7e'] }, { ...marketing['7f'] }].map(el => {
              return (
                <Card className={classes.tabOne__applyCard}>
                  <CardContent>
                    <Box className={classes.typography__size__2} fontWeight="fontWeightBold" mb={3}>
                      {el[locale].split('/')[0]}
                    </Box>
                    <Typography variant="body2" component="p">
                      {el[locale].split('/')[1]}
                    </Typography>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className={classes.tabOne__cta}>
          <Box
            fontSize={18} fontWeight="fontWeightBold" mr={5}>
            {marketing['8'][locale]}
          </Box>

          <Button color='primary'
            className={classes.button}
            onClick={() => scrollTo('camp-cards')} variant='contained'>
              {buttons['3'][locale]}
        </Button>
        </div>


      </TabPanel>


      {/* tab 2 */}
      <TabPanel className={classes.tabPanel} value={tabValue} index={1}>

        <Box
          align='center'
          fontSize={25} fontWeight="fontWeightRegular" mt={5} mb={8}>
          {marketing['9a'][locale]}
        </Box>

        {/* <div className={classes.tabTwo__container}>

          <img
            className={classes.tabTwo__images}
            src="https://images.unsplash.com/photo-1528805639423-44f7d2a3b368?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2480&q=80" alt="" />

          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
              How They Work
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['6d'][locale].split('/ ')[0]}
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" m={0}>
              {marketing['6d'][locale].split('/ ')[1]}
            </Box>
          </Typography>



        </div> */}




        <div className={classes.tabTwo__container}>

          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
               {marketing['16'][locale]}
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['9b'][locale]}
            </Box>

            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['9c'][locale]}
            </Box>
          </Typography>

          <img
            style={{ objectFit: 'contain'}}
            className={classes.tabTwo__images}
            src="https://uksouth1-mediap.svc.ms/transform/thumbnail?provider=spo&inputFormat=png&cs=fFNQTw&docid=https%3A%2F%2Findulgefootballltd.sharepoint.com%3A443%2F_api%2Fv2.0%2Fdrives%2Fb!TU8k-aDdhk23zj9aEI-r1adyiQ8NHXZEkLVhu7ukhjMU7bchdFchTYVLakTP-hD2%2Fitems%2F01QFKVWRYVKZPKBA2YPRDYU7EYREOEFZ2X%3Fversion%3DPublished&access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvaW5kdWxnZWZvb3RiYWxsbHRkLnNoYXJlcG9pbnQuY29tQGVmMzMwMjlmLTE0NWUtNDdkNi1iNDA2LWMyMmZiNmE0Y2MxZSIsImlzcyI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMCIsIm5iZiI6IjE2MTc5ODA0MDAiLCJleHAiOiIxNjE4MDAyMDAwIiwiZW5kcG9pbnR1cmwiOiIxcy96TjdidE5RYW5iWmJuU2VQa1JzYlZxNWdpSlJiV1NMdHhxYUNMclE0PSIsImVuZHBvaW50dXJsTGVuZ3RoIjoiMTI1IiwiaXNsb29wYmFjayI6IlRydWUiLCJ2ZXIiOiJoYXNoZWRwcm9vZnRva2VuIiwic2l0ZWlkIjoiWmpreU5EUm1OR1F0WkdSaE1DMDBaRGcyTFdJM1kyVXRNMlkxWVRFd09HWmhZbVExIiwic2lnbmluX3N0YXRlIjoiW1wia21zaVwiXSIsIm5hbWVpZCI6IjAjLmZ8bWVtYmVyc2hpcHxrZW5uQGluZHVsZ2Vmb290YmFsbC5jb20iLCJuaWkiOiJtaWNyb3NvZnQuc2hhcmVwb2ludCIsImlzdXNlciI6InRydWUiLCJjYWNoZWtleSI6IjBoLmZ8bWVtYmVyc2hpcHwxMDAzMjAwMGU3OWEzM2Q1QGxpdmUuY29tIiwidHQiOiIwIiwidXNlUGVyc2lzdGVudENvb2tpZSI6IjMifQ.ckdGbzdYUTEvUEp6TExVaWhWU3dJR01jbzFRbXluYnhObWRGZmJCM25GRT0&encodeFailures=1&width=2878&height=1376&srcWidth=&srcHeight=" alt="" />



        </div>
      </TabPanel>


      {/* tab 3 */}
      <TabPanel className={classes.tabPanel} value={tabValue} index={2}>

        <CoachModal modalOpen={modalOpen} setModalOpen={setModalOpen} locale={locale} coach={activeCoach} />

        <Typography component='div'>
          <Box align='center'
            fontSize={25} fontWeight="fontWeightRegular" mt={5} mb={8}>
            {marketing['10a'][locale]}
          </Box>
        </Typography>


        <section className={classes.tabThree__container}>
          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={1}>
                {marketing['15a'][locale]}
            </Box>

            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" >
              {marketing['10b'][locale].split('/')[1]}
            </Box>

          </Typography>

          <CareerLogo />

        </section>

        
        <section className={classes.tabThree__container}>
          <FormLogo />
          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mt={2} mb={2}>
                {marketing['15b'][locale]}
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['10b'][locale].split('/')[0]}
            </Box>
          </Typography>
        </section>



        <Box align='center'
          fontSize={18} fontWeight="fontWeightBold" mt={6} mb={6}>
          {marketing['15c'][locale]}
        </Box>

        <div className={classes.tabThree__coachContainer}>

          {
            [marketing['11a'][locale], marketing['11b'][locale],
            marketing['11c'][locale]].map((coach, i) => {
              return (

                <Paper elevation={0} className={classes.tabThree_coachCard}>
                  <CardActionArea onClick={() => {
                    setActiveCoach(coach)
                    setModalOpen(true)
                  }}>

                    <img
                      style={{ ...(i === 1 && {
                        filter: 'brightness(1.2)'
                      })}}
                      className={classes.tabThree__coachCard__image}
                      src={i === 0 ? "https://i.imgur.com/uPTpZzi.jpg" :
                        i === 1 ? 'https://i.imgur.com/8deioVX.png' :
                          'https://i.imgur.com/IYUoAXL.jpg'} alt="" />

                    <Box align='center'
                      className={classes.tabThree__coachCard__title}
                      fontSize={20} fontWeight="fontWeightRegular" mt={2} pb={0}>
                      {coach.split(' / ')[0]}
                    </Box>

                    <Box align='center'
                      className={classes.tabThree__coachCard__subtitle}
                      fontSize={13} fontWeight="fontWeightRegular">
                      {coach.split(' / ')[1]} {i !== 2 && <> <br /> <br /> </>}
                    </Box>

                  </CardActionArea>

                </Paper>

              )
            })
          }
        </div>
      </TabPanel>

      {/* tab 4 */}
      <TabPanel className={classes.tabPanel} value={tabValue} index={3}>

        <Box
          align='center'
          fontSize={25} fontWeight="fontWeightRegular" mt={5} mb={8}>
             {marketing['17'][locale]}
        </Box>


        <div className={classes.tabTwo__container}>

          <img className={classes.tabTwo__images}
            src="https://images.unsplash.com/photo-1604410730133-edb636ec02c2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2734&q=80" alt="" />

          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
              {marketing['12a'][locale]}
            </Box>

            {marketing['12b'][locale].split('/').map(x => {
              return (
                <Box
                  className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
                  {x}
                </Box>
              )
            })}
          </Typography>
        </div>

        <div className={classes.tabTwo__container}>

          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
              {marketing['13a'][locale]}
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['13b'][locale].split('/')[0]}
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['13b'][locale].split('/')[1]}
            </Box>
          </Typography>

          <img className={classes.tabTwo__images}
            style={{ objectPosition: '30% 50%'}}
            src="https://i.imgur.com/wlHiOb0.jpg" alt="" />
        </div>



      </TabPanel>


    </div >
  );
};

export default MarketingDelta;