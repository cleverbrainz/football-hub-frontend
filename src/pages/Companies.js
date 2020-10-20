import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import LocationOnSharpIcon from '@material-ui/icons/LocationOnSharp';
import { useEffect } from 'react';
import axios from 'axios'
import FilterModal from '../components/FilterModal'
import PeopleAltSharpIcon from '@material-ui/icons/PeopleAltSharp';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import MoreHorizSharpIcon from '@material-ui/icons/MoreHorizSharp';
import PersonPinCircleSharpIcon from '@material-ui/icons/PersonPinCircleSharp';

import ReactMapPopup from '../components/ReactMapPopup'


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  listContainer: {
    width: '100vw',
    [theme.breakpoints.up('md')]: {
      width: '840px',
      minWidth: '840px',
      height: window.innerHeight - 100,
      position: 'relative'
    },
    overflowY: 'scroll'
  },
  mapContainer: {
    [theme.breakpoints.up('md')]: {
      width: '60vw',
      // width: (window.innerWidth / 10) * 6,
      height: window.innerHeight - 100,
      display: 'block'
    },
    display: 'none'
  },
  header: {
    height: '27vh',
    padding: '0 35px',
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center',
    flexDirection: 'column'
  },
  divider: {
    [theme.breakpoints.up('sm')]: {
      margin: '0 40px 50px 40px'
    },
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    margin: '0 20px 50px 20px'
  },
  card: {
    width: '90%',
    margin: '40px auto',
    boxShadow: 'none',
    borderRadius: 0,
    position: 'relative'
  },
  cardSubcontainer: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex'
    }
  },
  media: {
    height: 300,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 640,
      height: 200,
    },
    borderRadius: '8px'
  },
  progress: {
    position: 'absolute',
    top: '60%',
    left: '50%',
  },

  resize: {
    fontSize: 15.4,
    letterSpacing: .5
  },
  button: {
    textTransform: 'none',
    borderRadius: '20px',
    width: 150,
    [theme.breakpoints.up('sm')]: {
      margin: '25px 30px 25px 0'
    },
    margin: '10px 20px 10px 0'
  }
}))

export default function Companies() {

  const classes = useStyles()
  const key = 'pk.eyJ1Ijoic2VhbmdwYWNoYXJlb25zdWIiLCJhIjoiY2s3cnJyeW85MDZuMzNwcGM1Y2o2M2NoayJ9.WRweK2tzYFh_8QiKacCXEw'
  const [companies, setCompanies] = useState()
  const [selectedFilter, setSelectedFilter] = useState()
  const [address, setAddress] = useState('')
  const [modalOpen, setModal] = useState(false)
  const [selected, setSelected] = useState()
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  })



  function toggleModal(e) {
    if (modalOpen === false) setSelectedFilter(e.target.id)
    setModal(!modalOpen)
  }

  const [viewport, setViewport] = useState({
    longitude: -0.1300,
    latitude: 51.5074,
    zoom: 10,
    width: '100%',
    height: window.innerHeight - 80,
  })

  useEffect(() => {
    axios.get('/companies')
      .then(res => setCompanies(res.data))
  }, [])

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value)
    const latLng = await getLatLng(results[0])
    toggleModal()
    setViewport({ ...viewport, latitude: latLng.lat, longitude: latLng.lng })
    setAddress(value)
    setCoordinates(latLng)

  }

  const filterIcons = {
    Location: LocationOnSharpIcon,
    More: MoreHorizSharpIcon
  }

  const closeSelectedPopup = () => {
    setSelected(null)
  }


  return (

    <>
      <div className={classes.root}>
        <section id='list-container' className={classes.listContainer}>
          <header className={classes.header}>
            <Typography component='div'>
              <Box fontSize={25} fontWeight="fontWeightBold" m={0.3}>
                Football in the UK
              </Box>
            </Typography>


            {/* search functions - location, age, ability, goal */}

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>

              {Object.keys(filterIcons).map((el, i) => {
                const Icon = filterIcons[el]
                let text

                if (el === 'Location') text = 'Location'
                else text = 'More Filters'
                return (
                  <Button
                    id={el}
                    key={i}
                    onClick={(e) => toggleModal(e)}
                    variant="outlined"
                    color="default"
                    className={classes.button}
                    startIcon={<Icon />}>
                    {text}
                  </Button>
                )
              })}

            </div>

          </header>

          <Divider className={classes.divider} variant='middle' />

          <Typography component='div' >
            <Box
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '85%', margin: '0 auto' }} fontSize={17} fontWeight="fontWeightRegular" m={1}>
              <VerifiedUserIcon style={{ color: 'goldenrod', marginRight: '10px' }} />
              All coaching companies and camps have been verified by us!
              </Box>
          </Typography>

          {/* map through companies */}



          {companies ? companies.map((el, i) => {
            const { name, images } = el.companyInfo
            return (
              <>

                <Link key={i} to={{
                  pathname: `/companies/${el.companyId}`,
                  state: el.companyInfo

                }}>

                  <Card className={classes.card}>
                    <CardActionArea className={classes.cardSubcontainer}>
                      <CardMedia
                        className={classes.media}
                        image={images ? images[0] :
                          "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec congue faucibus felis,
                          vel semper tellus eleifend eu. Vestibulum ullamcorper ultrices efficitur.
                    </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>

                  <Divider className={classes.divider} variant='middle' />

                </Link>





              </>
            )
          }) : <CircularProgress className={classes.progress} color="secondary" />}

        </section>
        <section className={classes.mapContainer}>
          <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={key}
            mapStyle='mapbox://styles/seangpachareonsub/ckdsqcwif16xt19mlhiuwb2dt'
            onViewportChange={viewport => {
              setViewport(viewport)
            }}>

            {companies && companies.map(el => {

              if (el.companyInfo.location) {
                const { latitude, longitude } = el.companyInfo.location
                console.log(latitude, longitude)
                return (
                  <Marker key={el.companyId}
                    anchor={'top-left'}
                    offsetLeft={-20}
                    offsetTop={-30}
                    latitude={latitude}
                    longitude={longitude} >
                    <PersonPinCircleSharpIcon
                      onClick={() => setSelected(el)}
                      style={{
                        fontSize: '40px',
                        color: 'red'
                      }} />
                  </Marker>
                )
              }
            }
            )}

            {selected && <ReactMapPopup
              selected={selected}
              closeSelectedPopup={() => closeSelectedPopup()} />}


          </ReactMapGL>
        </section>


      </div>

      {
        modalOpen && <FilterModal
          selectedFilter={selectedFilter}
          classes={classes}
          address={address}
          handleSelect={(value) => handleSelect(value)}
          setAddress={setAddress}
          toggleModal={() => toggleModal()} />
      }
    </>
  )
}