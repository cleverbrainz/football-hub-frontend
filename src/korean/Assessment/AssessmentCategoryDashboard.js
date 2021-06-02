import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { data } from './data'
import axios from 'axios'

const useRowStyles = makeStyles({
  row: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  tableHeading: {
    fontWeight: 'bold'
  },
  link: {
    fontSize: '12px'
  }
});

export default function AssessmentCategoryDashboard({
  application,
  setTabValue,
  setAssessmentView,
  filteredApplications
}) {



  const [assessmentDataObject, setAssessmentDataObject] = useState(null)

  const positions = {
    Defence: ['right back', 'right wing back', 'left wing back', 'left back', 'centre back', 'sweeper'],
    Midfield: ['right wing', 'right midfield', 'left wing', 'left midfield', 'central midfield', 'defensive midfield', 'attacking midfield'],
    Attack: ['striker'],
    Goalkeeper: ['goalkeeper'],
  }

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  useEffect(() => {
    console.log(filteredApplications)
    axios.get(`/users/${application[0]}`)
      .then(res => {
        const { applications: { ajax_application: { assessment_id } } } = res.data[0]

        if (assessment_id) {
          getAssessment(application[2].assessment_id, 'initial')
        }
      })
  }, [])


  function getAssessment(id, type) {
    return axios.get(`/player-assessment/${id}`)
      .then(res => {
        if (type === 'initial') {
          return setAssessmentDataObject(res.data)
        }
        return res.data.areas
      })
  }


  function getAverageRating(current) {
    return Object.keys(current)
      .map(x => {
        return x !== 'completed_by' ? +current[x].rating : 0
      })
      .reduce(reducer, 0) /
      Object.keys(current)
        .filter(x => {
          return (x !== 'completed_by') && current[x].rating !== ''
        })
        .length
  }


  function getPositionRanking(heading) {
    const { position } = application[2].player_attributes
    const currentPos = Object.keys(positions).filter(x => positions[x].includes(position))[0]
    const current = assessmentDataObject?.areas[heading]
    const averages = []
    let ranking 

    var promise = new Promise((resolve, reject) => {
      filteredApplications
        .forEach((app, i) => {
          const { position } = app[2].player_attributes
          const pos = Object.keys(positions).filter(x => positions[x].includes(position))[0]
          if (pos === currentPos) {
            const data = getAssessment(app[2].assessment_id, '')
            data.then(res => {
              averages.push(!getAverageRating(res[heading]) ? 0 : getAverageRating(res[heading]))
              if (i === filteredApplications.length - 1) resolve()
            })
          }

        })
    })

    promise.then(() => {
      const index = averages
        .sort((a, b) => b - a)
        .indexOf(getAverageRating(current))

      ranking = index === -1 ? averages.length : index + 1
    })
    .finally(() => ranking)

  }

  function Row({ row, heading }) {
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const current = assessmentDataObject?.areas[heading]
    // const positionRanking = assessmentDataObject ? console.log(getPositionRanking(heading)) : ''
    const average = assessmentDataObject ? getAverageRating(current) : ''

    console.log({ average })

    const completed = assessmentDataObject ?
      ((Object.keys(current)
        .map(x => {
          const { rating, rating_selected_feedback, development_selected_actions } = current[x]
          const completed = [rating, rating_selected_feedback, development_selected_actions]
            .filter(x => x).length
          return (completed === 3 && x !== 'completed_by') ? 100 : completed * 33
        })
        .reduce(reducer, 0)
        / (100 * (Object.keys(current).length - 1))) * 100).toFixed(1)
      : ''

    return (
      <React.Fragment>
        <TableRow className={classes.row}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>

          <TableCell component="th" scope="row">
            {heading}
          </TableCell>

          {/* where the user assessment data goes  */}

          <TableCell>
            {!average ? '0' : average}
          </TableCell>
          <TableCell>
            {/* {positionRanking} */}
          </TableCell>
          <TableCell style={{ color: completed !== 100.0 ? 'red' : 'green' }}>
            {completed ? completed : 0 + ''}%
          </TableCell>
          <TableCell> 
            {current?.completed_by}
          </TableCell>

          <TableCell align="right">
            <Link className={classes.link} onClick={() => {
              setTabValue(3)
              setAssessmentView({
                heading,
                data: {
                  ...data[heading]
                }
              })
            }}>
              View
          </Link>
          </TableCell>
        </TableRow>
        <TableRow>

          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Criterias
              </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHeading}>Area of Assessment</TableCell>
                      <TableCell className={classes.tableHeading}> Rating </TableCell>
                      <TableCell className={classes.tableHeading}> Position Ranking </TableCell>
                      <TableCell className={classes.tableHeading}> % Completed</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {Object.keys(row).map(subRow => {

                      const rating = assessmentDataObject?.areas[heading][subRow].rating
                      const feedback = assessmentDataObject?.areas[heading][subRow].rating_selected_feedback
                      const actions = assessmentDataObject?.areas[heading][subRow].development_selected_actions
                      const completed = [rating, feedback, actions].filter(x => x).length
                      const percentage = completed === 3 ? '100' : completed * 33

                      return (
                        <TableRow key={subRow.date}>
                          <TableCell component="th" scope="row">
                            {subRow}
                          </TableCell>

                          {/*  rating for that area */}
                          <TableCell>
                            {rating}
                          </TableCell>

                          {/*  position ranking for area */}
                          <TableCell></TableCell>
                          {/* completion percentage based on how much is done */}
                          <TableCell style={{ color: percentage !== '100' ? 'red' : 'green' }}>
                            {percentage + ''}%
                          </TableCell>
                        </TableRow>
                      )
                    })}

                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }


  const classes = useRowStyles();

  const { player_first_name, player_last_name } = application[2].personal_details

  return (
    <div className={classes.root}>

      <Typography component='div'>
        <Box
          fontSize={35}
          fontWeight="fontWeightBold" mt={1} mb={3}>
          {player_first_name} {player_last_name}
        </Box>
      </Typography>

      <TableContainer>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell className={classes.tableHeading}>Area of Assessment</TableCell>
              <TableCell className={classes.tableHeading} align="right">Av. Score</TableCell>
              <TableCell className={classes.tableHeading} align="right">Position Ranking</TableCell>
              <TableCell className={classes.tableHeading} align="right">% Completed</TableCell>
              <TableCell className={classes.tableHeading} align="right">Completed By</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>

            {Object.keys(data).map(heading => {
              return (
                <Row key={heading} heading={heading} row={data[heading].assessment_areas} />
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

  );
}