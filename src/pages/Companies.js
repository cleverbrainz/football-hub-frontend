import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import LocationOnSharpIcon from "@material-ui/icons/LocationOnSharp";
import { useEffect } from "react";
import axios from "axios";
import FilterModal from "../components/FilterModal";
import PeopleAltSharpIcon from "@material-ui/icons/PeopleAltSharp";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import MoreHorizSharpIcon from "@material-ui/icons/MoreHorizSharp";
import PersonPinCircleSharpIcon from "@material-ui/icons/PersonPinCircleSharp";
import SupervisorAccountSharpIcon from "@material-ui/icons/SupervisorAccountSharp";
import EventNoteSharpIcon from "@material-ui/icons/EventNoteSharp";
import EmojiPeopleSharpIcon from "@material-ui/icons/EmojiPeopleSharp";
import RoomSharpIcon from "@material-ui/icons/RoomSharp";
import ReactMapPopup from "../components/ReactMapPopup";
import { fi } from "date-fns/locale";
import Footer from '../components/Footer'

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  listContainer: {
    width: "100vw",
    [theme.breakpoints.up("md")]: {
      width: "840px",
      minWidth: "840px",
      height: window.innerHeight - 100,
      position: "relative",
    },
    overflowY: "scroll",
  },
  mapContainer: {
    [theme.breakpoints.up("md")]: {
      width: "60vw",
      // width: (window.innerWidth / 10) * 6,
      height: window.innerHeight - 100,
      display: "block",
    },
    display: "none",
  },
  header: {
    minHeight: "27vh",
    padding: "35px 35px",
  },
  divider: {
    [theme.breakpoints.up("sm")]: {
      margin: "0 40px 50px 40px",
    },
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    margin: "0 20px 50px 20px",
  },
  card: {
    width: "90%",
    margin: "40px auto",
    boxShadow: "none",
    borderRadius: 0,
    position: "relative",
  },
  cardSubcontainer: {
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      justifyContent: 'flex-start'
    },
  },
  media: {
    height: 300,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: 340,
      height: 200,
    },
    borderRadius: "8px",
  },
  progress: {
    position: "absolute",
    top: "60%",
    left: "50%",
  },

  resize: {
    fontSize: 15.4,
    letterSpacing: 0.5,
  },
  button: {
    textTransform: "none",
    borderRadius: "20px",
    width: 150,
    [theme.breakpoints.up("sm")]: {
      margin: "25px 30px 25px 0",
    },
    margin: "10px 20px 10px 0",
  },
}));

export default function Companies({ history }) {
  const classes = useStyles();
  const key =
    "pk.eyJ1Ijoic2VhbmdwYWNoYXJlb25zdWIiLCJhIjoiY2s3cnJyeW85MDZuMzNwcGM1Y2o2M2NoayJ9.WRweK2tzYFh_8QiKacCXEw";
  const [companies, setCompanies] = useState();
  const [selectedFilter, setSelectedFilter] = useState();
  const [address, setAddress] = useState();
  const [modalOpen, setModal] = useState(false);
  const [selected, setSelected] = useState({
    company: null,
    location: null
  });
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null
  })
  const location = useRef()
  const [clearFilter, setClearFilter] = useState(false)

  const { state } = history.location
  const { age } = state
  const { longitude, latitude } = state.location
  const { days, times } = state.timing
  const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = days
  const { morning, afternoon, evening } = times

  const [filterDetails, setFilterDetails] = useState({
    location: {
      longitude,
      latitude
    },
    timing: {
      days: {
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday
      },
      times: {
        morning,
        afternoon,
        evening
      }
    },
    age: {
      7: age['7'],
      8: age['8'],
      9: age['9'],
      10: age['10'],
      11: age['11'],
      12: age['12'],
      13: age['13'],
      14: age['14'],
      15: age['15'],
      16: age['16'],
      17: age['17'],
      18: age['18'],
      adults: age.adults
    }
  })

  const [userCoordinates, setUserCoordinates] = useState();

  const [viewport, setViewport] = useState({
    longitude: longitude ? longitude : -0.141099,
    latitude: latitude ? latitude : 51.515419,
    zoom: 10,
    width: "100%",
    height: window.innerHeight - 80,
  });

  useEffect(() => {
    axios.post('/filteredCompanies', filterDetails)
      .then(res => {
        console.log(res.data)
        setCompanies(res.data)
      })
  }, [clearFilter])

  function toggleModal(e) {
    if (modalOpen === false) setSelectedFilter(e.target.id);
    setModal(!modalOpen);
  }

  const handleTimingChange = (e) => {
    const { name, checked, id } = e.target;
    setFilterDetails({
      ...filterDetails,
      timing: {
        ...filterDetails.timing,
        [id]: { ...filterDetails.timing[id], [name]: checked },
      },
    });
  };

  const handleAgeChange = (e) => {
    const { name, checked } = e.target;
    setFilterDetails({
      ...filterDetails,
      age: {
        ...filterDetails.age,
        [name]: checked,
      },
    });
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);

    setFilterDetails({
      ...filterDetails,
      location: {
        latitude: latLng.lat,
        longitude: latLng.lng,
      },
    });

    axios
      .post("/filteredCompanies", {
        ...filterDetails,
        location: {
          latitude: latLng.lat,
          longitude: latLng.lng,
        },
      })
      .then((res) => {
        toggleModal();
        setViewport({
          ...viewport,
          zoom: 11,
          latitude: latLng.lat,
          longitude: latLng.lng,
        });
        setAddress(value);
        setCoordinates(latLng);
        setCompanies(res.data);
      });
  };

  const success = async (pos) => {
    location.current.innerHTML = "Successfully located!";
    var crd = pos.coords;
    const position = {
      latitude: parseFloat(crd.latitude.toFixed(4)),
      longitude: parseFloat(crd.longitude.toFixed(4)),
    };

    setFilterDetails({ ...filterDetails, location: position });

    axios
      .post("/filteredCompanies", { ...filterDetails, location: position })
      .then((res) => {
        setUserCoordinates(position);
        setViewport({
          ...viewport,
          zoom: 11,
          latitude: parseFloat(position.latitude),
          longitude: parseFloat(position.longitude),
        });
        setCompanies(res.data);
      });
  };

  const handleLocate = (e) => {
    location.current.innerHTML = "Locating...";
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(success);
    }, 1500);
  };

  function handleFilterSubmit() {
    axios.post('/filteredCompanies', filterDetails)
      .then(res => {
        toggleModal()
        setCompanies(res.data)
      })
  }

  const filterIcons = {
    Location: LocationOnSharpIcon,
    Age: SupervisorAccountSharpIcon,
    Timing: EventNoteSharpIcon,
  };

  const handleClearFilters = () => {
    setClearFilter(!clearFilter);
    setFilterDetails({
      location: { longitude: "", latitude: "" },
      timing: {
        days: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
        times: { morning: false, afternoon: false, evening: false },
      },
      age: {
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
        13: false,
        14: false,
        15: false,
        16: false,
        17: false,
        18: false,
        adults: false,
      },
    });
  };


  return (
    <>
      <div className={classes.root}>
        <section id="list-container" className={classes.listContainer}>
          <header className={classes.header}>
            <Typography component="div">
              <Box fontSize={25} fontWeight="fontWeightBold" m={0.3}>
                Football in the UK
              </Box>
            </Typography>

            {/* search functions - location, age, ability, goal */}

            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {Object.keys(filterIcons).map((el, i) => {
                const Icon = filterIcons[el];
                let text;

                if (el === "Timing") text = "Date/Times";
                else text = el;
                return (
                  <Button
                    id={el}
                    key={i}
                    onClick={(e) => toggleModal(e)}
                    variant="outlined"
                    color="default"
                    className={classes.button}
                    startIcon={<Icon />}
                  >
                    {text}
                  </Button>
                );
              })}
            </div>

            <Button
              ref={location}
              style={{ borderRadius: '20px', width: '230px' }}
              variant='contained'
              onClick={handleLocate}
              color="primary"
              startIcon={<EmojiPeopleSharpIcon />}
            >
              Whats near me
            </Button>

            <Button
              style={{ margin: '0 20px', borderRadius: '20px', width: '160px' }}
              variant='contained'
              onClick={handleClearFilters}
              color="secondary"
            >
              Clear filters
            </Button>
          </header>

          <Divider className={classes.divider} variant="middle" />

          <Typography component="div">
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "85%",
                margin: "0 auto",
              }}
              fontSize={17}
              fontWeight="fontWeightRegular"
              m={1}
            >
              <VerifiedUserIcon
                style={{ color: "goldenrod", marginRight: "10px" }}
              />
              All coaching companies and camps have been verified by us!
            </Box>
          </Typography>

          {/* map through companies */}

          {companies ? companies.map((el, i) => {
            // console.log(el)
            const { companyName, images, bio, companyId } = el.listingInfo

            return (
              <>
                <Link key={i} to={{
                  pathname: `/companies/${companyId}`,
                  state: el.listingInfo
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
                          {companyName}
                        </Typography>
                        <Typography
                          variant="body2" color="textSecondary" component="p">
                          {bio}
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
            mapStyle="mapbox://styles/seangpachareonsub/ckdsqcwif16xt19mlhiuwb2dt"
            onViewportChange={(viewport) => {
              setViewport(viewport);
            }}
          >
            {companies && companies.map(el => {
                const { courses } = el.listingInfo

                // console.log('THIS IS' + courses)
                return courses.map((course, i) => {
                  const { latitude, longitude } = course.courseDetails
                  // console.log(course)
                  return <Marker
                    key={i}
                    anchor={"top-left"}
                    offsetLeft={-20}
                    offsetTop={-30}
                    latitude={parseFloat(latitude)}
                    longitude={parseFloat(longitude)}
                  >
                    <RoomSharpIcon
                      onClick={() => {
                        if (selected.company) {
                          const {longitude} = selected.company.listingInfo.courses[selected.location].courseDetails;
                          const {courseDetails} = el.listingInfo.courses[i]
                          if (longitude === courseDetails.longitude) {
                            setSelected({ company: null, location: null });
                          } else setSelected({ company: el, location: i });
                        } else setSelected({ company: el, location: i });
                      }}
                      style={{
                        fontSize: "40px",
                        color: "red",
                      }}
                    />
                  </Marker>
                })


              })}

            {userCoordinates && (
              <Marker
                anchor={"top-left"}
                offsetLeft={-20}
                offsetTop={-30}
                latitude={parseFloat(userCoordinates.latitude)}
                longitude={parseFloat(userCoordinates.longitude)}
              >
                <PersonPinCircleSharpIcon
                  style={{
                    fontSize: "40px",
                    color: "blue",
                  }}
                />
              </Marker>
            )}

            {selected.company && <ReactMapPopup selected={selected} />}
          </ReactMapGL>
        </section>
      </div>



      <Footer />

      {modalOpen && (
        <FilterModal
          handleFilterSubmit={(e) => handleFilterSubmit(e)}
          filterDetails={filterDetails}
          handleTimingChange={(e) => handleTimingChange(e)}
          handleAgeChange={(e) => handleAgeChange(e)}
          selectedFilter={selectedFilter}
          classes={classes}
          address={address}
          handleSelect={(value) => handleSelect(value)}
          setAddress={setAddress}
          toggleModal={() => toggleModal()}
        />
      )}
    </>
  );
}
