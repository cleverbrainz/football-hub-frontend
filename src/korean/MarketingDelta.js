import React, { useState, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { ReactComponent as SoccerLogo } from './soccer.svg';
import { ReactComponent as FitnessLogo } from './fitness.svg';
import { ReactComponent as CareerLogo } from './career.svg';
import { ReactComponent as FormLogo } from './form.svg';
import PeopleSharpIcon from '@material-ui/icons/PeopleSharp';
import FlightTakeoffSharpIcon from '@material-ui/icons/FlightTakeoffSharp';
import AssignmentSharpIcon from '@material-ui/icons/AssignmentSharp';
import { languages, marketing } from './LanguageSkeleton'
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
        marginBottom: '0rem',
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
    borderTop: '1px solid #71959E',
    borderBottom: '1px solid #71959E'
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
              {coach.split(' / ')[0]}
            </Box>

            <Box
              fontSize={12} align='left' fontWeight="fontWeightRegular" mb={2}>
              Currently: {coach.split(' / ')[1]}
            </Box>

            <Box
              pr={8}
              fontSize={14} fontWeight="fontWeightRegular" mb={2}>
              {coach.split(' / ')[2].split('% ').map(item => {
                return (
                  <>
                    <p>{item}</p>
                    <br />
                  </>
                )
              })}
              {coach.split(' / ')[3] &&
                <ul>
                  {coach.split(' / ')[3].split('%').map(item => {
                    return (
                      <li className={classes.modalCard__list}>
                        {item}
                      </li>
                    )
                  })}
                </ul>
              }
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
  const [activeCoach, setActiveCoach] = useState(marketing['9d'][locale])

  function scrollTo(id) {
    document.querySelector(`#${id}`).scrollIntoView({
      block: 'center'
    })
  }

  return (
    <div id='korean__marketing' className={classes.root}>
      <main className={classes.jumbotron}>
        <Typography className={classes.jumbotron__textContainer}
          component='div'>
          <Box
            className={classes.typography__size__1}
            fontWeight="fontWeightRegular" mb={.5}>
            Pathway Development Programme Residential Training Camp South Korea
          </Box>
          <Box
            fontWeight="fontWeightRegular" fontSize={15} mb={2.5}>
             From 20th May to 20th June 2021
          </Box>
          <Box className={classes.typography__size__2}
            fontWeight="fontWeightRegular" pr={10} mb={4}>
            Indulge Football have partned with xxxxx to deliver the first 5 day residential training
            camp from our football Pathway Development Programme, open to 13 to 15 year olds
            looking to advance their football development.
          </Box>

          <div>
            <Button className={classes.button}
              onClick={() => scrollTo('guarantee')}
              color='primary'
              variant='outlined'> Explore </Button>

            <Button className={classes.button}
              style={{ marginLeft: '1rem' }}
              onClick={() => scrollTo('camp-cards')}
              color='primary'
              variant='contained'> Apply </Button>
          </div>




        </Typography>

        <SoccerLogo />
      </main>

      <section id='guarantee' className={classes.iconsSectionContainer}>
        <Box fontSize={25} align='center'
          fontWeight="fontWeightRegular" mb={5}>
          What we guarantee
        </Box>
        <div className={classes.iconsSection}>
          <p className={classes.iconsSection__desc}>
            <PeopleSharpIcon className={classes.iconsSection__icons} />
            Professional coaching by xxxxxxx <br /> from xxxxx academy based in xxxxx
        </p>
          <p className={classes.iconsSection__desc}>
            <AssignmentSharpIcon className={classes.iconsSection__icons} />
            Individual player assessment from <br />  experts in physical & mental development
        </p>
          <p className={classes.iconsSection__desc}>
            <FlightTakeoffSharpIcon className={classes.iconsSection__icons} />
            An opportunity to be selected for <br />  an all expenses paid trial abroad
        </p>
        </div>

      </section>

      <section className={classes.secondarySections}>
        <Typography className={classes.secondarySections__textContainer}
          component='div'>
          <Box fontSize={25}
            fontWeight="fontWeightRegular" mb={2}>
            Personal player tracking based on <br /> perfomance metrics
          </Box>
          <Box className={classes.typography__size__2}
            fontWeight="fontWeightRegular" mb={4}>
            Applicants will complete an online assessment inclusive of 3 key football challenges.
            There will be a £15 fee for the initial assesement which will be reviewed by Indulge Football
            alongside professional UEFA licensed coaches.
          </Box>
          <Button color='primary' className={classes.button} onClick={() => scrollTo('steps')} variant='contained'> Get started </Button>
        </Typography>

        <FitnessLogo />
      </section>

      <Box fontSize={25} align='center' mt={8} mb={7} >
        How it Works
        </Box>

      <div id='steps' className={classes.stepsContainer}>
        {['Create your account and pay the £15 assessment fee', 'Tess us about you and complete the challenges', 'Your application will be reviewed for suitability', 'If successful, you will be invited to join and pay for the camp'].map((step, index) => {
          return (
            index === 0 ?
              <div className={classes.steps}>
                <ContactlessRoundedIcon className={classes.steps__icons} />
                {step}
              </div> :
              <>
                <ArrowForwardSharpIcon />
                <div className={classes.steps}>
                  {index === 1 ? <CreateRoundedIcon className={classes.steps__icons} /> :
                    index === 2 ? <RateReviewRoundedIcon className={classes.steps__icons} /> :
                      <SportsSoccerRoundedIcon className={classes.steps__icons} />}
                  {step}
                </div>
              </>
          )
        })}
      </div>


      <div id='camp-cards' className={classes.campCardContainer}>




        {[{ ...marketing['7d'] }, { ...marketing['7e'] },
        { ...marketing['7f'] }].map(el => {
          return (
            <Paper elevation={2} className={classes.campCard}>
              <CardActionArea>
                <CardContent>
                  <Box fontSize={18} fontWeight="fontWeightRegular" mb={2}>
                    {el[locale].split('.')[0]}
                  </Box>

                  {locale === 'en' &&
                    <Chip
                      className={classes.campCard__chip}
                      icon={<ScheduleSharpIcon className={classes.campCard__icons} />}
                      label={el[locale].split('.')[2]}
                      variant="outlined"
                    />}

                  <br />

                  <Chip
                    className={classes.campCard__chip}
                    icon={<EventSharpIcon className={classes.campCard__icons} />}
                    label={el[locale].split('.')[1]}
                    variant="outlined"
                  />
                  <Chip
                    className={classes.campCard__chip}
                    icon={<RoomSharpIcon className={classes.campCard__icons} />}
                    label={el[locale].split('.')[locale === 'en' ? 3 : 2]}
                    variant="outlined"
                  />

                </CardContent>

                <CardMedia
                  className={classes.campCard__media}
                  component="img"
                  alt="Kids playing football"
                  height="140"
                  src='https://images.unsplash.com/photo-1604651684573-05470013b3b9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80'
                  title="Contemplative Reptile"
                />
              </CardActionArea>

              <CardActions>
                <Button
                  onClick={() => history.push('/authentication')}
                  className={classes.campCard__button}
                  size="small" variant='contained' color="#71959E">
                  Apply
              </Button>
              </CardActions>
            </Paper>
          )
        })}
      </div>



      <Paper className={classes.tabContainer} elevation={3}>
        <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
          <Tab className={classes.tabs} style={{
            ...(tabValue === 0 && {
              backgroundColor: '#f8f8f8',
              textTransform: 'uppercase'
            })
          }} label="Camp" />
          <Tab className={classes.tabs} style={{
            ...(tabValue === 1 && {
              backgroundColor: '#f8f8f8',
              textTransform: 'uppercase'
            })
          }} label="Club" />
          <Tab className={classes.tabs} style={{
            ...(tabValue === 2 && {
              backgroundColor: '#f8f8f8',
              textTransform: 'uppercase'
            })
          }} label="Assessment" />
          <Tab className={classes.tabs} style={{
            ...(tabValue === 3 && {
              backgroundColor: '#f8f8f8',
              textTransform: 'uppercase'
            })
          }} label="Programme" />
        </Tabs>
      </Paper>


      {/* tab 1 */}
      <TabPanel className={classes.tabPanel} value={tabValue} index={0}>

        <Box
          align='center'
          fontSize={25} fontWeight="fontWeightRegular" mt={5} mb={8}>
          {marketing['5a'][locale]}
        </Box>

        <div className={classes.tabTwo__container} >


          <Typography component='div' style={{ marginBottom: '2rem' }}>

            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
              Included in the programme
            </Box>

            <ul>
              {marketing['5c'][locale].split('/ ').map(sentence => <li className={classes.tabOne__listItems}> {sentence} </li>)}
            </ul>

          </Typography>

          <img
            className={classes.tabTwo__images}
            src="https://images.unsplash.com/photo-1487811566627-ecd6321dfd2b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2892&q=80" alt="" />
        </div>



        <div >

          <Box
            fontSize={18} fontWeight="fontWeightBold" mt={3} mb={2}>
            {marketing['3a'][locale]}
          </Box>

          <div className={classes.tabOne__applyCardContainer}>
            {[{ ...marketing['4a'] }, { ...marketing['4b'] }, { ...marketing['4c'] },
            { ...marketing['4d'] }, { ...marketing['4e'] }, { ...marketing['4f'] }].map(el => {
              return (
                <Card className={classes.tabOne__applyCard}>
                  <CardContent>
                    <Box className={classes.typography__size__2} fontWeight="fontWeightBold" mb={3}>
                      {el[locale].split('/')[0].replace('.', '')}
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
            Only £1,250
          </Box>

          <Button color='primary'
            className={classes.button}
            onClick={() => scrollTo('camp-cards')} variant='contained'>
            Apply Now
        </Button>
        </div>


      </TabPanel>


      {/* tab 2 */}
      <TabPanel className={classes.tabPanel} value={tabValue} index={1}>

        <Box
          align='center'
          fontSize={25} fontWeight="fontWeightRegular" mt={5} mb={8}>
          Benfica FC
        </Box>

        <div className={classes.tabTwo__container}>

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



        </div>




        <div className={classes.tabTwo__container}>

          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
              Who They Are
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['6f'][locale]}
            </Box>

            <ul>
              {marketing['6g'][locale].split('.').map(sentence => {
                return <li className={classes.tabTwo__list}> {sentence} </li>
              })}
            </ul>
          </Typography>

          <img
            className={classes.tabTwo__images}
            src="https://images.unsplash.com/photo-1595169420819-c09fa1ceb704?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2908&q=80" alt="" />



        </div>
      </TabPanel>


      {/* tab 3 */}
      <TabPanel className={classes.tabPanel} value={tabValue} index={2}>

        <CoachModal modalOpen={modalOpen} setModalOpen={setModalOpen} locale={locale} coach={activeCoach} />

        <Typography component='div'>
          <Box align='center'
            fontSize={25} fontWeight="fontWeightRegular" mt={5} mb={8}>
            {marketing['9a'][locale].split(' / ')[0]}
          </Box>
        </Typography>


        <section className={classes.tabThree__container}>
          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={1}>
              What Is It
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" >
              {marketing['9b'][locale].split(' / ')[0]}
            </Box>

          </Typography>

          <CareerLogo />

        </section>

        <section className={classes.tabThree__container}>
          <FormLogo />
          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mt={2} mb={2}>
              Fee
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" >
              {marketing['9b'][locale].split(' / ')[1]}
            </Box>
          </Typography>
        </section>



        <Box align='center'
          fontSize={18} fontWeight="fontWeightBold" mt={6} mb={6}>
          Assessment Coaches
        </Box>

        <div className={classes.tabThree__coachContainer}>

          {
            [marketing['9d'][locale], marketing['9e'][locale], marketing['9f'][locale]].map((coach, i) => {
              return (

                <Paper elevation={0} className={classes.tabThree_coachCard}>
                  <CardActionArea onClick={() => {
                    setActiveCoach(coach)
                    setModalOpen(true)
                  }}>

                    <img
                      className={classes.tabThree__coachCard__image}
                      src={i === 0 ? "https://i.imgur.com/uPTpZzi.jpg" :
                        i === 1 ? 'https://o.remove.bg/downloads/93481dee-b0b0-4403-9e36-66fa1783d61e/Jack_Johnson-removebg-preview.png' :
                          'https://i.imgur.com/IYUoAXL.jpg'} alt="" />

                    <Box align='center'
                      className={classes.tabThree__coachCard__title}
                      fontSize={20} fontWeight="fontWeightRegular" mt={2} mb={2}>
                      {coach.split(' / ')[0]}
                    </Box>

                    <Box align='center'
                      className={classes.tabThree__coachCard__subtitle}
                      fontSize={14} fontWeight="fontWeightRegular" mt={2} mb={2}>
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
          {marketing['8a'][locale].split('/')[0]}
        </Box>


        <div className={classes.tabTwo__container}>

          <img className={classes.tabTwo__images}
            src="https://images.unsplash.com/photo-1604410730133-edb636ec02c2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2734&q=80" alt="" />

          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
              Indulge Football
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['8d'][locale].split('/')[0]}
            </Box>

            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['8d'][locale].split('/')[1]}
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['8d'][locale].split('/')[2]}
            </Box>
          </Typography>
        </div>

        <div className={classes.tabTwo__container}>

          <Typography component='div' className={classes.tabTwo__text}>
            <Box
              fontSize={18} fontWeight="fontWeightBold" mb={2}>
              The Pathway Development Programme
            </Box>
            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['8b'][locale].split('/')[0]}
            </Box>

            <Box
              className={classes.typography__size__2} fontWeight="fontWeightRegular" mb={2}>
              {marketing['8b'][locale].split('/')[1]}
            </Box>
          </Typography>

          <img className={classes.tabTwo__images}
            src="https://images.unsplash.com/photo-1596247865408-cb5107b24afc?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2829&q=80" alt="" />
        </div>



      </TabPanel>


    </div >
  );
};

export default MarketingDelta;