import { Avatar, Box, Button, Card, CardActions, CardContent, Divider, Paper, Typography, Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardArrowLeft, KeyboardArrowRight, ExpandMore } from "@material-ui/icons";
import CheckCircleSharpIcon from '@material-ui/icons/CheckCircleSharp';
import VerifiedUserSharpIcon from '@material-ui/icons/VerifiedUserSharp';
import EmailIcon from '@material-ui/icons/Email';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import ComputerIcon from '@material-ui/icons/Computer';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import { TimelineLite, gsap } from 'gsap';
import React, { useEffect, useState } from 'react';
import CourseBookingDialogue from '../components/CourseBookingDialogue';
import EnquiryModal from '../components/EnquiryModal';
import Footer from '../components/Footer';
import auth from '../lib/auth';
import { campMultiDayCollection } from '../lib/firebase';
import Stripe from '../pages/Stripe'
import PreCheckoutLogin from '../components/PreCheckoutLogin'
import { set } from 'date-fns';
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
gsap.registerPlugin(CSSRulePlugin);


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent:'space-between',
    width: '100vw'
  },
  preview: {
    border: '10px solid red'
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
  subtitle: {
    display: 'block',
    textDecoration: 'underline',
    marginTop: '10px'
  }
}))


const IndividualCompany = ({ location, history, match }) => {
  const { preview, listingId } = match.params
  const classes = useStyles()
  const [modalOpen, setModal] = useState(false)
  const [previewPage, setPreviewPage] = useState(preview ? true : false)
  const [previewData, setPreviewData] = useState()
  const { companyName, bio, reasons_to_join, coaches, camps, services, courses, companyId, accountId } = previewPage ? previewData ? previewData : {} : location.state
  const name = companyName ? companyName.charAt(0).toUpperCase() + companyName.slice(1) : ''
  const [userCategory, setUserCategory] = useState('')
  const [open, setOpen] = React.useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState({
    ageFilter: null,
    courseType: null,
    course: null
  })
const [ageSelection, setAgeSelection] = useState()
const [listingImages, setListingImages] = useState()
const [companyContactInfo, setCompanyContactInfo] = useState()
const [loginBeforeEnquiry, setLoginBeforeEnquiry] = useState(false)
// console.log(preview)

  const reviews = [...Array(6).keys()]

  let count = 1
  let currentPosition = 0

  async function getListingImages(companyId) {
    const data = await axios.get(`/users/${companyId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
    const { images, contactInformation } = await data.data[0]
    console.log('THISSS IS IMAGESSS', images)
    setListingImages(images)
    setCompanyContactInfo(contactInformation)
  }


  useEffect(() => {
    // console.log(images)
    const ageArr = []

    if (previewPage && !previewData) {
      console.log(companyId)
      axios.get(`/listings/${listingId}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        getListingImages(res.data.companyId)
        res.data.courses.forEach(el => {
          const { age } = el.courseDetails
          !ageArr.includes(age) && ageArr.push(age)
        })
        setAgeSelection(ageArr)
        setPreviewData(res.data)
      })
    } else {
    getListingImages(companyId)
    courses.forEach(el => {
      const { age } = el.courseDetails
      !ageArr.includes(age) && ageArr.push(age)
    })
    setAgeSelection(ageArr)
    
    if (!auth.getUserId()) return
    axios.get(`/users/${auth.getUserId()}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        const category = res.data[0].category
        setUserCategory(category)
      })
    }
    
  },[])

  const handleClose = () => {
    setOpen(false);
  };


  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const closeSnackBar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackBarOpen(false);
  };

 

  const toggleModal = service => {
    if (!auth.isLoggedIn()) {
      setLoginBeforeEnquiry(true)
    } else {
      // if (modalOpen === false) setSelectedService(service)
      setLoginBeforeEnquiry(false)
      setModal(!modalOpen)
    }
   
  }

  const HandleSlide = (e) => {
  
    const size = document.querySelector('#slideshow').clientWidth
    const t1 = new TimelineLite()

    if (e.target.tagName === 'path') e.target = e.target.parentNode

    if (e.target.id === 'right') {
      if (count === listingImages.length) {
        return
      }

      t1.to('#slideshow', 0.1, { filter: 'blur(1px)' })
        .to('#slideshow', 0.1, { transform: `translateX(-${size * count}px)` })
        .to('#slideshow', 0.15, { filter: 'blur(0)' }, '+=0.1')
      count++
      currentPosition += size
      console.log(count, listingImages.length)
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

  if (previewPage && !previewData) return null
  return (
    <>
      <div className={!previewPage ? classes.root : `${classes.root} ${classes.preview}`}>

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
                    {listingImages && listingImages.map((el, i) => {
// console.log(el)
return (
  <img style={{minWidth: '100%', objectFit: 'fill'}} src={el} key={i} alt='' /> 
)
                    } ).reverse()}
                  </div>
                </div>
              </section>

              <div className={classes.secondaryImages} >
                <img style={{ height: '49%', width: '100%', objectFit: 'fill' }} src={listingImages && listingImages[0]}
                  // ? listingImages[0] :"https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"} 
                  alt="" />
                <img style={{ height: '49%', width: '100%', objectFit: 'fill' }} src={listingImages && listingImages[1]}
                //  ? listingImages[1] :"https://images.unsplash.com/photo-1524748969064-cf3dabd7b84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1568&q=80"} 
                alt="" />
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

              const { name, coaching_level, imageURL } = el.coachInfo
              return (

                <>

                <div key={i} className={classes.staffRoot}>
                  <Avatar className={classes.avatar} alt="Remy Sharp" src={imageURL} />

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


        <section className={classes.section}>

        <div className={classes.description}>
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
                    expandIcon={<ExpandMore />}
                  >
                    <Typography className={classes.accordion}> {el.name} </Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'block'}}>
                    <Typography>
                    {el.description}
                    </Typography>

                  {/* {auth.isLoggedIn() ? ( */}
                  <Button onClick={() => toggleModal(el.name)} variant="contained" style={{margin: '20px 0 5px 0'}}>
                    Click to enquire
                  </Button>
                  {/* ) : <p  style={{margin: '20px 0 5px 0', color: 'blue'}}> Please login to make an enquiry </p>}   */}
                  </AccordionDetails>

                  
                </Accordion>
              )
            })}
          </div>

             <div className={classes.coachContainer}>

              <Typography style={{ margin: '70px 0 30px 0' }} component='div' >
              <Box
                fontSize={25} fontWeight="fontWeightBold" m={0}>
                Get in touch
              </Box>
            </Typography>


           
              <div className={classes.social}> 
                <EmailIcon style={{fontSize: '25px', marginRight: '15px'}}/> 
                <p> {companyContactInfo && companyContactInfo.adminEmail}</p>  
              </div>

              <div className={classes.social}> 
                <ComputerIcon style={{fontSize: '25px', marginRight: '15px'}}/> 
                <p> {companyContactInfo && companyContactInfo.website} </p>  
              </div>

              <div className={classes.social}> 
                <FacebookIcon style={{fontSize: '25px', marginRight: '15px'}}/> 
                <p> {companyContactInfo && companyContactInfo.facebook} </p>  
              </div>
              
              <div className={classes.social}> 
                <InstagramIcon style={{fontSize: '25px', marginRight: '15px'}}/> 
                <p> {companyContactInfo && companyContactInfo.instagram} </p>  
              </div>
              
              <div className={classes.social}> 
                <TwitterIcon style={{fontSize: '25px', marginRight: '15px'}}/> 
                <p> {companyContactInfo && companyContactInfo.twitter} </p>  
              </div>
            </div>
            

        </section>

        <Divider style={{width: '80%', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.2)', margin: '55px 0 30px 0'}} />

            {/* booking and services */}

            <section className={classes.section}>

              <div className={classes.description}>
              
              <Typography style={{ margin: '40px 0 30px 0' }} component='div' >
              <Box
                fontSize={25} fontWeight="fontWeightBold" m={0}>
                Book with us
              </Box>
            </Typography>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label"> Select Age Group </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                label='Select Age Group'
                value={selectedBooking.ageFilter}
                onChange={e => setSelectedBooking({ ...selectedBooking, ageFilter: e.target.value })}>

                {ageSelection && ageSelection.map((el, i) => <MenuItem value={el}>{el}</MenuItem> )}

              </Select>
            </FormControl>
                

            {(['company', 'coach'].some(item => item !== userCategory) && selectedBooking.ageFilter) && (

              <>
            <Typography style={{ margin: '40px 0 30px 0' }} component='div' >
            <Box
              fontSize={19} fontWeight="fontWeightBold" m={0}>
            Courses
            </Box>
              </Typography>


              <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">Select Course</InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                label='Select Course'
                value={selectedBooking.courseType === 'course' && selectedBooking.course}
                onChange={(e) => {
                  setOpen(true)
                  setSelectedBooking({ ...selectedBooking, 
                courseType: 'course', course: e.target.value }
                )}}>

                {courses.map((el, i) => {
                  const { age, sessions, optionalName } = el.courseDetails
                  const sessionDays = sessions.map(el => el.day)
                  // console.log(sessionDays)
                  if (selectedBooking.ageFilter.includes(age)) {
                    return (
                    <MenuItem value={el}>{`${optionalName} weekly course for ${age} on ${sessionDays.toString().replace(/,/g, ' & ')}`}  </MenuItem>
                    )
                  }
                  })}

              </Select>
            </FormControl>
                
                
                
            <Typography style={{ margin: '50px 0 30px 0' }} component='div' >
            <Box
              fontSize={19} fontWeight="fontWeightBold" m={0}>
              Camps
            </Box>
            </Typography>
                
              
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
                  const { age, location, firstDay, lastDay } = el.courseDetails
                    if (selectedBooking.ageFilter.includes(age)) {
                      return (
                        <MenuItem value={el}> {`Football camp for ${age} @ ${location} from ${firstDay} - ${lastDay} `} </MenuItem>
                      )
                    }
                  })}

                </Select>
                </FormControl>
                </>
            )}
          
                  
              </div>

              <div className={classes.coachContainer}>

            {(open) && (accountId ? (
            <Stripe
              selectedBooking={selectedBooking}
              courses={courses}
              classes={classes}
              accountId={accountId}
              preview={previewPage}
             /> ) : 
            (
              <CourseBookingDialogue
                openSnackBar={() => setSnackBarOpen(true)}
                companyId={companyId}
                companyName={companyName}
                camps={camps}
                selectedBooking={selectedBooking}
                courses={courses}
                Transition={Transition}
                handleClose={(e) => handleClose(e)}
            />
            ))}
           
            
            
              </div>

            </section>


        <Divider style={{width: '80%', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.2)', margin: '55px 0 30px 0'}} />
        {/* reviews */}

        {/* <section className={classes.reviewSection}>
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
        </section> */}
        {/* <Divider style={{width: '80%', height: '1px', backgroundColor: 'rgba(0, 0, 0, 0.2)', marginTop: '55px'}} /> */}
      </div>

   

      <Footer />

      <Snackbar open={snackBarOpen} autoHideDuration={2000} onClose={closeSnackBar}>
        <Alert onClose={closeSnackBar} severity="success">
          Message sent successfully!
        </Alert>
      </Snackbar>


      {loginBeforeEnquiry && <PreCheckoutLogin 
      open={loginBeforeEnquiry}
      handleClose={() => setLoginBeforeEnquiry(false)}
      followUpAction={'general'}
      toggleModal={() => toggleModal()}
      />}

      {
        (modalOpen && !loginBeforeEnquiry) && <EnquiryModal
          openSnackBar={() => setSnackBarOpen(true)}
          toggleModal={() => toggleModal()}
          // selectedService={selectedService}
          companyId={companyId}
          companyName={companyName} />
      }


    </>
  )
}

export default IndividualCompany