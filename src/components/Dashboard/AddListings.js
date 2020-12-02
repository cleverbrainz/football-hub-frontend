

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  TextField,
  Button,
} from '@material-ui/core';
import TransferListComponent from './TransferListComponent';
import axios from 'axios'
import auth from '../../lib/auth'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 200,
    height: 230,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  transferLists: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly'
  },
  input: {
    width: '100%',
    marginBottom: '15px'
  },
  inputTwo: {
    width: '45.5%',
  },
  subContainer: {
    width: '100%',
    display: 'flex',
    marginTop: '30px',
    justifyContent: 'space-around'
  },
}));

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

export default function AddListings({
  listingTransferListInfo,
  handleStateRefresh,
  listingToBeEdited }) {

  const { coaches, services, courses } = listingTransferListInfo

  const classes = useStyles();
  const [campsChecked, setCampsChecked] = useState([]);
  const [servicesChecked, setServicesChecked] = useState([]);
  const [coursesChecked, setCoursesChecked] = useState([]);
  const [coachesChecked, setCoachesChecked] = useState([]);

  // camps list
  const [campsNotIncluded, setCampsNotIncluded] = useState(courses.filter(el => el.courseDetails.courseType === 'Camp'));
  const [campsIncluded, setCampsIncluded] = useState(listingToBeEdited ?
    listingToBeEdited.camps : []);


  // services list
  const [servicesNotIncluded, setServicesNotIncluded] = useState(services);
  const [servicesIncluded, setServicesIncluded] = useState(listingToBeEdited ?
    listingToBeEdited.services : []);

  // course list
  const [coursesNotIncluded, setCoursesNotIncluded] = useState(courses.filter(el => el.courseDetails.courseType === 'Weekly'));
  const [coursesIncluded, setCoursesIncluded] = useState(listingToBeEdited ?
    listingToBeEdited.courses : []);

  // coaches list
  const [coachesNotIncluded, setCoachesNotIncluded] = useState(coaches);
  const [coachesIncluded, setCoachesIncluded] = useState(listingToBeEdited ?
    listingToBeEdited.coaches : []);

  const [listingForm, setListingForm] = useState({
    listingId: listingToBeEdited.listingId,
    bio: listingToBeEdited ? listingToBeEdited.bio : '',
    reasons_to_join: listingToBeEdited ? listingToBeEdited.reasons_to_join : [''],
    services: [],
    courses: [],
    camps: [],
    coaches: [],
    images: listingTransferListInfo.images,
    companyName: listingTransferListInfo.companyName,
    companyId: auth.getUserId()
  })

  // camps checked
  const campsNotIncludedChecked = intersection(campsChecked, campsNotIncluded);
  const campsIncludedChecked = intersection(campsChecked, campsIncluded);
  // services checked
  const servicesNotIncludedChecked = intersection(servicesChecked, servicesNotIncluded);
  const servicesIncludedChecked = intersection(servicesChecked, servicesIncluded);
  // course checked
  const coursesNotIncludedChecked = intersection(coursesChecked, coursesNotIncluded);
  const coursesIncludedChecked = intersection(coursesChecked, coursesIncluded);

  const coachesNotIncludedChecked = intersection(coachesChecked, coachesNotIncluded);
  const coachesIncludedChecked = intersection(coachesChecked, coachesIncluded);

  useEffect(() => {
    // updateUser()

    if (listingToBeEdited) {

      const obj = {
        coaches: [],
        services: [],
        courses: [],
        camps: []
      }

      Object.keys(obj).map(key => {
        const id = key === 'coaches' ? key.slice(0, -2) : key.slice(0, -1)

        if (listingToBeEdited[key].length === 0) return
        else {
          listingToBeEdited[key].forEach(outerEl => {

            if (key === 'camps' || key === 'courses') {
              const { courses } = listingTransferListInfo
              const type = key === 'camps' ? 'Camp' : 'Weekly'

              for (let i = 0; i < courses.length; i++) {
                const { courseType } = courses[i].courseDetails
                if (courseType === type) {
                  if (outerEl.courseId !== courses[i].courseId) obj[key].push(courses[i])
                }
              }
            } else {
              listingTransferListInfo[key].forEach(innerEl => {
                if (outerEl[`${id}Id`] !== innerEl[`${id}Id`]) {
                  obj[key].push(innerEl)
                }
              })
            }
          })
        }
      })

      setCoachesNotIncluded(coachesIncluded.length === coachesNotIncluded.length ? [] :
        obj.coaches.length !== 0 ? obj.coaches : coachesNotIncluded)

      setServicesNotIncluded(servicesIncluded.length === servicesNotIncluded.length ? [] :
        obj.services.length !== 0 ? obj.services : servicesNotIncluded)

      setCoursesNotIncluded(coursesIncluded.length === coursesNotIncluded.length ? [] :
        obj.courses.length !== 0 ? obj.courses : coursesNotIncluded)

      setCampsNotIncluded(campsIncluded.length === campsNotIncluded.length ? [] :
        obj.camps.length !== 0 ? obj.camps : campsNotIncluded)
    }

  }, [])

  // function updateUser() {
  //   axios.get(`/users/${auth.getUserId()}`)
  //     .then(res => {
  //       const { bio, reasons_to_join } = res.data[0]
  //       // setUser(res.data[0])
  //       setForm({
  //         ...form,
  //         bio,
  //         reasons_to_join
  //       })
  //       const slotNumbers = []
  //       for (let i = 0; i < 8 - res.data[0].images.length; i++) {
  //         slotNumbers.push(1)
  //       }
  //       setEmptyImageSlots(slotNumbers)
  //     })
  // }


  function handleSubmit(e) {
    e.preventDefault()
    // setDataChange(true)

    const requestObj = {
      ...listingForm,
      coaches: coachesIncluded,
      courses: coursesIncluded,
      services: servicesIncluded,
      camps: campsIncluded,
      companyId: auth.getUserId(),
    }







    if (listingToBeEdited) {
      return axios
        .patch("/companies/array/listings", requestObj,
          { headers: { Authorization: `Bearer ${auth.getToken()}` } })
        .then(res => handleStateRefresh())
        .catch((error) => {
          alert(error.message);
        });
    } else {
      return axios
        .post("/companies/listings", requestObj)
        .then((res) => {
          console.log(res.data);
          handleStateRefresh()
        })
        .catch((error) => {
          alert(error.message);
        });
    }

  }


  const handleToggle = (value, listItems) => () => {
    let currentIndex
    let newChecked

    switch (listItems) {
      case 'camps':
        currentIndex = campsChecked.indexOf(value);
        newChecked = [...campsChecked];
        break;

      case 'services':
        currentIndex = servicesChecked.indexOf(value);
        newChecked = [...servicesChecked];
        break;

      case 'courses':
        currentIndex = coursesChecked.indexOf(value);
        newChecked = [...coursesChecked];
        break;

      case 'coaches':
        currentIndex = coachesChecked.indexOf(value);
        newChecked = [...coachesChecked];
        break;

      default:
        break;
    }
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    switch (listItems) {
      case 'camps':
        setCampsChecked(newChecked);
        break;
      case 'services':
        setServicesChecked(newChecked);
        break;

      case 'coaches':
        setCoachesChecked(newChecked);
        break;

      case 'courses':
        setCoursesChecked(newChecked);
        break;

      default:
        break;
    }
  };

  const handleAllRight = (listItems) => {
    // console.log(campsChecked)
    switch (listItems) {
      case 'camps':
        setCampsIncluded(campsIncluded.concat(campsNotIncluded));
        setCampsNotIncluded([]);
        break;
      case 'services':
        setServicesIncluded(servicesIncluded.concat(servicesNotIncluded));
        setServicesNotIncluded([]);
        break;

      case 'courses':
        setCoursesIncluded(coursesIncluded.concat(coursesNotIncluded));
        setCoursesNotIncluded([]);
        break;

      case 'coaches':
        setCoachesIncluded(coachesIncluded.concat(coachesNotIncluded));
        setCoachesNotIncluded([]);
        break;

      default:
        break;
    }
  };

  const handleCheckedRight = (listItems) => {
    // console.log(campsChecked)
    switch (listItems) {
      case 'camps':
        setCampsIncluded(campsIncluded.concat(campsNotIncludedChecked));
        setCampsNotIncluded(not(campsNotIncluded, campsNotIncludedChecked));
        setCampsChecked(not(campsChecked, campsNotIncludedChecked));
        break;

      case 'services':
        setServicesIncluded(servicesIncluded.concat(servicesNotIncludedChecked));
        setServicesNotIncluded(not(servicesNotIncluded, servicesNotIncludedChecked));
        setServicesChecked(not(servicesChecked, servicesNotIncludedChecked));
        break;

      case 'courses':
        setCoursesIncluded(coursesIncluded.concat(coursesNotIncludedChecked));
        setCoursesNotIncluded(not(coursesNotIncluded, coursesNotIncludedChecked));
        setCoursesChecked(not(coursesChecked, coursesNotIncludedChecked));
        break;

      case 'coaches':
        setCoachesIncluded(coachesIncluded.concat(coachesNotIncludedChecked));
        setCoachesNotIncluded(not(coachesNotIncluded, coachesNotIncludedChecked));
        setCoachesChecked(not(coachesChecked, coachesNotIncludedChecked));
        break;

      default:
        break;


    };
  }

  const handleCheckedLeft = (listItems) => {

    switch (listItems) {
      case 'camps':
        setCampsNotIncluded(campsNotIncluded.concat(campsIncludedChecked));
        setCampsIncluded(not(campsIncluded, campsIncludedChecked));
        setCampsChecked(not(campsChecked, campsIncludedChecked));
        break;

      case 'services':
        setServicesNotIncluded(servicesNotIncluded.concat(servicesIncludedChecked));
        setServicesIncluded(not(servicesIncluded, servicesIncludedChecked));
        setServicesChecked(not(servicesChecked, servicesIncludedChecked));
        break;

      case 'courses':
        setCoursesNotIncluded(coursesNotIncluded.concat(coursesIncludedChecked));
        setCoursesIncluded(not(coursesIncluded, coursesIncludedChecked));
        setCoursesChecked(not(coursesChecked, coursesIncludedChecked));
        break;

      case 'coaches':
        setCoachesNotIncluded(coachesNotIncluded.concat(coachesIncludedChecked));
        setCoachesIncluded(not(coachesIncluded, coachesIncludedChecked));
        setCoachesChecked(not(coachesChecked, coachesIncludedChecked));
        break;


      default:
        break;


    };
  };

  const handleAllLeft = (listItems) => {
    switch (listItems) {
      case 'camps':
        setCampsNotIncluded(campsNotIncluded.concat(campsIncluded));
        setCampsIncluded([]);
        break;
      case 'services':
        setServicesNotIncluded(servicesNotIncluded.concat(servicesIncluded));
        setServicesIncluded([]);
        break;
      case 'coaches':
        setCoachesNotIncluded(coachesNotIncluded.concat(coachesIncluded));
        setCoachesIncluded([]);
        break;
      case 'courses':
        setCoursesNotIncluded(coursesNotIncluded.concat(coursesIncluded));
        setCoursesIncluded([]);
        break;

      default:
        break;
    }

  };

  const { reasons_to_join, bio } = listingForm

  return (

    <>


      <div className={classes.subContainer}>

        <FormControl className={classes.inputTwo} variant="outlined">
          <TextField id="outlined-basic"
            type='text'
            autoComplete='off'
            variant="outlined"
            multiline
            rows={10}
            inputProps={{
              maxLength: 750,
            }}
            value={bio}
            onChange={(e) => setListingForm({ ...listingForm, bio: e.target.value })}
            helperText={`${bio.split('').length}/750`}
            label='Write about the company?'
          />
        </FormControl>


        <div style={{ width: '40%' }}>
          {reasons_to_join.map((el, i) => {
            return (
              <FormControl className={classes.input} variant="outlined">
                <TextField id="outlined-basic"
                  type='text'
                  key={i}
                  value={reasons_to_join[i]}
                  autoComplete='off'
                  variant="outlined"
                  inputProps={{
                    maxLength: 75,
                  }}
                  onChange={(e) => {
                    const arr = [...reasons_to_join]
                    arr[i] = e.target.value
                    setListingForm({ ...listingForm, reasons_to_join: arr })
                  }}
                  helperText={`${reasons_to_join[i].split('').length}/75  `}
                  label='A reason to join the company'
                />
              </FormControl>
            )
          })}
          {reasons_to_join.length < 3 && <Button
            variant="contained" color="primary"
            onClick={() => {
              if (reasons_to_join.length < 3) {
                setListingForm({ ...listingForm, reasons_to_join: [...reasons_to_join, ''] })
              }
            }}>
            Add another reason
</Button>}
        </div>


      </div>



      <div className={classes.transferLists}>
        <TransferListComponent
          handleAllRight={(listItems) => handleAllRight(listItems)}
          handleAllLeft={(listItems) => handleAllLeft(listItems)}
          left={campsNotIncluded}
          right={campsIncluded}
          checked={campsChecked}
          classes={classes}
          listItems='camps'
          handleToggle={(value, listItems) => handleToggle(value, listItems)}
          handleCheckedRight={listItems => handleCheckedRight(listItems)}
          handleCheckedLeft={listItems => handleCheckedLeft(listItems)}
        />

        <TransferListComponent
          handleAllRight={(listItems) => handleAllRight(listItems)}
          handleAllLeft={(listItems) => handleAllLeft(listItems)}
          left={servicesNotIncluded}
          right={servicesIncluded}
          checked={servicesChecked}
          classes={classes}
          listItems='services'
          handleToggle={(value, listItems) => handleToggle(value, listItems)}
          handleCheckedRight={listItems => handleCheckedRight(listItems)}
          handleCheckedLeft={listItems => handleCheckedLeft(listItems)}
        />

      </div>

      <div className={classes.transferLists}>
        <TransferListComponent
          handleAllRight={(listItems) => handleAllRight(listItems)}
          handleAllLeft={(listItems) => handleAllLeft(listItems)}
          left={coursesNotIncluded}
          right={coursesIncluded}
          checked={coursesChecked}
          classes={classes}
          listItems='courses'
          handleToggle={(value, listItems) => handleToggle(value, listItems)}
          handleCheckedRight={listItems => handleCheckedRight(listItems)}
          handleCheckedLeft={listItems => handleCheckedLeft(listItems)}
        />

        <TransferListComponent
          handleAllRight={(listItems) => handleAllRight(listItems)}
          handleAllLeft={(listItems) => handleAllLeft(listItems)}
          left={coachesNotIncluded}
          right={coachesIncluded}
          checked={coachesChecked}
          classes={classes}
          listItems='coaches'
          handleToggle={(value, listItems) => handleToggle(value, listItems)}
          handleCheckedRight={listItems => handleCheckedRight(listItems)}
          handleCheckedLeft={listItems => handleCheckedLeft(listItems)}
        />

      </div>

      <Button
        variant="contained"
        // className={classes.button}
        color="primary"
        onClick={e => handleSubmit(e)}
      >
        Save
          </Button>

    </>
  );
}
