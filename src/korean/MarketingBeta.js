import React, { useState, useEffect, useRef } from 'react';
import { languages, marketing } from './LanguageSkeleton'
import {
  Typography,
  Grid,
  Fab,
  Box,
  Switch,
  Card,
  CardMedia,
  CardActionArea,
  CardActions,
  CardContent,
  Button,
  Tabs,
  Tab
} from "@material-ui/core";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
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
    textAlign: 'center',
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
    // '&:nth-of-type(2)': {
    //   margin: '20px 0',

    // },
    // '&:nth-of-type(3)': {
    //   margin: '0',
    //   flexDirection: 'column-reverse'
    // },
    // '&:nth-of-type(2)': {
    //   flexDirection: 'column-reverse'
    // },

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      // '&:nth-of-type(3)': {
      //   flexDirection: 'row'
      // },
    },

  },
  jumbotronThin: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'space-between',
    // '&:nth-of-type(2)': {
    //   margin: '20px 0',

    // },
    // '&:nth-of-type(3)': {
    //   margin: '0',
    //   flexDirection: 'column-reverse'
    // },
    // '&:nth-of-type(2)': {
    //   flexDirection: 'column-reverse'
    // },

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      // '&:nth-of-type(3)': {
      //   flexDirection: 'row'
      // },
    },

  },
  media: {
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '49%',
    },
  },
  mediaThin: {
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '32%',
    },
  },
  coachMedia: {
    width: '50%',
    [theme.breakpoints.up('md')]: {
      maxWidth: '50%',
    },
  },
  jumbotronText: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    [theme.breakpoints.up('md')]: {
      width: '48%',
    },
    textAlign: 'initial'
  },
  jumbotronTextWide: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    [theme.breakpoints.up('md')]: {
      width: '63%',
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
    // '&:nth-of-type(1)': {
    //   minHeight: '60vh',
    // },

    [theme.breakpoints.up('md')]: {
      width: '80%',
      // '&:nth-of-type(1)': {
      //   minHeight: '75vh',
      // },
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
    margin: '10px 15px',
    minHeight: 230,
    backgroundColor: '#f1f1f1',
    textAlign: 'left',
    [theme.breakpoints.up('md')]: {
      width: '30%',
      margin: '10px',
      minHeight: 200,
      minWidth: 220,
    },
  },
  campCardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    marginBottom: '20px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  campCard: {
    height: '30vh',
    width: '80%',
    position: 'relative',
    margin: '20px 0',
    border: '2px solid #71b7ff',
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

  },
  tabPanel: {
    alignItems: 'center',
    maxWidth: "80%"
  },
  coachContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh'
  },
  modalCard: {
    backgroundColor: '#f1f1f1',
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    minHeight: '70vh',
    maxWidth: '80vw'
  },
  coachCard: {
    display: 'block',
    textAlign: 'center',
    // minWidth: 320,
    // width: '80%',
    margin: '10px 15px',
    // minHeight: 230,
    backgroundColor: '#f1f1f1',
    [theme.breakpoints.up('md')]: {
      width: '30%',
      margin: '10px',
      minHeight: 200,
      minWidth: 220,
      borderRadius: '10px'
    },
    coachCardImage: {
      display: 'block',
      textAlign: 'center',
      width: '80%'
    }
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
}));

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
        <div className={`${classes.modalCard} ${classes.jumbotron}`}>
                <img className={classes.coachMedia}
            src="https://images.unsplash.com/photo-1529153348965-3de49b6188bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />

          <section className={classes.jumbotronText}>
          <Typography component='div' >
              <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                {coach.split(' / ')[0]}
              </Box>
              <Box
                fontSize={14} fontWeight="fontWeightThin" m={0}>
                {coach.split(' / ')[1]}
              </Box>
              <br />
              <Box
                fontSize={14} fontWeight="fontWeightRegular" m={0}>
                {coach.split(' / ')[2].split('% ').map(item => {
                  return (
                    <>
                    <p>{item}</p>
                    <br/>
                    </>
                  )
                })}
                { coach.split(' / ')[3] &&
                <ul>
                  {coach.split(' / ')[3].split('%').map(item => {
                    return (
                      <li className={classes.list}>
                        {item}
                      </li>
                    )
                  })}
                </ul>
              }
              </Box>

            </Typography>

          </section>

              </div>
        </Fade>
      </Modal>
  )
}

const MarketingBeta = (props) => {
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

  const [tabValue, setTabValue] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeCoach, setActiveCoach] = useState(marketing['9d'][locale])
  const cardRef = useRef()


  useEffect(() => {
    console.log(marketing)
  }, [])


  return (
    <div className={classes.root}>
      <main ref={cardRef} className={classes.main}>
        <Typography
          className={classes.title}
          component='div' >
          <Box
            fontSize={35} fontWeight="fontWeightBold" m={0}>
            {marketing[1][locale].split(' / ')[0]}
          </Box>
          <Box 
            style={{ marginBottom: '5px'}}
            fontSize={28} fontWeight="fontWeightBold" m={0}>
            {marketing[1][locale].split(' / ')[1]}
          </Box>
          <Box
            style={{ marginBottom: '25px'}}
            fontSize={22} fontWeight="fontWeightRegular" m={0}>
            {marketing['2a'][locale]}
          </Box>
        </Typography>
          <div className={classes.jumbotronThin} style={{ marginBottom: '50px'}}>
          <img className={classes.mediaThin}
  src="https://images.unsplash.com/photo-1493662404096-9ecc84ebba6b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80" alt="" />
<section className={classes.jumbotronTextWide}>
  <p>{marketing['2b'][locale].split('/ ')[0]}</p>
  <br />
  <p>{marketing['2b'][locale].split('/ ')[1]}</p>
 
</section>
</div>
<Typography
          component='div' >
          <Box
            fontSize={24} fontWeight="fontWeightBold" m={0}>
            GET STARTED
          </Box>
        </Typography>
        <div className={classes.stepsContainer}>
{ ['Create your account and pay the £15 assessment fee', 'Tess us about you and complete the challenges', 'Your application will be reviewed for suitability', 'If successful, you will be invited to join and pay for the camp'].map((step, index) => {
  return (
     index === 0 ? <div>{step}</div>   : <><KeyboardArrowRightIcon style={{ fontSize: '5em'}} /><div>{step}</div></>
  )
})}
</div>


      </main>
      {/* <Typography >
        <Box
          fontSize={20} fontWeight="fontWeightRegular" m={0}>
          {marketing['7c'][locale]}
        </Box>
      </Typography> */}

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

        <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)}>
        <Tab label="The Camp"/>
        <Tab label="About **Club Name**"/>
        <Tab label="The Assessment"/>
        <Tab label="The Programme"/>
      </Tabs>

      
      <TabPanel className={classes.tabPanel} value={tabValue} index={0}>


        <Typography style={{ marginBottom: '25px' }} component='div'>
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            {marketing['5a'][locale]}
          </Box>
        </Typography>

        <div className={classes.jumbotron} style={{ marginBottom: '25px'}}>

          <section className={classes.jumbotronText}>

            <Typography component='div' >
              <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                {marketing['5b'][locale]}
              </Box>

              <ul style={{ marginBottom: '20px' }}>
                {marketing['5c'][locale].split('/ ').map(sentence => {
                  return <li className={classes.list}> {sentence} </li>
                })}
              </ul>
            <Box
                fontSize={24} fontWeight="fontWeightBold" m={0} style={{ textAlign: 'center'}}>
                {marketing['5d'][locale]}
              </Box>
            </Typography>
          </section>
          <img className={classes.media}
            src="https://images.unsplash.com/photo-1493662404096-9ecc84ebba6b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80" alt="" />
        </div>

        <Typography component='div'>
          <Box
            style={{ margin: '60px 0 15px 0' }}
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

        
      </TabPanel>

      <TabPanel className={classes.tabPanel} value={tabValue} index={1}>

        <Typography style={{ marginBottom: '25px' }} component='div'>
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            {marketing['6a'][locale]}
          </Box>

          {/* <Box
            className={classes.campSubText}
            fontSize={16} fontWeight="fontWeightRegular" m={0}>
            {marketing['6b'][locale]}
          </Box> */}
        </Typography>

        <div className={classes.jumbotron}>

          <img className={classes.media}
            src="https://images.unsplash.com/photo-1509023464722-18d996393ca8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />
          <section className={classes.jumbotronText} >
            <Typography component='div' >
              {/* <Box
                fontSize={20} fontWeight="fontWeightBold" m={0}>
                {marketing['6c'][locale]}
              </Box> */}

              <p>
                {marketing['6d'][locale].split('/ ')[0]}
              </p>
              <br />
              <p>
                {marketing['6d'][locale].split('/ ')[1]}
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

      
      </TabPanel>

      <TabPanel className={classes.tabPanel} value={tabValue} index={2}>

      <CoachModal modalOpen={modalOpen} setModalOpen={setModalOpen} locale={locale} coach={activeCoach} />

      <Typography style={{ marginBottom: '25px' }}
          component='div' >
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
           {marketing['9a'][locale].split(' / ')[0]}
          </Box>
        </Typography>

        <div className={classes.jumbotron}>
          <img className={classes.media}
            src="https://images.unsplash.com/photo-1529153348965-3de49b6188bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />

          <section className={classes.jumbotronText}>
            <Typography component='div' >
              <Box
                fontSize={24} fontWeight="fontWeightRegular" m={0}>
                {marketing['9a'][locale].split(' / ')[1]}
              </Box>
            </Typography>

            <p>
              {marketing['9b'][locale].split(' / ')[0]}
            </p>
            <Typography component='div' >
              <Box
                fontSize={18} fontWeight="fontWeightRegular" m={0}>
                {marketing['9a'][locale].split(' / ')[2]}
              </Box>
            </Typography>

            <p>
              {marketing['9b'][locale].split(' / ')[1]}
            </p>
          </section>
        </div>


      <Typography style={{ marginTop: '30px'}}
          component='div' >
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
           {marketing['9c'][locale]}
          </Box>
        </Typography>
        <div className={classes.coachContainer}>

        {
          [marketing['9d'][locale], marketing['9e'][locale], marketing['9f'][locale]].map(coach => {
            return (

          <Card className={classes.coachCard}>
          <CardActionArea onClick={() => {
            setActiveCoach(coach)
            setModalOpen(true)
            }}>
            <CardMedia
              component="img"
              className={classes.coachCardImage}
              src="https://images.unsplash.com/photo-1529153348965-3de49b6188bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80"
              title="coach picture"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
              {coach.split(' / ')[0]}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
              {coach.split(' / ')[1]}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions style={{ alignItems: 'center', justifyContent: 'center'}}>
            <Button onClick={() => setModalOpen(true)} size="small" color="primary">
              Learn More
            </Button>
          </CardActions>
        </Card>

            )
          })
        }
        </div>




      
      </TabPanel>

      <TabPanel className={classes.tabPanel} value={tabValue} index={3}>

      <Typography style={{ marginBottom: '25px' }}
          component='div' >
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
           {marketing['8a'][locale].split('/')[0]}
          </Box>
        </Typography>

        <div className={classes.jumbotron}>
          <img className={classes.media}
            src="https://images.unsplash.com/photo-1529153348965-3de49b6188bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />

          <section className={classes.jumbotronText}>
            <Typography component='div' >
              <Box
                fontSize={24} fontWeight="fontWeightBold" m={0}>
                {marketing['8a'][locale].split('/')[1]}
              </Box>
            </Typography>

            <p>
              {marketing['8b'][locale].split('/')[0]}
            </p>

            <p>
              {marketing['8b'][locale].split('/')[1]}
            </p>
          </section>
        </div>

        <Typography
          style={{ marginTop: '30px', marginBottom: '25px'}}
          component='div' >
          <Box
            fontSize={30} fontWeight="fontWeightBold" m={0}>
            {marketing['8c'][locale].split('/')[0]}
          </Box>
        </Typography>

        <div className={classes.jumbotron}>
          <img className={classes.media}
            src="https://images.unsplash.com/photo-1529153348965-3de49b6188bd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" alt="" />

          <section className={classes.jumbotronText}>
            <Typography component='div' >
              <Box
                fontSize={24} fontWeight="fontWeightBold" m={0}>
                 {marketing['8c'][locale].split('/')[1]}
              </Box>
            </Typography>

            <p>
              {marketing['8d'][locale].split('/')[0]}
            </p>

            <p>
            {marketing['8d'][locale].split('/')[1]}
            </p>

            <p>
              {marketing['8d'][locale].split('/')[2]}
            </p>
          </section>
        </div>

      </TabPanel>

      



      

      <section style={{ marginTop: '50px', marginBottom: '100px' }}>
          <Button variant='contained'
            onClick={(() => cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }))}
          >
          {marketing['10a'][locale]} ->
          </Button> 
      </section>

    </div>
  );
};

export default MarketingBeta;