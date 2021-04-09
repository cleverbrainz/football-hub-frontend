import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { application, snackbar_messages } from './LanguageSkeleton'
import auth from '../lib/auth'
import axios from 'axios'
import AdjustSharpIcon from '@material-ui/icons/AdjustSharp';
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import CancelSharpIcon from '@material-ui/icons/CancelSharp';
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';
import moment from 'moment'
import { useStripe } from "@stripe/react-stripe-js";

import {
  CircularProgress,
  Paper,
  Typography,
  Box,
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
      color: 'orange',
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
      color: 'orange',
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
    backgroundColor: 'orange',
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
  const [open, setOpen] = useState()
  const [message, setMessage] = useState()



  useEffect(() => {
    axios.get(`/users/${match.params.id}`)
      .then(res => {
        const { applications } = res.data[0]
        setUser(res.data[0])

        if (applications.benfica_application) {
          setApplication(applications.benfica_application)
        }
      })
  }, [])





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

  async function handleRedirect() {

    const { stripeId, application_fee_paid } = user
    const fee_needed = (application_fee_paid === 'unpaid' && moment().isAfter(moment('03/20/2021')))

    handleAfterRequestStates({
      success: `${snackbar_messages['7a'][locale]} ${snackbar_messages['7g'][locale].split('/')[fee_needed ? 0 : 1]}`
    })

    // fee needed = unpaid application + date is after 14.04.21
    if (fee_needed) {
      let checkout = await axios.post('/korean-application-fee', {
        stripeId,
        email: user.email,
        locale
      })
      const session = await checkout.data

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        handleAfterRequestStates({ error: snackbar_messages['7b'][locale] })
      }
    } else {
      history.push('/application')
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
    return str.replace(/.+?[\.\?\!](\s|$)/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  function scrollView(item) {
    console.log(item)
    document.querySelector(`#${item}`).scrollIntoView({ block: 'center' })
    setCurrentScrollSection(item)
  }

  const nav = ['about', 'applications', 'football-history', 'skills-awards']

  return (

    <div className={classes.root}>

      {(application && application.hasOwnProperty('submitted')) && (
        <Paper id='nav' elevation={3} className={classes.menu}>
          <Typography component='div' >
            <Box
              fontSize={17}
              fontWeight="fontWeightBold" mb={3}>
              Sections
          </Box>
          </Typography>

          <ul>

            {nav.map((item, i) => {
              return <li
                className={classes.listItems}
                style={{ fontWeight: currentScrollSection === item ? 'bold' : 'initial' }}
                onClick={() => scrollView(item)}> {titleCase(item.replace(/-/g, i === 2 ? ' ' : ' & '))} </li>
            })}
          </ul>
        </Paper>
      )}

      <Paper id='nav' elevation={3} className={classes.settings}>
        <Typography component='div' >
          <Box
            fontSize={17}
            fontWeight="fontWeightBold" mb={3}>
            Account Settings
          </Box>
        </Typography>

        <ul>
          <li
            onClick={() => history.push(`/user/${auth.getUserId()}/two-factor`)}
            className={classes.listItems}> Two Factor Authentication </li>
          <li className={classes.listItems}> Profile Details </li>
          <li
            onClick={() => {
              auth.logOut()
              history.push('/')
            }}
            className={classes.logout}> Log Out</li>
        </ul>
      </Paper>

      {user ? (
        <div className={classes.container}>

          <Paper elevation={3} className={classes.profileHeader}>

            {/* image avatar */}
            <figure className={classes.imageContainer}>
              <img className={classes.image} alt='profile'
                src='https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80' />
            </figure>
            {/* user title */}

            <Typography className={classes.subHeading} component='div' >
              <Box
                fontSize={35}
                fontWeight="fontWeightBold" mb={3} pb={2}
                style={{ borderBottom: '1px solid #f1f1f1' }}>
                {user.name}
              </Box>

              {(application && application.hasOwnProperty('submitted')) && (
                <>
                  <Box
                    fontSize={13}
                    fontWeight="fontWeightRegular" mb={1}
                    style={{ color: 'orange', letterSpacing: '5px' }}>
                    CURRENTLY
                  </Box>
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular" mb={0.5}>
                      {/* {titleCase(application.football_history.current_club.club)} */}
                    <span style={{fontWeight: "bold"}}>Club:</span>{`  ${titleCase(application.football_history.current_club.club)}`}
                  </Box>
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular" mb={0.5}>
                    {/* {titleCase(application.age_group)} */}
                    <span style={{fontWeight: "bold"}}>Age Group:</span>{`  ${titleCase(application.age_group)}`}
                  </Box>
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular">
                    {/* {titleCase(application.player_attributes.position)} */}
                    <span style={{fontWeight: "bold"}}>Position:</span>{`  ${titleCase(application.player_attributes.position)}`}
                  </Box>

                </>
              )}

            </Typography>
          </Paper>

          {(application && application.hasOwnProperty('submitted')) && (
            <Paper id='about' elevation={3} className={`${classes.otherSections} nav-sections`} >
              <Typography component='div' >
                <Box
                  fontSize={20}
                  fontWeight="fontWeightBold" mb={3}>
                  About
              </Box>

                <Box
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
              }}> see more </p>


            </Paper>
          )}


          <Paper id='applications' elevation={3} className={`${classes.otherSections} nav-sections`}>
            <Typography component='div' >
              <Box
                fontSize={20}
                fontWeight="fontWeightBold" mb={3}>
                Applications
              </Box>
            </Typography>

            <TableContainer >
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID </TableCell>
                    <TableCell align="right"> Name</TableCell>
                    {(application && application.hasOwnProperty('submitted')) &&
                      <TableCell align="right"> Submitted </TableCell>}
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="right">{auth.getUserId().substring(0, 10)}</TableCell>
                    <TableCell align="right"> Indulge Benfica Camp </TableCell>
                    {(application && application.hasOwnProperty('submitted')) &&
                      <TableCell align="right"> {moment(application.submission_date).format('MMMM Do YYYY')} </TableCell>}
                    <TableCell align="right" style={{ color: 'orange' }}> Pending </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {!application?.hasOwnProperty('submitted') && (
            <Button
              style={{ width: '15rem', margin: '0 auto' }}
              variant='outlined'
              color='primary'
              onClick={() => handleRedirect()}>
              {application ? 'Continue application' : 'Start application'}
            </Button>
          )}

          {(application && application.hasOwnProperty('submitted')) && (
            <>
              <Paper id='football-history' elevation={3} className={`${classes.otherSections} nav-sections`}>
                <Typography component='div' >
                  <Box
                    fontSize={20}
                    fontWeight="fontWeightBold" mb={3}>
                    Football History
              </Box>
                </Typography>

                {application.football_history.previous_clubs.map((el, i) => {
                  return (

                    <div className={classes.clubRow}>

                      <AdjustSharpIcon style={{ zIndex: 100, color: 'orange', }} />
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
                            <PeopleAltSharpIcon style={{ color: 'orange', fontSize: '15px', transform: 'translateY(3px)', marginRight: '6px' }} />
                            {titleCase(el.age_group)} </span>

                          <span className={classes.chip}>

                            {el.k1_affiliated ?
                              <CheckCircleSharpIcon style={{ color: 'green', fontSize: '15px', transform: 'translateY(3px)', marginRight: '6px' }} /> :
                              <CancelSharpIcon style={{ color: 'red', fontSize: '15px', transform: 'translateY(3px)', marginRight: '6px' }} />}

                            K1 Affiliated
                          </span>
                        </Box>
                      </Typography>
                    </div>

                  )
                })}

              </Paper>

              <div id='skills-awards' className={`${classes.awardsSectionContainer} nav-sections`}>
                <Paper className={classes.awardSections} elevation={3}>
                  <Typography component='div' >
                    <Box
                      fontSize={20}
                      fontWeight="fontWeightBold" mb={3}>
                      Skills
              </Box>
                  </Typography>

                  <ul>
                    <li className={classes.skillItems}>Dribbling in tight spaces</li>
                    <li className={classes.skillItems}>Shooting with accuracy</li>
                    <li className={classes.skillItems}>Close ball control </li>
                    <li className={classes.skillItems}>Passing to open up defence</li>
                    <li className={classes.skillItems}>Speed to get up and down the wing</li>
                    <li className={classes.skillItems}>Overall finesse. Match winner</li>
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
          )}
        </div>
      ) : <CircularProgress size={65} className={classes.progress} />}



      {message && <Snackbar
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
      </Snackbar>}

      

    </div>


  );
};

export default ApplicantProfile;