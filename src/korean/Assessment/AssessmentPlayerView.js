import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {
  Box,
  Typography,
  Paper,
  Button

} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import auth from '../../lib/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '100px',
  },
  sectionContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  section: {
    width: '100%',
    marginBottom: '2rem',
    [theme.breakpoints.up('md')]: {
      width: '45%',
    },
  },
  field: {
    marginLeft: '40px'
  },
  button: {
    margin: '1rem 0'
  }
}))

const AssessmentPlayerView = ({
  location: { state },
  history
}) => {

  const classes = useStyles()
  const [data, setData] = useState()
  const [feedback, setFeedback] = useState()

  function getAssessment() {
    axios.get(`/player-assessment/${state}`, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => {
        if (res.data.player_feedback) setFeedback(res.data.player_feedback)
        setData(res.data)
      })
      .catch(err => console.log(err))
  }

  function handleSave() {
    axios.post('/player-assessment', {
      ...data,
      player_feedback: feedback
    }, { headers: { Authorization: `Bearer ${auth.getToken()}` }})
      .then(res => history.goBack())
      .catch(err => console.log(err))
  }


  useEffect(() => {
    getAssessment()
  }, [])

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  return (
    <div className={classes.root}>
      {data && (

        <>
          <Typography component='div' >
            <Box fontSize={30} fontWeight="fontWeightBold" ml={5} mt={5} mr={5} mb={2}>
              {data.player_first_name} {data.player_last_name} Player Assessment
              </Box>
          </Typography>


          <div style={{ margin: '2rem 0' }} class="field">
            <div class="field-body">
              <div className={classes.field}>
                <div className={classes.label}>
                  <Box
                    fontSize={15}
                    fontWeight="fontWeightBold">
                    <label> Overall Coach Assessment Feedback </label>
                  </Box>
                </div>
                <div class="control">
                  <p> {data?.coach_generic_comments} </p>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <div class="field-body">
              <div className={classes.field}>
                <div className={classes.label}>
                  <Box
                    fontSize={15}
                    fontWeight="fontWeightBold">
                    <label> Add any assessment feedback below </label>
                  </Box>

                </div>
                <div class="control">
                  <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows='7' cols='100' class="textarea" ></textarea>
                </div>
                <Button
                  className={classes.button}
                  onClick={handleSave}
                  variant='contained' color='primary'>
                  Save Feedback
                </Button>
              </div>
            </div>


          </div>


          <div className={classes.sectionContainer}>
            {Object.keys(data.areas).map(property => {

              const { completed_by } = data.areas[property]

              const completed =
                ((Object.keys(data.areas[property])
                  .map(x => {

                    const { rating, rating_selected_feedback, development_selected_actions } = data.areas[property][x]
                    const completed = [rating, rating_selected_feedback, development_selected_actions]
                      .filter(x => x).length

                    return (completed === 3 && x !== 'completed_by') ? 100 : completed * 33
                  })
                  .reduce(reducer, 0)
                  / (100 * (Object.keys(data.areas[property]).length - 1))) * 100).toFixed(1)

              return (
                <div className={classes.section}>
                  <Typography component='div' >
                    <Box style={{ color: "#3f51b5" }} fontSize={20} fontWeight="fontWeightBold" mb={1} ml={5}>
                      {property} Assessment Area
                    </Box>

                    <Box fontSize={14} fontWeight="fontWeightRegular" ml={5} mb={1.5} mt={.5}>
                      <span style={{ marginRight: '1rem' }}>Assessed by: {!completed_by ? 'N/A' : completed_by} </span>
                      <span style={{ color: completed !== 100 ? 'red' : 'green' }}>{completed}% Completed </span>
                    </Box>

                    {Object.keys(data.areas[property]).map(area => {
                      const { rating_selected_feedback,
                        rating,
                        rating_customised_feedback,
                        development_selected_actions,
                        development_customised_actions } = data.areas[property][area]
                      const completed = [rating, rating_selected_feedback, development_selected_actions,].filter(x => x).length
                      const percentage = completed === 3 ? '100' : completed * 33

                      if (area === 'completed_by') return

                      return (
                        <>
                          <Box fontSize={16} fontWeight="fontWeightBold" ml={5} mb={.5} mt={1}>
                            {area}
                          </Box>
                          <Box fontSize={14} fontWeight="fontWeightRegular" ml={5} mb={1.5} mt={.5}>
                            <span style={{ color: percentage !== '100' ? 'red' : 'green' }}>{percentage}% Completed </span>
                          </Box>

                          <Box fontSize={14} fontWeight="fontWeightRegular" ml={5} mb={.5} mt={.5}>
                            - Rating: {rating}
                          </Box>
                          <Box fontSize={14} fontWeight="fontWeightRegular" ml={5} mb={.5} mt={.5}>
                            - Rating Feedback: {rating_selected_feedback}
                          </Box>
                          {rating_customised_feedback && (
                            <Box fontSize={14} fontWeight="fontWeightRegular" ml={5} mb={.5} mt={.5}>
                              - Additional Rating Feedback: {rating_customised_feedback}
                            </Box>
                          )}
                          <Box fontSize={14} fontWeight="fontWeightRegular" ml={5} mb={.5} mt={.5}>
                            - Development Actions: {development_selected_actions}
                          </Box>

                          {development_customised_actions && (
                            <Box fontSize={14} fontWeight="fontWeightRegular" ml={5} mb={.5} mt={.5}>
                              - Additional Development Feedback: {development_customised_actions}
                            </Box>
                          )}
                        </>
                      )
                    })}
                  </Typography>
                </ div>
              )
            })}
          </div>



        </>
      )}
    </div>
  );
};

export default AssessmentPlayerView;