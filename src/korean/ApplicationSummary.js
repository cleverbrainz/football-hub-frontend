import React from 'react';
import {
  CircularProgress,
  Paper,
  Typography,
  Box,
  Container,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Button
} from '@material-ui/core'
import { application as app, authorization as auth } from './LanguageSkeleton'


const ApplicationSummary = ({ accountCategory, activeStep,
  applicationDetails: {
    personal_details,
    player_attributes,
    football_history,
    challenges
  }, locale }) => {

  const {
    player_first_name,
    player_last_name,
    guardian_last_name,
    guardian_first_name,
    gender,
    contact_number,
    alt_contact_number,
    dob,
    address_line_1,
    address_line_2,
    city,
    postcode,
    nationality,
    email,
    country,
    can_provide_certificates
  } = personal_details
  const {
    height,
    weight,
    position,
    other_positions,
    preferred_foot } = player_attributes
  const {
    current_club,
    award_name,
    award_date,
    award_reasoning,
    previous_clubs,
    highlights_footage_link,
    bio_description,
    private_coach_name,
    private_coach_website,
    private_coach_company,

  } = football_history
  const {
    link_1,
    link_2,
    link_3
  } = challenges

  const awards = {
    'regional': '지역 축구협회 상',
    'kfa': 'KFA 상',
    'foundation': '재단 상'
  }

  return (
    <>

      {activeStep === 2 ? (
        <>
          <Box
            fontSize={15} style={{ color: 'black' }}
            fontWeight="fontWeightBold" mb={1}>
            {app['2d'][locale]}
          </Box>

          <Box
            fontSize={14}
            fontWeight="fontWeightRegular" mb={2}>
            {app['9a'][locale].substring(0, 8)}: {link_1} <br />
            {app['9b'][locale].substring(0, 8)}: {link_2}<br />
            {app['9c'][locale].substring(0, 8)}: {link_3} <br />
          </Box>
        </>
      ) : (
          <>
            {accountCategory === 'parent' && (
              <>
                <Box
                  fontSize={15} style={{ color: 'black' }}
                  fontWeight="fontWeightBold" mb={1}>
                  {app['2d'][locale]}
                </Box>

                <Box
                  fontSize={14}
                  fontWeight="fontWeightRegular" mb={2}>
                  {app['3a'][locale]}: {guardian_first_name} <br />
                  {app['3b'][locale]}: {guardian_last_name}<br />
                  {app['4'][locale]}: {Array.isArray(contact_number) ? contact_number.join('') : contact_number}<br />
                  {app['4a'][locale]}: {Array.isArray(alt_contact_number) ? alt_contact_number.join('') : alt_contact_number}<br />
                  {auth['4d'][locale]}: {email}<br />
                </Box>
              </>
            )
            }

            <Box
              fontSize={15} style={{ color: 'black' }}
              fontWeight="fontWeightBold" mb={1}>
              {app['3'][locale]}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightRegular" mb={2}>
              {app['3a'][locale]}: {player_first_name}<br />
              {app['3b'][locale]}: {player_last_name}<br />

              {accountCategory !== 'parent' && (
                <>
                  {app['4'][locale]}: {Array.isArray(contact_number) ? contact_number.join('') : contact_number}<br />
                  {app['4a'][locale]}: {Array.isArray(alt_contact_number) ? alt_contact_number.join('') : alt_contact_number}<br />
                  {auth['4d'][locale]}: {email}<br />
                </>
              )}
              {app['4b'][locale]}: {app['4c']['ko'].split('/')[
                app['4c']['en'].split('/')
                  .map(el => el.toLowerCase().trim())
                  .indexOf(gender)]}<br />
              {app['4d'][locale]}: {dob}<br />
            </Box>

            <Box
              fontSize={15} style={{ color: 'black' }}
              fontWeight="fontWeightBold" mb={1}>
              {app['4k'][locale]}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightRegular" mb={2}>
              {app['4e'][locale]}: {address_line_1}<br />
              {app['4f'][locale]}: {address_line_2}<br />
              {app['4g'][locale]}: {city}<br />
              {app['4h'][locale]}: {country}<br />
              {app['4j'][locale]}: {postcode}<br />
              {app['4i'][locale]}: {nationality === 'south korean' ? '대한민국, South Korean' : nationality}<br />
              Evidence of residency, if required: {can_provide_certificates ? 'Yes' : 'No'}<br />
            </Box>

            <Box
              fontSize={15} style={{ color: 'black' }}
              fontWeight="fontWeightBold" mb={1}>
              {app['5a'][locale]}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightRegular" mb={2}>
              {app['5b'][locale]}: {height}cm<br />
              {app['5c'][locale]}: {weight}kg<br />
              {app['5d'][locale]}:
              {app['17']['ko'].split('/')[
                app['17']['en'].split('/')
                  .map(el => el.toLowerCase().trim())
                  .indexOf(position)]} <br />
              {app['5e'][locale]}: {app['5f']['ko'].split('/')[
                app['5f']['en'].split('/')
                  .map(el => el.toLowerCase().trim())
                  .indexOf(preferred_foot)]}<br />
            </Box>

            <Box
              fontSize={15} style={{ color: 'black' }}
              fontWeight="fontWeightBold" mb={1}>
              {app['6'][locale]}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightBold" mb={1}>
              {app['6a'][locale]}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightRegular" mb={2}>
              <span style={{ marginRight: '1rem' }}> {app['6i'][locale]}:
              {app['19']['ko'].split('/')[
                  app['19']['en'].split('/')
                    .map(el => el.toLowerCase())
                    .indexOf(current_club.age_group)]},  </span>
              {app['6j'][locale]}: {current_club.club} <br />
              <span style={{ marginRight: '1rem' }}> {app['6k'][locale]}: {current_club.middle_school}, </span>
              K1 Affiliation: {current_club.k1_club ?
                app['18']['ko'].split('/')[
                app['18']['en'].split('/')
                  .map(el => el.toLowerCase())
                  .indexOf(current_club.k1_club)]
                : ''}<br />
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightBold" mb={1}>
              {app['11'][locale]}
            </Box>

            {
              previous_clubs.map((x, i) => {
                return (
                  <Box
                    fontSize={14}
                    fontWeight="fontWeightRegular" mb={i === previous_clubs.length - 1 ? 2 : 1}>
                    <span style={{ marginRight: '1rem' }}> {app['6i'][locale]}:
                    {app['19']['ko'].split('/')[
                        app['19']['en'].split('/')
                          .map(el => el.toLowerCase())
                          .indexOf(x.age_group)]},  </span>
                    {app['6j'][locale]}: {x.club} <br />
                    K1 Affiliation: {x.k1_club ?
                      app['18']['ko'].split('/')[
                      app['18']['en'].split('/')
                        .map(el => el.toLowerCase())
                        .indexOf(x.k1_club)] : ''}<br />
                  </Box>
                )
              })
            }

            <Box
              fontSize={14}
              fontWeight="fontWeightBold" mb={1}>
              Additional Coaching
                </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightRegular" mb={2}>
              <span style={{ marginRight: '1rem' }}> {app['12a'][locale]}: {private_coach_name},  </span>
              {app['12b'][locale]}: {private_coach_company} <br />
              <span style={{ marginRight: '1rem' }}> {app['12c'][locale]}: {private_coach_website}, </span>
            </Box>

            <Box
              fontSize={15} style={{ color: 'black' }}
              fontWeight="fontWeightBold" mb={1}>
              {app['13'][locale]}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightBold" mb={1}>
              Awards
                </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightRegular" mb={2}>
              <span style={{ marginRight: '1rem' }}> {app['14a'][locale]}: {awards[award_name]}, </span>
              {app['14b'][locale]}: {award_date} <br />
              <span style={{ marginRight: '1rem' }}> {app['14c'][locale]}: {award_reasoning}, </span>
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightBold" mb={1}>
              {app['15c'][locale]}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightRegular" mb={2}>
              {highlights_footage_link.map(x => <> {x} <br /> </>)}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightBold" mb={1}>
              {app['6g'][locale]}
            </Box>

            <Box
              fontSize={14}
              fontWeight="fontWeightRegular" mb={2}>
              {bio_description}
            </Box>

          </>
        )}

    </>



  );
};

export default ApplicationSummary;