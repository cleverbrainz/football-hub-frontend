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

export default function ListingTester() {
  const classes = useStyles();
  const [campsChecked, setCampsChecked] = useState([]);
  const [servicesChecked, setServicesChecked] = useState([]);
  const [coursesChecked, setCoursesChecked] = useState([]);
  const [coachesChecked, setCoachesChecked] = useState([]);

  // camps list
  const [campsNotIncluded, setCampsNotIncluded] = useState([{ name: 'camp1' }, { name: 'camp2' }, { name: 'camp3' }]);
  const [campsIncluded, setCampsIncluded] = useState([]);

  // services list
  const [servicesNotIncluded, setServicesNotIncluded] = useState([{ name: 'service1' }, { name: 'service2' }, { name: 'service3' }]);
  const [servicesIncluded, setServicesIncluded] = useState([]);

  // course list
  const [coursesNotIncluded, setCoursesNotIncluded] = useState([{ name: 'course1' }, { name: 'course2' }, { name: 'course3' }]);
  const [coursesIncluded, setCoursesIncluded] = useState([]);

  // coaches list
  const [coachesNotIncluded, setCoachesNotIncluded] = useState([{ name: 'coach1' }, { name: 'coach2' }, { name: 'coach3' }]);
  const [coachesIncluded, setCoachesIncluded] = useState([]);

  const [listingForm, setListingForm] = useState({
    bio: '',
    reasons_to_join: [''],
    services: [],
    courses: [],
    camps: [],
    coaches: [],
    images: []
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

    console.log(requestObj)


    axios
      .post("/companies/listings", requestObj)
      .then((res) => {
        console.log(res.data);
        // history.push("/companyDashboard/coaches");
      })
      .catch((error) => {
        alert(error.message);
      });


    // axios.post(`/user/${auth.getUserId()}`, form, { headers: { Authorization: `Bearer ${auth.getToken()}` } })
    //   .then(res => {
    //     console.log(res.data)
    //     setDataChange(false)
    //   })
    //   .catch(err => {
    //     console.error(err)
    //     setDataChange(false)
    //   })

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
    console.log(campsChecked)
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
        variant="outlined"
        // className={classes.button}
        onClick={e => handleSubmit(e)}
      >
        Save
          </Button>

    </>
  );
}
