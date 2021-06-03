import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  field: {
    margin: '2rem 0'
  },
  label: {
    marginBottom: '.25rem'
  },
  textarea: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50%',
    },
  },
  stepper: {
    backgroundColor: 'transparent'
  },
}));



function AssessmentCoachView({
  assessmentView,
  application,
  setTabValue
}) {

  const { player_last_name, player_first_name } = application[2].personal_details

  const { heading, data } = assessmentView

  const [assessmentDataObject, setAssessmentDataObject] = useState({
    userId: application[0],
    assessment_id: '',
    player_first_name,
    player_last_name,
    camp: 'Ajax Pathway Development Programme',
    areas: {
      [heading]: {
        completed_by: ''
      }
    }
  })

  const { areas } = assessmentDataObject


  const { assessment_areas } = data

  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = Object.keys(assessment_areas);

  const current = Object.keys(assessment_areas)[activeStep]


  useEffect(() => {
    axios.get(`/users/${application[0]}`)
      .then(res => {
        const { applications: { ajax_application: { assessment_id } } } = res.data[0]

        if (assessment_id) {
          getAssessment()
        }
      })
  }, [])



  function getAssessment() {
    axios.get(`/player-assessment/${application[2].assessment_id}`)
      .then(res => {
        setAssessmentDataObject(res.data)
      })
      .catch(err => console.log(err))
  }


  function handleStateChange(e) {
    const { value, name } = e.target
    setAssessmentDataObject({
      ...assessmentDataObject,
      areas: {
        ...areas,
        [heading]: {
          ...areas[heading],
          [current]: {
            ...areas[heading][current],
            [name]: value
          }
        }
      }
    })
  }


  function handleAssessmentSubmit(e) {
    e.preventDefault()

    axios.post('/player-assessment', {
      ...assessmentDataObject,
      ...(application[2].hasOwnProperty('assessment_id') && {
        assessment_id: application[2].assessment_id
      })
    })
      .then(res => {
        setTabValue(2)
      })
      .catch(err => console.log(err))


  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  return (
    <div className={classes.root}>

      <Typography className={classes.subHeading} component='div' >
        <Box
          fontSize={30}
          fontWeight="fontWeightBold" ml={3} mb={2}>
          {heading} Assessment
        </Box>
      </Typography>

      <Stepper className={classes.stepper} activeStep={activeStep} orientation="vertical">

        {steps.map((label, index) => {

          const { question, predetermined_sentences, predetermined_actions } = assessment_areas[label]
          const rating = areas[heading][current]?.rating
          const sentence_arr = predetermined_sentences[rating]
          const action_arr = predetermined_actions[rating]

          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>

                  <form action="" onChange={(e) => handleStateChange(e)}>

                    <div className={classes.field} >
                      <div className={classes.label}>
                        <label> {question} </label>
                      </div>
                      <div class="select">
                        <select
                          value={rating}
                          name='rating'
                        >
                          <option value=""> </option>
                          <option value="1"> 1 - Extremely poor</option>
                          <option value="2"> 2 - Bad </option>
                          <option value="3"> 3 - Average </option>
                          <option value="4"> 4 - Good </option>
                          <option value="5"> 5 - Excellent </option>
                        </select>
                      </div>
                    </div>

                    {areas[heading][current]?.rating && (
                      <div className={classes.field} >
                        <div className={classes.label}>
                          <label> Please select feedback that appropriately reflects the rating  </label>
                        </div>
                        <div class="select">
                          <select value={areas[heading][current]?.rating_selected_feedback}
                            name='rating_selected_feedback'>
                            <option value=""> </option>
                            {sentence_arr?.map(sentence => {
                              return <option value={sentence}> {sentence} </option>
                            })}
                          </select>
                        </div>
                      </div>
                    )}



                    <div className={classes.field} >
                      <div className={classes.label}>
                        <label> Please add any additional performance feedback below </label>
                      </div>
                      <textarea
                        value={areas[heading][current]?.rating_customised_feedback}
                        name='rating_customised_feedback' rows={7} className={classes.textarea}></textarea>
                    </div>


                    <div className={classes.field} >
                      <div className={classes.label}>
                        <label> Select the development actions </label>
                      </div>
                      <div class="select">
                        <select
                          name='development_selected_actions'
                          value={areas[heading][current]?.development_selected_actions}
                        >
                          <option value=""> </option>
                          {action_arr?.map(action => {
                            return <option value={index + action}> {action} {areas[heading][current].rating} </option>
                          })}
                        </select>
                      </div>
                    </div>


                    <div className={classes.field} >
                      <div className={classes.label}>
                        <label> Please add any additional performance feedback below </label>
                      </div>
                      <textarea
                        value={areas[heading][current]?.development_customised_actions}
                        name='development_customised_actions' rows={7} className={classes.textarea}></textarea>
                    </div>


                  </form>
                </Typography>

                {index === steps.length - 1 && (
                  <div className={classes.field}>
                    <div className={classes.label}>
                      <label> AssessmentCompleted By </label>
                    </div>
                    <p class="control is-expanded">
                      <input
                        onChange={(e) => {
                          setAssessmentDataObject({
                            ...assessmentDataObject,
                            areas: {
                              ...areas,
                              [heading]: {
                                ...areas[heading],
                                completed_by: e.target.value
                              }
                            }
                          })
                        }}
                        value={areas[heading].completed_by}
                        class="input" type="text" />
                    </p>
                  </div>
                )}
                <div className={classes.actionsContainer}>
                  <div className={classes.buttonContainer}>

                    {activeStep !== 0 && <Button
                      style={{ marginRight: '6rem' }}
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                  </Button>}


                    {activeStep !== steps.length - 1 && <Button
                      onClick={(e) => handleAssessmentSubmit(e)}
                      variant="outlined"
                      color="primary"
                      className={classes.button}
                    >
                      Save Progress & Exit
                  </Button>}

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => activeStep === steps.length - 1 ? handleAssessmentSubmit(e) : handleNext()}
                      className={classes.button}
                    >
                      {activeStep === steps.length - 1 ? 'Finish Assessment' : 'Next'}
                    </Button>


                  </div>
                </div>
              </StepContent>
            </Step>

          )
        })}
      </Stepper>


    </div>
  );
}

export default withRouter(AssessmentCoachView)