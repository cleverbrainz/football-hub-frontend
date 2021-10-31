import React, { useState, useLayoutEffect } from "react";
import { TextField, AppBar, Card, Select, MenuItem, Button} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import PlacesAutocomplete from "react-places-autocomplete";
import LocationOnSharpIcon from '@material-ui/icons/LocationOnSharp';
import { makeStyles } from "@material-ui/core/styles";
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import { FormControlLabel, Checkbox, Typography, Box, Fab } from '@material-ui/core'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { set } from "date-fns";

const useStyles = makeStyles((theme) => ({
  searchBar: {
    zIndex: 50,
    backgroundColor: "#fff",
    position: 'absolute',
    top: '50%',
    left: '50%',
    borderRadius: '16px',
    transform: 'translate(-50%, -50%)',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexDirection: 'row',
    [theme.breakpoints.down("md")]: {
      width: "90%",
    },
    [theme.breakpoints.up("md")]: {
      width: "55%",
    },
  },
  topContainer: {
    marginTop: '8px',
    marginBottom: '-8px',
    display: 'flex',
    alignItems: 'center'
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    margin: '8px 0'
    // [theme.breakpoints.up("md")]: {
    //   display: 'flex',
    // },
  },
  locationField: {
    borderTopLeftRadius: '50px',
    borderBottomLeftRadius: '50px',
    flex: 1.5,
    minHeight: "45px",
    display: 'flex',
    paddingLeft: '20px',
    justifyContent: 'center',
    fontSize: '16pt',
    // borderRight: '1px solid grey',

    "&:hover": {
      backgroundColor: 'lightgrey',
    },
  },
  ageContainer: {
    // whiteSpace: 'nowrap',
    overflow: 'scroll',
    // flex: 1,
    color: 'grey',
    marginRight: '30px',
    display: 'flex',
    alignItems: 'center',
    "&:hover": {
      cursor: 'pointer'
    },
    minHeight: "45px",
    [theme.breakpoints.down("md")]: {
      marginLeft: '10px',
    },
    [theme.breakpoints.up("md")]: {
      marginLeft: '30px',
    },
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  filterCard: {
    position: 'absolute',
    minHeight: '250px',
    padding: '25px',
    top: '80%',
    width: '60%',
    marginTop: '20px',
    borderRadius: '20px',
    float: 'right'
    // display: 'none'
  },
  searchText: {
    color: '#000',
    [theme.breakpoints.up("md")]: {
      marginLeft: '30px', 
      fontSize: '16pt'
    },
    [theme.breakpoints.down("md")]: {
      fontSize: '12pt'
    },
  },
  selectUserType: {
    [theme.breakpoints.up("md")]: {
      marginLeft: '30px', 
      fontSize: '16pt'
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: '10px',
      fontSize: '12pt'
    },
  },
  nextButton: {
    position: 'fixed',
    right: '0px',
    minHeight: '36px'
  },
  searchButton: {
    position: 'fixed', 
    right: '5px',    
  },
  searchResultText: {
    color: '#000',
    [theme.breakpoints.up("md")]: {
      marginLeft: '30px', 
      fontSize: '16pt'
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: '15px', 
      fontSize: '12pt'
    },
  },
}))

const SearchBar = ({ history }) => {
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const [address, setAddress] = useState('');
  const [nonLocationFilter, setNonLocationFilter] = useState()
  const [selectedValues, setSelectedValues] = useState({
    age: null,
    day: null,
    time: null
  })

  const [filterDetails, setFilterDetails] = React.useState({
    location: {
      longitude: '',
      latitude: ''
    },
    timing: {
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      times: {
        morning: false,
        afternoon: false,
        evening: false
      }
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
      adults: false
    }
  })
  const [userType, setUserType] = useState('default')
  const [selectedStep, setSelectedStep] = useState(0)
  const [selectedSmallStep, setSelectedSmallStep] = useState(0)
  const [userAge, setUserAge] = useState(0)
  const [searchOption, setSearchOption] = useState('default')
  const [searchResult, setSearchResult] = useState('')
  const [isBack, setIsBack] =  useState(false);
  const [isNotStart, setIsNotStart] = useState(false);

  useEffect(() => {
    const { location } = filterDetails
    if (isBack) {
      setIsBack(false)
    } else {
      if (userType === 'default') {
        setSelectedStep(0);
        if (userAge === 0) {
          setSelectedSmallStep(0)
        } else {
          setSelectedSmallStep(0)
        }
      } else {
        if (userAge === 0) {
          setSelectedSmallStep(1)
          if (width < 960) {
            setIsNotStart(true)
          }
        } else {
          setIsNotStart(true)
          if (searchOption === 'default') {
            setSelectedStep(1)
            setSelectedSmallStep(2)
          } else {
            if (location.latitude === "") {
              setSelectedSmallStep(3)
            } else {
              setSelectedStep(2)
              setSelectedSmallStep(4)
            }          
          }
        }
      }    
    }
    
    var temp = (userType === 'default' ? '' : userType) + (userAge === 0 ? '' : ' - ' + userAge.toString() + ' ' + 'years old') 
          + (searchOption === 'default' ? '' : ' - ' + searchOption) + (address === '' ? '' : " - " + address)
    setSearchResult(temp)    
  }, [userType, userAge, searchOption, filterDetails, address])

  useEffect(() => {
    const { age, timing } = filterDetails
    let ageResult = false;
    let daysResult = false;
    let timeResult = false;

    for (const i in age) {
      if (age[i] === true) {
        ageResult = true;
        break;
      }
    }

    for (const i in timing) {
      for (const j in timing[i]) {
        if (timing[i][j] === true) {
          if (timing[i] === 'days') daysResult = true;
          else timeResult = true
          break;
        }
      }
    }

    setSelectedValues({ day: daysResult, age: ageResult, time: timeResult })
  }, [filterDetails])

  useLayoutEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
  }, []);

  const handleTimingChange = (e) => {
    const { name, checked, id } = e.target
    setFilterDetails({
      ...filterDetails, timing: {
        ...filterDetails.timing,
        [id]: { ...filterDetails.timing[id], [name]: checked }
      }
    })
  };

  const handleAgeChange = (e) => {
    const {value, checked} = e.target
    setFilterDetails({
      ...filterDetails, age: {
        ...filterDetails.age, [value]: true
      }
    })
  };

  function handleFilterSubmit() {

    // console.log(filterDetails)

    history.push({
      pathname: '/companies',
      state: filterDetails
    })

    // axios.post('/filteredCompanies', filterDetails)
    //   .then(res => {
    //     toggleModal()
    //     setCompanies(res.data)
    //   })
  }

  const ageFilters = (
    <div>
      <Typography component='div'>
        <Box fontSize={18} fontWeight="fontWeightBold" m={0}>
          Select Ages
        </Box>
      </Typography>

      {Object.keys(filterDetails.age).map((el, index) => {
        const text = el === 'adults' ? 'Adults' : `${el} years`
        return (
          <FormControlLabel
            control={<Checkbox
              checked={filterDetails.age[el]}
              onChange={handleAgeChange}
              name={el} />}
            label={text}
            key={index}
          />
        )
      })}
    </div>
  )

  const timingFilters = (
    <div>
      <Typography component='div'>
        <Box fontSize={18} fontWeight="fontWeightBold" m={0}>
          Select Days
        </Box>
      </Typography>

      {Object.keys(filterDetails.timing.days).map((el, index) => {
        return (
          <FormControlLabel
            key={index}
            control={<Checkbox id='days' checked={filterDetails.timing.days[el]}
              onChange={handleTimingChange}
              name={el} />}
            label={el.charAt(0).toUpperCase() + el.slice(1)}
          />
        )
      })}

      <Typography component='div'>
        <Box fontSize={18} fontWeight="fontWeightBold" m={0}>
          Select Start Times
        </Box>
      </Typography>

      {Object.keys(filterDetails.timing.times).map((el, i) => {
        let upper = el.charAt(0).toUpperCase() + el.slice(1)
        let text
        if (i === 0) text = `${upper} (8am - 12pm)`
        else if (i === 1) text = `${upper} (12pm - 6pm)`
        else text = `${upper} (6pm - 10pm)`
        return (
          <FormControlLabel
            control={<Checkbox id='times' checked={filterDetails.timing.times[el]}
              onChange={handleTimingChange}
              name={el} />}
            label={text}
            key={i}
          />
        )
      })}
    </div>
  )

  const handleSelect = async (value) => {

    const results = await geocodeByAddress(value)
    const latLng = await getLatLng(results[0])

    setAddress(value)
    // searchOption !== 'default' ? setSelectedStep(2) : setSelectedStep(1)
    setFilterDetails({
      ...filterDetails, location: {
        latitude: latLng.lat, longitude: latLng.lng
      }
    })    
  }

  const handleBack = () => {
    setIsBack(true)
    if (width > 960) {
      if (selectedStep === 1) {
        setFilterDetails({
          ...filterDetails, location: {
            latitude: "", longitude: ""
          }
        })
        setAddress('')
        setSearchOption('default')
        setSelectedStep(0)
        setSelectedSmallStep(1)
      } else if (selectedStep === 2) {        
        setSelectedStep(1)
        setSelectedSmallStep(3)
        setIsBack(false)
      } else {
        console.log(selectedStep)
        setIsBack(false)
      }
    } else {
      if (selectedSmallStep === 1) {
        setUserAge(0)
        setSelectedSmallStep(0)
        setSelectedStep(0)
      } else if (selectedSmallStep === 2) {
        setSearchOption('default')
        setSelectedSmallStep(1)
        setSelectedStep(0)
      } else if (selectedSmallStep === 3) {
        setFilterDetails({
          ...filterDetails, location: {
            latitude: "", longitude: ""
          }
        })
        setAddress('')
        setSelectedSmallStep(2)
        setSelectedStep(1)
      } else if (selectedSmallStep === 4) {
        setSelectedSmallStep(3)
        setSelectedStep(1)
        setIsBack(false)
      } else {
        console.log(selectedSmallStep)
        setIsBack(false)
      }
    }
  }

  const handleNext = () => {
    if (width > 960) {
      if (selectedStep === 0) {
        if (userType !== 'default' && userAge !== 0) {
          setSelectedStep(1)
          setSelectedSmallStep(2)
        }        
      } else if (selectedStep === 1) {
        if (searchOption !== 'default' && filterDetails.location.latitude !== "") {
          setSelectedStep(2)
          setSelectedSmallStep(4)
        }        
      } else {
        console.log(selectedStep)
      }
    } else {
      if (selectedSmallStep === 0) {
        if (userType !== 'default') {
          setSelectedSmallStep(1)
          setSelectedStep(0)
        }        
      } else if (selectedSmallStep === 1) {
        if (userAge !== 0) {
          setSelectedSmallStep(2)
          setSelectedStep(1)
        }        
      } else if (selectedSmallStep === 2) {
        if (searchOption !== 'default') {
          setSelectedSmallStep(3)
          setSelectedStep(1)
        }        
      } else if (selectedSmallStep === 3) {
        if (filterDetails.location.latitude !== "") {
          setSelectedSmallStep(4)
          setSelectedStep(2)
        }        
      } else {
        console.log(selectedSmallStep)
      }
    }
  }

  return (
    <div position="static" className={classes.searchBar}>     
      {((isNotStart && width > 960) || (isNotStart || (selectedSmallStep !== 0 && width < 960))) && <div className={classes.topContainer}>
        {((selectedStep !== 0 && width > 960) || (selectedSmallStep !== 0 && width < 960)) && <Button className={classes.previousButton}
          onClick={handleBack}>
          <ChevronLeft/>
        </Button>}
        <Typography className={classes.searchResultText}>{searchResult}</Typography>
        {((selectedStep !== 2 && width > 960) || (selectedSmallStep !== 4 && width < 960)) && <Button className={classes.nextButton}
          onClick={handleNext}>
          <ChevronRight/>
        </Button>}
      </div>}
      <div className={classes.searchContainer}>
        {selectedStep === 0 && <div className={classes.searchContainer}>
          {(width > 960 || selectedSmallStep === 0) && <div className={classes.searchContainer}>
            <Typography className={classes.searchText}>I am a</Typography>
            <Select
              className={classes.selectUserType}
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              label='Who are you?'
              value={userType}
              onChange={e => {
                setUserType(e.target.value)
                // userAge !== 0 ? setSelectedStep(1) : setSelectedStep(0)
              }}
            >
              <MenuItem value='default' disabled hidden> user options </MenuItem>
              <MenuItem value='player'> Player </MenuItem>
              <MenuItem value='coach'> Coach </MenuItem>
              <MenuItem value='company'> Company </MenuItem>
            </Select>
          </div>}
          {(width > 960 || selectedSmallStep === 1) && <div className={classes.searchContainer}>
            <Typography className={classes.searchText}>aged</Typography>
            <Select
              className={classes.selectUserType}
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              label='How old are you?'
              value={userAge}
              onChange={e => {
                handleAgeChange(e)
                setUserAge(e.target.value)
              }}
            >
              <MenuItem value={0} selected disabled hidden> age options </MenuItem>
              {Object.keys(filterDetails.age).map((data, index) => {
                return (
                  <MenuItem value={data} key={index}> {data === 'adults' ? 'Adults' : `${data} years`} </MenuItem>
                )
              })}
            </Select>
            </div>}
        </div>}

        {selectedStep === 1 && <div className={classes.searchContainer}>
        {(width > 960 || selectedSmallStep === 2) && <div className={classes.searchContainer}>
            <Typography className={classes.searchText}>Looking for a</Typography>          
            <Select
              className={classes.selectUserType}
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              label='What is your option?'
              value={searchOption}
              onChange={e => {
                setSearchOption(e.target.value)
                // address ? setSelectedStep(2) : setSelectedStep(1)            
              }}
            >
              <MenuItem value='default' disabled hidden> search options </MenuItem>
              <MenuItem value='course'> Course </MenuItem>
              <MenuItem value='camp'> Camp </MenuItem>
              <MenuItem value='mentor'> Mentor </MenuItem>
            </Select>
          </div>}
          {(width > 960 || selectedSmallStep === 3) && <div className={classes.searchContainer}>
            <Typography className={classes.searchText}>in</Typography>
            <PlacesAutocomplete value={address} onSelect={value => handleSelect(value)}
              onChange={setAddress}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <>
                  <TextField
                    className={classes.locationField}
                    placeholder="Explore locations"
                    {...getInputProps()}
                    InputProps={{
                      disableUnderline: true
                    }}
                  />

                  <Card style={{
                    position: 'absolute',
                    top: '135px',
                    borderRadius: '25px'
                  }}>
                    <div>
                      {loading && <div> ... </div>}

                      {suggestions.map((el, i) => {
                        const style = {
                          backgroundColor: el.active ? '#e6e6e6' : 'white',
                          height: '65px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '5px 20px',
                        }

                        return (
                          <div key={i} {...getSuggestionItemProps(el, { style })}>
                            <LocationOnSharpIcon />
                            <p> {el.description} </p>
                          </div>
                        )
                      })}

                    </div>
                  </Card>
                </>
              )}
            </PlacesAutocomplete>
          </div>}
        </div>}

        {selectedStep === 2 && <div className={classes.searchContainer}>
          <Typography className={classes.searchText}>At this time</Typography>          
          <div
            onClick={() => {
              if (nonLocationFilter === 'timing') setNonLocationFilter(null)
              else setNonLocationFilter('timing')
            }}
            className={classes.ageContainer}>
            {(selectedValues.day || selectedValues.time) ? Object.keys(filterDetails.timing.days).map((data, i) => {
              const { days } = filterDetails.timing
              const text = data.charAt(0).toUpperCase() + data.slice(1)
              if (days[data]) {
                return (
                  <Chip
                    style={{ backgroundColor: 'lightgreen' }}
                    icon={<DoneIcon style={{ fontSize: '16px' }} />}
                    label={text}
                    className={classes.chip}
                  />
                );
              }
            }) : <p> Explore days & times </p>}
            {Object.keys(filterDetails.timing.times).map((data, i) => {
              const { times } = filterDetails.timing
              const text = data.charAt(0).toUpperCase() + data.slice(1)
              if (times[data]) {
                return (

                  <Chip
                    style={{ backgroundColor: 'lightgreen' }}
                    icon={<DoneIcon style={{ fontSize: '16px' }} />}
                    label={text}
                    className={classes.chip}
                  />
                );
              }
            })}
          </div>        
        </div>}        

        {address !== '' && <Fab onClick={handleFilterSubmit}
          color="secondary" aria-label="edit" className={classes.searchButton} size='medium'>
          <SearchIcon /> 
        </Fab> }
        {address === '' &&<Fab
          color="inherit" aria-label="edit" className={classes.searchButton} size='medium'>
          <SearchIcon />
        </Fab>}
      </div>



      
      {/* <PlacesAutocomplete value={address} onSelect={value => handleSelect(value)}
        onChange={setAddress}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <TextField
              className={classes.locationField}
              placeholder="Explore locations"
              {...getInputProps()}
              InputProps={{
                disableUnderline: true
              }}
            />

            <Card style={{
              position: 'absolute',
              marginTop: '25rem',
              borderRadius: '25px'
            }}>
              <div>
                {loading && <div> ... </div>}

                {suggestions.map((el, i) => {
                  const style = {
                    backgroundColor: el.active ? '#e6e6e6' : 'white',
                    height: '65px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px 20px',
                  }

                  return (
                    <div key={i} {...getSuggestionItemProps(el, { style })}>
                      <LocationOnSharpIcon />
                      <p> {el.description} </p>
                    </div>
                  )
                })}

              </div>
            </Card>
          </>
        )}
      </PlacesAutocomplete> */}
      

      {/* <div onClick={() => {
        if (nonLocationFilter === 'age') setNonLocationFilter(null)
        else setNonLocationFilter('age')
      }}
        className={classes.ageContainer}>
        {selectedValues.age ? Object.keys(filterDetails.age).map((data, i) => {
          const text = data === 'adults' ? 'Adults' : `${data} years`
          if (filterDetails.age[data]) {
            return (
              <Chip
                style={{ backgroundColor: 'lightblue' }}
                icon={<DoneIcon style={{ fontSize: '16px' }} />}
                label={text}
                className={classes.chip}
              />
            );
          }
        }) : (
            <p style={{ fontSize: '16pt' }}> age options </p>
          )}

      </div> */}

      {/* <div style={{ width: '40%', left: '60%' }}
        onClick={() => {
          if (nonLocationFilter === 'timing') setNonLocationFilter(null)
          else setNonLocationFilter('timing')
        }}
        className={classes.ageContainer}>
        {(selectedValues.day || selectedValues.time) ? Object.keys(filterDetails.timing.days).map((data, i) => {
          const { days } = filterDetails.timing
          const text = data.charAt(0).toUpperCase() + data.slice(1)
          if (days[data]) {
            return (
              <Chip
                style={{ backgroundColor: 'lightgreen' }}
                icon={<DoneIcon style={{ fontSize: '16px' }} />}
                label={text}
                className={classes.chip}
              />
            );
          }
        }) : <p> Explore days & times </p>}
        {Object.keys(filterDetails.timing.times).map((data, i) => {
          const { times } = filterDetails.timing
          const text = data.charAt(0).toUpperCase() + data.slice(1)
          if (times[data]) {
            return (

              <Chip
                style={{ backgroundColor: 'lightgreen' }}
                icon={<DoneIcon style={{ fontSize: '16px' }} />}
                label={text}
                className={classes.chip}
              />
            );
          }
        })}
      </div> */}      

      {nonLocationFilter && <Card id='filter-card' className={classes.filterCard}>
        <div style={{float: 'right'}}>
          {nonLocationFilter === 'age' ? ageFilters : timingFilters}
        </div>
      </Card> }
      {/* <Button className={classes.nextButton}>
        <ChevronRight/>
      </Button> */}
    </div>
  );
};

export default withRouter(SearchBar);
