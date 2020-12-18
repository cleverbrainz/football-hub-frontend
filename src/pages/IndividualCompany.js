import React, {useState, useEffect } from 'react'
import { Typography, 
  Box, 
  Card, 
  CardActions, 
  CardContent, 
  Button, 
  Avatar, 
  Divider,
  Accordion,
  AccordionDetails,
  AccordionSummary } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import VerifiedUserSharpIcon from '@material-ui/icons/VerifiedUserSharp';
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore' 
import EnquiryModal from '../components/EnquiryModal'
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import CallIcon from '@material-ui/icons/Call';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import { TimelineLite, Power2 } from 'gsap'
import CourseBookingDialogue from '../components/CourseBookingDialogue'
import Slide from '@material-ui/core/Slide';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Footer from '../components/Footer'
import Snackbar from '@material-ui/core/Snackbar';
import auth from '../lib/auth'
import axios from 'axios'
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'space-between',
    width: '100vw'
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
  reviewSection: {
    height: '100%',
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between'
  },
  image: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('md')]: {
      width: '64.5%',
    },
    position: 'relative'
  },
  imageContainer: {
    display: 'flex',
    width: '100%',
    height: '70vh',
    justifyContent: 'space-between'
  },
  slideshowRoot: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    // objectFit: 'cover',
    position: 'relative',
  },
  slideshowContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    transition: '0.2s'
  },
  slideArrows: {
    zIndex: '100',
    width: '100%',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icons: {
    fontSize: '45px',
    color: 'white',
    '&:hover': {
      cursor: 'pointer',
    }
  },
  secondaryImages: {
    display: 'none',
    flexDirection: 'column', 
    width: '34.5%', 
    height: '100%', 
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    },
  },
  description: {
    [theme.breakpoints.up('md')]: {
      width: '55%'
    },
  },
  coachContainer: {
    [theme.breakpoints.up('md')]: {
      width: '37%'
    },
  },
  staffRoot: {
    display: 'flex',
    alignItems: 'center',
    margin: '25px 0'
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginRight: 20
  },
  reviewAvatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: 20
  },
  reviewCard: {
    
    margin: '20px 0',
    [theme.breakpoints.up('md')]: {
      width: '45%' 
    }
  },
  accordion: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  social: {
    display: 'flex',
    alignItems: 'center',
    margin: '30px 0',
  },
  formControl: {
    margin: theme.spacing(0),
    minWidth: '100%',
  },
}))


const IndividualCompany = ({ location }) => {
  const classes = useStyles()
  const [modalOpen, setModal] = useState(false)
  const [selectedService, setSelectedService] = useState()
  const { companyName, images, bio, reasons_to_join, coaches, camps, services, courses, companyId } = location.state
  const name = companyName.charAt(0).toUpperCase() + companyName.slice(1)
  const [userCategory, setUserCategory] = useState('')
  const [open, setOpen] = React.useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState({
    courseType: null,
    course: null
  })
  const reviews = [...Array(6).keys()]

  let count = 1
  let currentPosition = 0


  useEffect(() => {
    if (!auth.getUserId()) return
    axios.get(`/users/${auth.getUserId()}`)
      .then(res => {
        const category = res.data[0].category
        setUserCategory(category)
      })
  },[])

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackBarOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleModal = service => {
    if (modalOpen === false) setSelectedService(service)
    setModal(!modalOpen)
  }

  const HandleSlide = (e) => {
  
    const size = document.querySelector('#slideshow').clientWidth
    const t1 = new TimelineLite()

    if (e.target.tagName === 'path') e.target = e.target.parentNode

    if (e.target.id === 'right') {
      if (count === images.length) {
        return
      }

      t1.to('#slideshow', 0.1, { filter: 'blur(1px)' })
        .to('#slideshow', 0.1, { transform: `translateX(-${size * count}px)` })
        .to('#slideshow', 0.15, { filter: 'blur(0)' }, '+=0.1')
      count++
      currentPosition += size
      console.log(count, images.length)
    } else if (e.target.id === 'left'){
      if (count === 1) {
        return
      }

      t1.to('#slideshow', 0.1, { filter: 'blur(1px)' })
        .to('#slideshow', 0.1, { transform: `translateX(-${currentPosition - size}px)` })
        .to('#slideshow', 0.15, { filter: 'blur(0)' }, '+=0.1')
      count--
      currentPosition -= size
    }
  }

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });



  return (
    <>
      <div className={classes.root}>

        <section className={classes.section}>
          <div>
            <Typography style={{ margin: '50px 0' }} component='div' >
              <Box
                fontSize={40} fontWeight="fontWeightBold" m={0}>
                {name}
              </Box>
            </Typography>

            <div className={classes.imageContainer}>
              <section  className={classes.image}>
                <div className={classes.slideArrows}>
                  <KeyboardArrowLeft className={classes.icons}
                  id='left' onClick={(e) => HandleSlide(e)} />
                  <KeyboardArrowRight className={classes.icons}
                  id='right' onClick={(e) => HandleSlide(e)} />
                </div>
                <div className={classes.slideshowRoot}>
                  <div id='slideshow' className={classes.slideshowContainer} >
                    {images && images.map((el, i) => <img style={{objectFit: 'cover'}} src={el} key={i} alt='' /> ).reverse()}
                  </div>
                </div>
              </section>

              <div className={classes.secondaryImages} >
                <img style={{ height: '49%', width: '100%', objectFit: 'cover' }} src={images[0] ? images[0] :"https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"} alt="" />
                <img style={{ height: '49%', width: '100%', objectFit: 'cover' }} src={images[1] ? images[1] :"https://images.unsplash.com/photo-1524748969064-cf3dabd7b84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1568&q=80"} alt="" />
              </div>

            </div>
          </div>


        </section>

        <section className={classes.section}>

        

          <div className={classes.description}>
            <Typography style={{ margin: '70px 0 30px 0' }} component='div' >
              <Box
                fontSize={25} fontWeight="fontWeightBold" m={0}>
                Who are we?
              </Box>
            </Typography>

            <p style={{ textAlign: "justify" }}>
              {bio}
            </p>

            {reasons_to_join.map((el, i) => {
              return (
                <Typography key={i} component='div' >
                <Box
                  fontSize={17} style={{display: 'flex', alignItems: 'center', margin: '30px 0'}} fontWeight="fontWeightBold" m={0}>
                    <CheckCircleSharpIcon style={{color: 'lightseagreen', marginRight:'20px'}}/>
                  {el}
                  
                </Box>
              </Typography>
              )
            })}
           

          </div>

          <div className={classes.coachContainer}>
            <Typography style={{ margin: '70px 0 30px 0' }} component='div' >
              <Box
                fontSize={25} fontWeight="fontWeightBold" m={0}>
                Meet the coaches
              </Box>
            </Typography>


            {/* card */}

            {coaches.map((el, i) => {

              const { name, coaching_level } = el.coachInfo
              return (

                <>

                <div key={i} className={classes.staffRoot}>
                  <Avatar className={classes.avatar} alt="Remy Sharp" src={el.imageURL} />

                  <div>
                    <Typography variant='h6' gutterBottom>
                      {name}
                  </Typography>

                    <Typography component='div' >
                      <Box
                        style={{ display: 'flex', alignItems: 'center' }} fontSize={17} fontWeight="fontWeightRegular" m={0}>
                        {coaching_level} Verified
                  <VerifiedUserSharpIcon style={{ color: 'goldenrod', marginLeft: '10px' }} />
                      </Box>
                    </Typography>
                  </div>
                </div>

                <Divider />
              </>
                   

              )
            })}

          </div>
        </section>


        <Divider style={{width: '80%', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.2)', margin: '55px 0 30px 0'}} />


            {/* booking and services */}

            <section className={classes.section}>

              <div className={classes.description}>
              

            <Typography style={{ margin: '70px 0 30px 0' }} component='div' >
              <Box
                fontSize={19} fontWeight="fontWeightBold" m={0}>
                Book onto a course
              </Box>
            </Typography>

          { (auth.isLoggedIn() && ['company', 'coach'].some(item => item !== userCategory)) ?  (
            <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Select Course</InputLabel>
            <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  label='Select Course'
                  value={selectedBooking.courseType === 'course' && selectedBooking.course}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, 
                  courseType: 'course', course: e.target.value })}>
                    
                  {courses.map((el, i) => {
                    const { age, location } = el.courseDetails
                      return (
                        <MenuItem value={i}>{`Weekly course for ${age} at ${location}`}</MenuItem>
                      )
                    })}

            </Select>
            </FormControl>

          ) : <p style={{color: 'blue'}}> Please login to book onto a course </p>}  

      {selectedBooking.courseType === 'course' &&  (
      
      <FormControl variant="outlined" style={{margin: '15px 0'}} className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">Select Session</InputLabel>
        <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              label='Select Session'
              onChange={(e) => {
                setOpen(true)
                setSelectedBooking({ ...selectedBooking, session: e.target.value })
              }}
              >
               {courses[selectedBooking.course].courseDetails.sessions.map((el, i) => {
                 const { day, endTime, startTime, spaces } = el
                  return (
                    <MenuItem value={i}>{`${day} sessions from ${startTime} to ${endTime}`}  
                      {` - ${spaces} spaces available`} 
                    </MenuItem>
                  )
                })}

        </Select>
      </FormControl>

      
      )}

<Typography style={{ margin: '70px 0 30px 0' }} component='div' >
              <Box
                fontSize={19} fontWeight="fontWeightBold" m={0}>
                Book onto a camp
              </Box>
            </Typography>

          { (auth.isLoggedIn() && ['company', 'coach'].some(item => item !== userCategory)) ? (
            <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">Select Camp</InputLabel>
            <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  label='Select Course'
                  value={selectedBooking.courseType === 'camp' && selectedBooking.course}
                  onChange={(e) => {
                    setOpen(true)
                    setSelectedBooking({ ...selectedBooking, 
                    courseType: 'camp', course: e.target.value })}}>
                    
                  {camps.map((el, i) => {
                    const { age, location } = el.courseDetails
                    console.log(el)
                      return (
                        <MenuItem value={i}>{`${location} football camp for ${age}`}</MenuItem>
                      )
                    })}

            </Select>
            </FormControl>

          ) : <p style={{color: 'blue'}}> Please login to book onto a camp</p>}  

          

                {open && 
                <CourseBookingDialogue
                    openSnackBar={() => setSnackBarOpen(true)}
                    companyId={companyId}
                    companyName={companyName}
                    camps={camps}
                    selectedBooking={selectedBooking}
                    courses={courses}
                    Transition={Transition}
                    open={open}
                    handleClose={(e) => handleClose(e)}
                  />
                }
                  
              </div>

              <div className={classes.coachContainer}>
              <Typography style={{ margin: '70px 0 30px 0' }} component='div' >
              <Box
                fontSize={25} fontWeight="fontWeightBold" m={0}>
                Services 
              </Box>
            </Typography>

            {services.map((el, i) => {
              return (
                <Accordion key={i}>
                  <AccordionSummary
                    style={{minHeight: '70px'}}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography className={classes.accordion}> {el.name} </Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'block'}}>
                    <Typography>
                    {el.description}
                    </Typography>

                  {auth.isLoggedIn() ? (
                  <Button onClick={() => toggleModal(el.name)} variant="contained" style={{margin: '20px 0 5px 0'}}>
                    Click to enquire
                  </Button>
                  ) : <p  style={{margin: '20px 0 5px 0', color: 'blue'}}> Please login to make an enquiry </p>}  
                  </AccordionDetails>

                  
                </Accordion>
              )
            })}
            
              <Typography style={{ margin: '70px 0 30px 0' }} component='div' >
              <Box
                fontSize={25} fontWeight="fontWeightBold" m={0}>
                Get in touch
              </Box>
            </Typography>

            <div className={classes.social}> 
              <LocationOnIcon style={{fontSize: '32px', marginRight: '15px'}} /> 
              <p>London, United Kingdom</p>  
            </div>


            <div className={classes.social}> 
              <CallIcon style={{fontSize: '32px', marginRight: '15px'}}/> 
              <p> 0123456789 </p> 
            </div>

            <div className={classes.social}> 
              <InstagramIcon style={{fontSize: '32px', marginRight: '15px'}}/> 
              <p> @footballcompany </p>  
            </div>

            <div className={classes.social}> 
              <FacebookIcon style={{fontSize: '32px', marginRight: '15px'}}/> 
              <p> @footballcompany </p>  
            </div>

              </div>

            </section>


        <Divider style={{width: '80%', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.2)', margin: '55px 0 30px 0'}} />
        {/* reviews */}

        <section className={classes.reviewSection}>
        <Typography style={{ margin: '30px 0' }} component='div' >
              <Box
                fontSize={25} fontWeight="fontWeightBold" m={0}>
                Client reviews
              </Box>
            </Typography>

            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>

              {reviews.map((el, i) => {
                return (
                <Card className={classes.reviewCard} key={i} >
                  <CardContent >

                    <Typography component='div' >
                      <Box style={{ display: 'flex', alignItems: 'center'}} 
                        fontSize={19} fontWeight="fontWeightRegular" m={0}>
                        <Avatar className={classes.reviewAvatar} alt="Remy Sharp" src="https://images.unsplash.com/photo-1442458370899-ae20e367c5d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80" />
                        Jane Doe
                        <VerifiedUserSharpIcon style={{ color: 'lightseagreen', margin: '0 0 2px 10px' }} />
                      </Box>
                    </Typography>



                      <Typography style={{margin: '10px 0 0 6px'}} fontWeight="fontWeightRegular" m={0}>
                          Maecenas condimentum tellus quam, eu vestibulum diam tempor ut.
              Duis tincidunt pretium mauris vitae bibendum. Vivamus nec nunc quis arcu volutpat hendrerit sed
              volutpat leo. Nunc viverra vulputate pulvinar.
                  
                  
                      </Typography>
            
                  </CardContent>
                </Card>
                )
              })}
            
            </div>
        </section>
        <Divider style={{width: '80%', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: '55px'}} />
      </div>

   

      <Footer />

      <Snackbar open={snackBarOpen} autoHideDuration={2000} onClose={closeSnackBar}>
        <Alert onClose={closeSnackBar} severity="success">
          Message sent successfully!
        </Alert>
      </Snackbar>


      {
        modalOpen && <EnquiryModal
        openSnackBar={() => setSnackBarOpen(true)}
          toggleModal={() => toggleModal()}
          selectedService={selectedService}
          companyId={companyId}
          companyName={companyName} />
      }


    </>
  )
}

export default IndividualCompany