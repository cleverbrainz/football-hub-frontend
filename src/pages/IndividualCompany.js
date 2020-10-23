import React, {useState} from 'react'
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

const IndividualCompany = ({ location }) => {

  const [modalOpen, setModal] = useState(false)
  const [selectedService, setSelectedService] = useState()
  const { name, images, bio, reasons_to_join, coaches, services, userId } = location.state
  const companyName = name.charAt(0).toUpperCase() + name.slice(1)

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
    }
  }))

  const classes = useStyles()



  const reviews = [...Array(6).keys()]

  const products = ['Service 0', 'Service 1', 'Service 2', 'Service 3' , 'Service 4']

  const toggleModal = service => {
    if (modalOpen === false) setSelectedService(service)
    setModal(!modalOpen)
  }

  let count = 1
  let currentPosition = 0

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


  return (
    <>
      <div className={classes.root}>

        <section className={classes.section}>
          <div>
            <Typography style={{ margin: '50px 0' }} component='div' >
              <Box
                fontSize={40} fontWeight="fontWeightBold" m={0}>
                {companyName}
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
              return (

                <>
                <div key={i} className={classes.staffRoot}>
                  <Avatar className={classes.avatar} alt="Remy Sharp" src={el.imageURL} />

                  <div>
                    <Typography variant='h6' gutterBottom>
                      {el.coach_name}
                  </Typography>

                    <Typography component='div' >
                      <Box
                        style={{ display: 'flex', alignItems: 'center' }} fontSize={17} fontWeight="fontWeightRegular" m={0}>
                        {el.coaching_level} Verified
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
                fontSize={25} fontWeight="fontWeightBold" m={0}>
                What we offer
              </Box>
            </Typography>

            {services.map((el, i) => {
              return (
                <Accordion key={i}>
                  <AccordionSummary
                    style={{minHeight: '70px'}}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography className={classes.accordion}> {el.service_name} </Typography>
                  </AccordionSummary>
                  <AccordionDetails style={{display: 'block'}}>
                    <Typography>
                    {el.service_description}
                    </Typography>

                    <Button onClick={() => toggleModal(el.service_name)} variant="contained" style={{margin: '20px 0 5px 0'}}>
                    Click to enquire
                  </Button>
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

      </div>


      {
        modalOpen && <EnquiryModal
          toggleModal={() => toggleModal()}
          selectedService={selectedService}
          companyId={userId}
          companyName={companyName} />
      }


    </>
  )
}

export default IndividualCompany