import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { profile, snackbar_messages, application as app } from './LanguageSkeleton'
import auth from '../lib/auth'
import axios from 'axios'
import AdjustSharpIcon from '@material-ui/icons/AdjustSharp';
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';
import moment from 'moment'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import InfoIcon from '@material-ui/icons/Info';
import { useStripe } from "@stripe/react-stripe-js";

import {
  CircularProgress,
  Paper,
  Typography,
  Box,
  Container,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    paddingTop: '110px',
    paddingBottom: '50px',
    position: 'relative',
  },
  progress: {
    position: 'absolute',
    top: '47.5%',
    left: '46.5%',
  },
  container: {
    width: '85%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      width: '54%',
    },
    [theme.breakpoints.up('md')]: {
      width: '45%',
    },

  },

  profileHeader: {
    width: '100%',
    marginBottom: '25px',
    position: 'relative',
    padding: '35px 15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  imageContainer: {
    width: '200px',
    height: '200px',
    transform: 'translateX(0px)',
    position: 'relative',
    marginBottom: '10px',
    [theme.breakpoints.up('md')]: {
      transform: 'translateX(-110px)',
      position: 'absolute',
      marginBottom: '0px',
    },
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    borderRadius: '50%',
    opacity: 0,
    transition: '.5s ease',
    backgroundColor: 'rgb(49, 0, 247)',
    '&:hover': {
      opacity: 0.8
    }
  },
  overlayText: {
    color: 'white',
    fontSize: '16px',
    letterSpacing: '5px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    '-webkit-transform': 'translate(-50%, -50%)',
    '-ms-transform': 'translate(-50%, -50%)',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center'
  },
  image: {
    borderRadius: '50%',
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  subHeading: {
    transform: 'translateX(0px)',
    width: '100%',
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      transform: 'translateX(150px)',
      width: '50%',
      textAlign: 'left',
    },
  },
  otherSections: {
    position: 'relative',
    padding: '25px',
    marginBottom: '25px'
  },
  seeMore: {
    textAlign: 'right',
    opacity: 0.75,
    fontSize: '14px',
    "&:hover": {
      cursor: 'pointer',
      color: '#3100F7',
      opacity: 1
    }

  },
  menu: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      padding: '25px 25px 10px',
      width: '20%',
      position: 'fixed',
      left: '6%',
      top: '52%',
    },
  },
  settings: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      padding: '25px 25px 10px',
      width: '20%',
      position: 'fixed',
      right: '6%',
      top: '15%',
    },
  },
  listItems: {
    fontSize: '14px',
    margin: '5px 0',
    "&:hover": {
      cursor: 'pointer',
      color: '#3100F7',
      transform: 'translateX(3px)'
    }
  },
  logout: {
    fontSize: '14px',
    margin: '5px 0',
    color: 'red',
    paddingTop: '30px',
    "&:hover": {
      cursor: 'pointer',
      transform: 'translateX(3px)'
    }
  },
  clubRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  },
  connectorLine: {
    width: '1px',
    height: '90px',
    position: 'absolute',
    backgroundColor: '#3100F7',
    top: '57%',
    left: '11.1px'
  },
  chip: {
    fontSize: '12.5px',
    padding: '6px 12px',
    borderRadius: '7px',
    backgroundColor: 'rgba(226, 226, 226, 0.5)',

    "&:nth-of-type(2)": {
      margin: '0 20px',
      [theme.breakpoints.up('md')]: {
        margin: '0 40px',
      },
    }
  },
  awardsSectionContainer: {
    display: 'flex',
    flexDirection: 'column',

    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  },
  awardSections: {
    position: 'relative',
    padding: '25px',
    width: '100%',
    marginBottom: '25px',
    [theme.breakpoints.up('md')]: {
      width: '48%',
      marginBottom: '0px',
    },
  },
  skillItems: {
    fontSize: '14px',
    margin: '15px 0',
    listStyleType: 'circle',
    transform: 'translateX(15px)'
  },
  awardItems: {
    margin: '15px 0',
    listStyleType: 'circle',
    transform: 'translateX(15px)'
  },
}))

const ApplicantProfile = ({ locale, match, history, history: { location: { state } } }) => {

  const stripe = useStripe()
  const classes = useStyles()
  const [user, setUser] = useState({})
  const [application, setApplication] = useState()
  const [currentScrollSection, setCurrentScrollSection] = useState('about')
  const [hasLoaded, setHasLoaded] = useState(false)
  const [open, setOpen] = useState()
  const [dialog, setDialog] = useState({
    open: false,
    type: 't&cs'
  })
  const [message, setMessage] = useState()
  const [imageUpload, setImageUpload] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(auth.getUserId() === match.params.id)
  const [subDate, setSubDate] = useState('')
  const input = useRef()
  const defaultPic = 'https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80'

  // console.log({ isOwnProfile, egg: auth.getUserId(), match })

  const date = new Date()

  const getData = async () => {

    axios.get(`/users/${match.params.id}`)
      .then(res => {
        // console.log('THISSS ISSS', res.data)
        const { applications } = res.data[0]
        setUser(res.data[0])

        if (applications.ajax_application?.hasOwnProperty('challenges_submitted')) {
          setSubDate(moment(applications.ajax_application.submission_date).format('MMMM Do YYYY'))
        }

        if (applications.ajax_application?.ratings.indulge === 'yes' && !applications.ajax_application?.post_app_actions) {
          setDialog({
            ...dialog,
            open: true
          })
        }


        if (applications.ajax_application) {
          setApplication(applications.ajax_application)
        } else if (applications.ajax_application) {
          setApplication(applications.ajax_application)
        }
        setHasLoaded(true)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  const handleMediaChange = (e) => {
    if (!isOwnProfile) return
    setImageUpload(true)
    const image = e.target.files
    const picture = new FormData()
    picture.append('owner', auth.getUserId())
    picture.append('picture', image[0], image[0].name)

    axios.post(`/user/${auth.getUserId()}/image`, picture, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        // console.log(res.data)
        getData()
        setImageUpload(false)

      })
      .catch(err => console.error(err))
  }


  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });




  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


  const handleAfterRequestStates = (message) => {
    setMessage(message)
    setOpen(true)
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setMessage();
  };

  const handleFormSubmit = (e) => {

<<<<<<< HEAD
    const ref = `PDP ${auth.getUserId().substring(0, 10)} ${user.player_last_name}`
    const { type } = dialog
=======
    const yes = document.querySelector('#payment-confirm-yes').value

    // console.log({ payment: yes ? 'yes' : 'no' })
>>>>>>> e0de1b3482de3a5481d9c62d1c753bdab0def6ef

    axios.patch(`/users/${auth.getUserId()}`, {
      userId: auth.getUserId(),
      updates: {
        applications: {
          ajax_application: {
            ...application,
            post_app_actions: {
              ...application.post_app_actions,
              ...(type === 'payment' ? {
                payment_confirm: document.querySelector('#payment-confirm-yes').value === ref ? 'yes' : 'no'
              } : {
                  agree_tcs: 'yes'
                })
            }
          }
        }
      }
    }, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
      .then(res => {
        setDialog({
          ...dialog,
          open: false
        })
        getData()
      })
      .catch(res => {
        setDialog({
          ...dialog,
          open: false
        })
      })
  }

  async function handleRedirect() {

    const { stripeId, application_fee_paid } = user
    const fee_needed = (application_fee_paid === 'unpaid' && moment().isAfter(moment('05/31/2021')))

    handleAfterRequestStates({
      success: `${snackbar_messages['7a'][locale]} ${snackbar_messages['7g'][locale].split('/')[(fee_needed) ? 0 : 1]}`
    })

    // fee needed = unpaid application + date is after 14.04.21
    if (fee_needed) {
      let checkout = await axios.post('/korean-application-fee', {
        stripeId,
        email: user.email,
        locale,
        userId: auth.getUserId()
      })
      const session = await checkout.data

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        handleAfterRequestStates({ error: snackbar_messages['7b'][locale] })
      }
    } else {
      application?.submitted ? history.push('/challenges') : history.push('/application')
    }
  }

  function titleCase(str) {

    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  function applySentenceCase(str) {
    return str.replace(/.+?[.?!](\s|$)/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function scrollView(item) {
    // console.log(item)
    document.querySelector(`#${item}`).scrollIntoView({ block: 'center' })
    setCurrentScrollSection(item)
  }

  const attributesSection = [
    {
      att: `${app['5b'][locale]} (cm)`,
      value: application?.player_attributes.height
    },
    {
      att: `${app['5c'][locale]} (kg)`,
      value: application?.player_attributes.weight
    },
    {
      att: `${app['5d'][locale]}`,
      value: application?.player_attributes.other_positions.map((x, i) => `${titleCase(x)} ${i === 0 ? ', ' : ''}`)
    },
    {
      att: `${app['5e'][locale]}`,
      value: application && titleCase(application.player_attributes.preferred_foot)
    }
  ]

  const ageCampDates = {
    'Under 12s': {
      en: '31st May - 3rd June',
      ko: '2021년 5월 31일 ~ 6월 3일'
    },
    'Under 13s': {
      en: '5th June - 8th June',
      ko: '2021년 6월 5일 ~ 6월 8일'
    },
    'Under 14s': {
      en: '11th June - 14th June',
      ko: '2021년 6월 11일 ~ 6월 14일'
    },
    'Under 15s': {
      en: '16th June - 19th June',
      ko: '2021년 6월 16일 ~6월 19일'
    }
  }

  const nav = [profile['1b'], profile['1c'], profile['1d'], profile['1e']]
  if (!hasLoaded) return null
  return (

    <div className={classes.root}>

      {(application && application.hasOwnProperty('challenges_submitted')) && (
        <Paper id='nav' elevation={3} className={classes.menu}>
          <Typography component='div' >
            <Box
              fontSize={17}
              fontWeight="fontWeightBold" mb={3}>
              {profile['1a'][locale]}
            </Box>
          </Typography>

          <ul>

            {nav.map((item, i) => {
              return <li
                className={classes.listItems}
                style={{ fontWeight: currentScrollSection === item['en'] ? 'bold' : 'initial' }}
                onClick={() => scrollView(item['en'])}> {locale === 'en' ? titleCase(item['en'].replace(/-/g, i === 2 ? ' ' : ' & ')) : item['ko']} </li>
            })}
          </ul>
        </Paper>
      )}

      <Paper id='nav' elevation={3} className={classes.settings}>
        <Typography component='div' >
          <Box
            fontSize={17}
            fontWeight="fontWeightBold" mb={3}>
            {profile['2a'][locale]}
          </Box>
        </Typography>

        <ul>
          <li
            onClick={() => history.push(`/user/${auth.getUserId()}/two-factor`)}
            className={classes.listItems}> {profile['2b'][locale]} </li>
          <li className={classes.listItems}> {profile['2c'][locale]} </li>
          <li
            onClick={() => {
              auth.logOut()
              history.push('/')
            }}
            className={classes.logout}> {profile['2d'][locale]}</li>
        </ul>
      </Paper>

      {user ? (
        <div className={classes.container}>

          <Paper elevation={3} className={classes.profileHeader}>

            {/* image avatar */}
            <figure className={classes.imageContainer} onClick={(e) => input.current.click(e)}>
              <input ref={input}
                style={{ display: 'none' }} onChange={(e) => handleMediaChange(e)} type="file" />
              <img className={classes.image} alt='profile'
                src={user.imageURL ? user.imageURL : defaultPic} />
              <div className={classes.overlay}>
                <p className={classes.overlayText}>{profile['8c'][locale]}</p>
              </div>
            </figure>
            {/* user title */}

            <Typography className={classes.subHeading} component='div' >
              <Box
                fontSize={35}
                fontWeight="fontWeightBold" mb={3} pb={2}
                style={{ borderBottom: '1px solid #f1f1f1' }}>
                {user.name}
              </Box>

              {(application && application.hasOwnProperty('challenges_submitted')) && (
                <>
                  <Box
                    fontSize={13}
                    fontWeight="fontWeightRegular" mb={1}
                    style={{ color: '#3100F7', letterSpacing: '5px' }}>
                    CURRENTLY
                  </Box>
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular" mb={0.5}>
                    {/* {titleCase(application.football_history.current_club.club)} */}
                    <span style={{ fontWeight: "bold" }}>{profile['3b'][locale]}:</span>{`  ${titleCase(application.football_history.current_club.club)}`}
                  </Box>
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular" mb={0.5}>
                    {/* {titleCase(application.age_group)} */}
                    <span style={{ fontWeight: "bold" }}>{profile['3c'][locale]}</span>{`  ${titleCase(application.age_group)}`}
                  </Box>
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular">
                    {/* {titleCase(application.player_attributes.position)} */}
                    <span style={{ fontWeight: "bold" }}>{profile['3d'][locale]}</span>{`  ${titleCase(application.player_attributes.position)}`}
                  </Box>

                </>
              )}

            </Typography>
          </Paper>

          {(application && application.hasOwnProperty('challenges_submitted')) && (
            <Paper id={profile['1b']['en']} elevation={3} className={`${classes.otherSections} nav-sections`} >
              <Typography component='div' >
                <Box
                  fontSize={20}
                  fontWeight="fontWeightBold" mb={3}>
                  {locale === 'en' ? titleCase(profile['1b'][locale]) : profile['1b'][locale]}
                </Box>

                <Box
                  style={{ wordBreak: 'break-all' }}
                  id='truncate-text'
                  className='line-clamp'
                  fontSize={14}
                  fontWeight="fontWeightRegular" mb={1}>
                  {applySentenceCase(application.football_history.bio_description)}
                </Box>
              </Typography>

              <p className={classes.seeMore} onClick={(e) => {
                document.querySelector('#truncate-text').classList.remove('line-clamp')
                e.target.style.display = 'none'
              }}> {profile['4'][locale]} </p>


            </Paper>
          )
          }


          {
            (application?.ratings.indulge !== 'yes' || !application?.post_app_actions?.agree_tcs) ? (
              <Paper id={profile['1c']['en']} elevation={3} className={`${classes.otherSections} nav-sections`}>
                <TableContainer>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID </TableCell>
                        <TableCell align="right"> {profile['5b'][locale]}</TableCell>

                        {(application && application.hasOwnProperty('challenges_submitted')) &&
                          <TableCell align="right">  {profile['5c'][locale]} </TableCell>}

                        <TableCell align="right"> {profile['5d'][locale]}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="right">{auth.getUserId().substring(0, 10)}</TableCell>
                        <TableCell align="right"> PDP </TableCell>

                        {(application && application.hasOwnProperty('challenges_submitted')) &&
                          <TableCell align="right">
                            {locale === 'en' ? subDate : `${subDate.slice(-4)}년 ${date.getMonth(subDate.split(' ')[0])}월 ${subDate.split(' ')[1].replace(/\D/g, '')}일`}
                          </TableCell>}

                        <TableCell align="right" style={{ color: '#3100F7' }}>
<<<<<<< HEAD
                          {(application && application.hasOwnProperty('challenges_submitted')) ? application.ratings.indulge === 'yes' ? 'Accepted' : profile['5f'][locale] : profile['5e'][locale]}
=======
                          {(application && application.hasOwnProperty('challenges_submitted')) ? profile['5f'][locale] : profile['5e'][locale]}
>>>>>>> e0de1b3482de3a5481d9c62d1c753bdab0def6ef
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ) : (
                <Paper id='upcoming' elevation={3} className={`${classes.otherSections} nav-sections`}>
                  <Typography component='div' >
                    <Box
                      fontSize={20}
                      fontWeight="fontWeightBold" mb={3}>
                      Upcoming Camps
              </Box>
                  </Typography>

                  <TableContainer >
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="right"> {profile['5b'][locale]}</TableCell>

                          {(application && application.hasOwnProperty('challenges_submitted')) &&
                            <TableCell align="right"> Camp Date </TableCell>}

                          <TableCell align="right"> Payment </TableCell>
                          <TableCell align="right"> PDP Form</TableCell>
                          <TableCell align="right"> Itinerary</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="right"> PDP </TableCell>

                          <TableCell align="right">
                            {ageCampDates[application.age_group][locale]}
                          </TableCell>

                          <TableCell align="right">
                            {(!application.post_app_actions?.payment_confirm || application.post_app_actions?.payment_confirm === 'no') ?
                              <CancelSharpIcon style={{ color: 'red', fontSize: '17px', transform: 'translateY(3px)', marginRight: '6px' }} /> :
                              application.post_app_actions?.payment_confirm === 'yes' ?
                                <InfoIcon style={{ color: 'blue', fontSize: '17px', transform: 'translateY(3px)', marginRight: '6px' }} />
                                : <CheckCircleSharpIcon style={{ color: 'green', fontSize: '17px', transform: 'translateY(4px)', marginRight: '6px' }} />}

<<<<<<< HEAD
                            {(!application.post_app_actions?.payment_confirm || application.post_app_actions?.payment_confirm === 'no') ? <a onClick={() => setDialog({
                              type: 'payment',
                              open: true
                            })}> View </a>
=======
                            {(!application.post_app_actions || application.post_app_actions.payment_confirm === 'no') ? <Button onClick={() => setDialogOpen(true)}> View </Button>
>>>>>>> e0de1b3482de3a5481d9c62d1c753bdab0def6ef
                              : application.post_app_actions.payment_confirm === 'yes' ? 'In Review' : 'Confirmed'}

                          </TableCell>

                          <TableCell align="right" style={{ color: '#3100F7' }}>

                            {application.post_app_actions ?
                              Object.keys(application.post_app_actions).filter(x => application.post_app_actions[x] === '').length === 0 && application.post_app_actions.hasOwnProperty('allergies') ?
                                <CheckCircleSharpIcon style={{ color: 'green', fontSize: '17px', transform: 'translateY(4px)', marginRight: '6px' }} /> :
                                <CancelSharpIcon style={{ color: 'red', fontSize: '17px', transform: 'translateY(4px)', marginRight: '6px' }} /> :
                              <CancelSharpIcon style={{ color: 'red', fontSize: '17px', transform: 'translateY(4px)', marginRight: '6px' }} />
                            }
                            <Link
                              to={{
                                pathname: `/user/${auth.getUserId()}/pdp-form`,
                                state: application
                              }}> View </Link>
                          </TableCell>

                          <TableCell align="right">
                            <a target='_blank' rel='noopener noreferrer' href='https://indulgefootball.kr/PDP%20Sample%20Daily%20Itinerary.pdf'> View </a>
                          </TableCell>

                        </TableRow>

                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              )
          }

<<<<<<< HEAD

=======
          {/* <Paper>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID </TableCell>
                    <TableCell align="right"> {profile['5b'][locale]}</TableCell>

                    {(application && application.hasOwnProperty('challenges_submitted')) &&
                      <TableCell align="right">  {profile['5c'][locale]} </TableCell>}

                    <TableCell align="right"> {profile['5d'][locale]}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="right">{auth.getUserId().substring(0, 10)}</TableCell>
                    <TableCell align="right"> PDP </TableCell>

                    {(application && application.hasOwnProperty('challenges_submitted')) &&
                      <TableCell align="right">
                        {locale === 'en' ? subDate : `${subDate.slice(-4)}년 ${date.getMonth(subDate.split(' ')[0])}월 ${subDate.split(' ')[1].replace(/\D/g, '')}일`}
                      </TableCell>}

                    <TableCell align="right" style={{ color: '#3100F7' }}>
                      {(application && application.hasOwnProperty('challenges_submitted')) ? profile['5f'][locale] : profile['5e'][locale]}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper> */}
>>>>>>> e0de1b3482de3a5481d9c62d1c753bdab0def6ef

          {
            !application?.hasOwnProperty('challenges_submitted') && (
              <Box display="flex" flexDirection="column" textAlign="center">
                <Container style={{ marginBottom: '25px' }}>
                  {profile['9a'][locale].split(' / ').map(text => (
                    <Typography>{text}</Typography>
                  )
                  )}
                </Container>
                <Container style={{ marginBottom: '50px' }}>
                  <Button
                    style={{ width: '15rem', margin: '5px 10px' }}
                    variant='outlined'
                    color='primary'
                    disabled={application?.submitted}
                    onClick={() => handleRedirect()}>
                    {application ? application.submitted ? profile['8d'][locale] : profile['8a'][locale] : profile['8b'][locale]}
                  </Button>
                  <Button
                    style={{ width: '15rem', margin: '5px 10px' }}
                    variant='outlined'
                    color='primary'
                    disabled={!application?.submitted}
                    onClick={() => handleRedirect()}>
                    {locale === 'ko' ? '축구 챌린지' : 'Football Challenges'}
                  </Button>
                </Container>
              </Box>


            )
          }

          {(application && application.hasOwnProperty('challenges_submitted')) && (
            <>
              <Paper id={profile['1d']['en']} elevation={3} className={`${classes.otherSections} nav-sections`}>
                <Typography component='div' >
                  <Box
                    fontSize={20}
                    fontWeight="fontWeightBold" mb={3}>
                    {locale === 'en' ? titleCase(profile['1d'][locale]) : profile['1d'][locale]}
                  </Box>
                </Typography>

                {application.football_history.previous_clubs.map((el, i) => {
                  return (

                    <div className={classes.clubRow}>

                      <AdjustSharpIcon style={{ zIndex: 100, color: '#3100F7', }} />
                      {i !== application.football_history.previous_clubs.length - 1 && <div className={classes.connectorLine}></div>}

                      <Typography
                        style={{
                          position: 'relative',
                          width: '90%',
                          padding: '20px 0',
                          borderBottom: i !== application.football_history.previous_clubs.length - 1 ? '1px solid #f1f1f1' : ''
                        }}
                        component='div'>

                        <Box
                          fontSize={20}
                          fontWeight="fontWeightRegular" mb={1}>
                          {titleCase(el.club)}
                        </Box>
                        <Box
                          style={{ opacity: '0.75' }}
                          fontSize={14}
                          fontWeight="fontWeightRegular" mb={1}>
                          <span className={classes.chip}>
                            <PeopleAltSharpIcon style={{ color: '#3100F7', fontSize: '15px', transform: 'translateY(3px)', marginRight: '6px' }} />
                            {locale === 'en' ? titleCase(el.age_group) : el.age_group.replace('under ', 'U')} </span>

                          <span className={classes.chip}>

                            {el.k1_club ?
                              <CheckCircleSharpIcon style={{ color: 'green', fontSize: '15px', transform: 'translateY(3px)', marginRight: '6px' }} /> :
                              <CancelSharpIcon style={{ color: 'red', fontSize: '15px', transform: 'translateY(3px)', marginRight: '6px' }} />}

                            {profile['6'][locale]}

                          </span>
                        </Box>
                      </Typography>
                    </div>

                  )
                })}

              </Paper>

              <div id={profile['1e']['en']} className={`${classes.awardsSectionContainer} nav-sections`}>
                <Paper className={classes.awardSections} elevation={3}>
                  <Typography component='div' >
                    <Box
                      fontSize={20}
                      fontWeight="fontWeightBold" mb={3}>
                      Attributes
              </Box>
                  </Typography>

                  <ul>
                    {attributesSection.map(x => {
                      return (
                        <li className={classes.awardItems}>
                          <Box
                            fontSize={16}
                            fontWeight="fontWeightRegular" mb={-0.5}>
                            {x.att}
                          </Box>
                          <small style={{ fontSize: '12.5px', opacity: '0.75' }}> {x.value} </small>
                        </li>
                      )
                    })}

                  </ul>


                </Paper>

                {application.football_history.award_achieved && (
                  <Paper className={classes.awardSections} elevation={3}>
                    <Typography component='div' >
                      <Box
                        fontSize={20}
                        fontWeight="fontWeightBold" mb={3}>
                        Acheivements
                      </Box>
                    </Typography>

                    <ul>
                      <li className={classes.awardItems}>
                        <Box
                          fontSize={16}
                          fontWeight="fontWeightRegular" mb={-0.5}>
                          {application.football_history.award_name.toUpperCase()} Award
                        </Box>
                        <small style={{ fontSize: '12.5px', opacity: '0.75' }}> {application.football_history.award_date} </small>
                      </li>
                    </ul>
                  </Paper>
                )}

              </div>
            </>
          )
          }
        </div >
      ) : <CircularProgress size={65} className={classes.progress} />
      }


      {
        dialog.open && (
          <div>
            <Dialog
              open={dialog.open}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setDialog({
                ...dialog,
                open: false
              })}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
              <Box
                          fontSize={20}
                          fontWeight="fontWeightBold" mb={-1}>
                           {dialog.type === 'payment' ? 'Payment Details for PDP Complete Fee' : 'Terms & Conditions'}
                        </Box>
                        
               
              </DialogTitle>
              <DialogContent>

                {dialog.type === 'payment' ? (
                  <>
                    <DialogContentText id="alert-dialog-slide-description">

                    <div className={classes.label}>
                  <label>  Please use the payment details below for bank transfer and ensure you attach the payment reference below.</label>
                </div>

                      <Typography component='div' >
                        <Box
                          fontSize={17}
                          fontWeight="fontWeightBold" mb={.5} mt={2}>
                          Korean Branch 
                        </Box>
                        <Box
                          fontSize={14}
                          fontWeight="fontWeightRegular" mb={3}>
                          <ul>
                            <li> <strong> (Tax) Registration Number: </strong> 466-84-00025  </li>
                            <li> <strong> Business Registration Number: </strong> 285081-0000734 </li>
                            <li> <strong> Registered as: </strong> 엘에스알스포츠 주식회사 (LSR SPORTS LIMITED) </li>
                            <li> <strong> Date of Establishment: </strong> 28/03/2021 </li>
                          </ul>
                        </Box>
                      </Typography>

                      <Typography component='div' >
                        <Box
                          fontSize={17}
                          fontWeight="fontWeightBold" mb={.5}>
                          Korean Bank Account
                        </Box>
                        <Box
                          fontSize={14}
                          fontWeight="fontWeightRegular" mb={3}>
                          <ul>
                            <li> <strong> Bank: </strong> KEB Hana Bank </li>
                            <li> <strong> Acc Number: </strong> 189-910050-34304 </li>
                            <li> <strong> Account issued: </strong> 30/04/2021 </li>
                            <li> <strong> Bank Branch at: </strong> 서초동 (Seocho) </li>
                            <li> <strong> Account Holder Name:</strong> 엘에스알스포츠 주식회사 (LSR SPORTS LIMITED) </li>
                            <li> <strong> Swift Code: </strong> KOEXKRSE </li>
                          </ul>
                        </Box>
                      </Typography>
        
                      <Typography component='div' >
                        <Box
                          fontSize={17}
                          fontWeight="fontWeightBold" mb={.5}>
                          Payment Reference 
                        </Box>
                        <Box
                          fontSize={14}
                          fontWeight="fontWeightRegular" mb={3}>
                        <strong> {`PDP-AJAX-${auth.getUserId().substring(0, 5)}`}  </strong>  
                        </Box>
                      </Typography>
                    </DialogContentText>


                    <div className={classes.field}>
                <div className={classes.label}>
                  <label> Please confirm payment by typing in your payment reference </label>
                </div>
                {!application.post_app_actions?.payment_confirm && <p className="help"> Please leave this blank until you have made payment. Once saved, you will not be able to see again. </p>}
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                    <input
                      style={{ marginTop: '10px' }}
                                disabled={['yes', 'indulge'].includes(application.post_app_actions?.payment_confirm)}
                                class="input" type="text"
                                id='payment-confirm-yes'
                              />
                    </div>
                  </div>
                </div>
              </div>
                  </>
                      ) : (
                    <>
                        <DialogContentText id="alert-dialog-slide-description">

                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum interdum lectus eu tortor egestas pretium. Vestibulum ullamcorper leo nec felis varius porta. Praesent sit amet luctus tellus. Vivamus ut facilisis arcu. Ut placerat lectus ex, eu tempus mauris ultricies vel. Donec pellentesque nunc lacus, non interdum sapien consectetur placerat. Pellentesque laoreet malesuada ante tincidunt fringilla. Fusce eu tincidunt nisi, ut aliquet metus. Phasellus elementum vitae mauris a tristique.
    
    Vivamus at ultrices libero, in commodo libero. Aliquam tempus est enim, nec aliquet nunc viverra viverra. Mauris pharetra, turpis vitae convallis rutrum, odio libero consequat odio, sed congue magna libero sed lectus. Mauris sit amet tellus vitae nisi egestas aliquam. Nulla facilisi. Proin tincidunt tortor libero, at malesuada nisl dictum at. Suspendisse potenti. Mauris eu elit eget ligula accumsan mollis. Donec at commodo quam, placerat laoreet est. Suspendisse at mauris erat. Nullam eget mollis nulla.
    
    Sed eget urna pellentesque, dignissim risus non, placerat turpis. Donec tempus leo metus, ut convallis lorem tristique ut. Duis interdum eleifend ipsum. Proin quis porta nisi. Maecenas pharetra felis eu ex gravida, ac imperdiet nibh luctus. Donec congue viverra odio, eu auctor purus ornare eget. Nunc porttitor non enim at sollicitudin. Sed vestibulum massa urna, eget venenatis neque rhoncus in. Cras id luctus velit, non congue dolor. Fusce vehicula ultrices leo, ut pellentesque tellus vulputate vitae. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin orci urna, dignissim at justo non, luctus interdum mauris.
    
                      </DialogContentText>
                      </>
                      )}
    
    
              </DialogContent>

                    <DialogActions>
                      <Button variant='contained' onClick={() => setDialog({
                        ...dialog,
                        open: false
                      })} color='primary'>
                        Back
                </Button>
                      <Button variant='contained' onClick={handleFormSubmit} color='primary'>
                        {dialog.type === 'payment' ? 'Save' : 'I agree to the T&Cs'}
                      </Button>
                    </DialogActions>
                  </Dialog>
          </div>
              )
            }
      
      
      {
                message && <Snackbar
                  open={open}
                  autoHideDuration={5000}
                  onClose={closeSnackBar}>
                  <Alert onClose={closeSnackBar} severity={message.success ? 'success' : 'error'}>
                    {message.success ?
                      message.success :
                      message.error ?
                        message.error : (
                          Object.keys(message).map(x => <li> {message[x]} </li>)
                        )}
                  </Alert>
                </Snackbar>
              }



    </div >


            );
          };
          
export default ApplicantProfile;