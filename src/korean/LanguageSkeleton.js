export const languages = {
  en: {

    marketingPage: {
      mainTitle: 'Project Football Korea',
      headerMain: 'What is Project Football Korea?',
      headerParagraph: `This is the first time Benfica FC will be in South Korea and we wanted to bring their award-winning academy to train and identify the new football superstar!  
      Project Football Korea is a football talent identification experience like no other.  This is the ultimate football camp for players aged between 15-18 to train and learn from the world-famous Benfica FC. `,
      headerList: 'Reason to apply goes in this bullet point',
      subSectionHeaders: ['FEATURES', 'All you need to know about our features', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
      subSectionCards: [
        {
          title: 'Be One of the First',
          paragraph: `This is the first footballing experience in Korea which guarantees the opportunity for a professional
          trial in Portugal with Benfica FC following a successful camp`
        },
        {
          title: 'Development Experience ',
          paragraph: ` All players will be taught using the same model which has produced Bernardo Silva, Ruben Dias, Ederson, Joao Cancelo, Victor Lindelof, Joao Felix!`
        },
        {
          title: 'Player Representation ',
          paragraph: `All players will have the opportunity to be signed and individually represented by Indulge Football player agency who are KFA (Korean Football Association) registered.`
        },
        {
          title: 'Individual Assessment',
          paragraph: `All players will be assessed and given a personalized report to aid further development.`
        },
        {
          title: 'Football Technology ',
          paragraph: `Everyone player will be asked to wear ISDA technology, and every kick will be filmed for individual analysis from UEFA A accredited coaches.`
        },
        {
          title: 'Football Education',
          paragraph: `Becoming professional requires dedication off the pitch and in our camp you will have 3 seminars on sports psychology, nutrition, and football pathways. `
        }
      ],
      subSectionCampsTitle: 'Camp Dates',
      subSectionCampsCards: [
        {
          age: 'Under 16s',
          date: '4th April 2021',
          days: 'Monday - Thursday',
          location: 'Seoul'
        },
        {
          age: 'Under 17s',
          date: '9th April 2021',
          days: 'Friday - Monday',
          location: 'Seoul'
        },
        {
          age: 'Under 18s',
          date: '14th April 2021',
          days: 'Tuesday - Friday',
          location: 'Seoul'
        }],
      subSectionCampsCardButton: 'Apply Now'
    },

  },

  ko: {
    marketingPage: {
      mainTitle: '안녕하세요',
      headerMain: '안녕하세요',
      headerParagraph: `안녕하세요`,
      headerList: '안녕하세요',
      subSectionHeaders: ['안녕하세요', '안녕하세요', '안녕하세요'],
      subSectionCards: [
        {
          title: '안녕하세요',
          paragraph: '안녕하세요'
        },
        {
          title: '안녕하세요',
          paragraph: '안녕하세요'
        },
        {
          title: '안녕하세요',
          paragraph: '안녕하세요'
        },
        {
          title: '안녕하세요',
          paragraph: '안녕하세요'
        },
        {
          title: '안녕하세요',
          paragraph: '안녕하세요'
        },
        {
          title: '안녕하세요',
          paragraph: '안녕하세요'
        }
      ],
      subSectionCampsTitle: '안녕하세요',
      subSectionCampsCards: [
        {
          age: '안녕하세요',
          date: '안녕하세요',
          days: '안녕하세요',
          location: '안녕하세요'
        },
        {
          age: '안녕하세요',
          date: '안녕하세요',
          days: '안녕하세요',
          location: '안녕하세요'
        },
        {
          age: '안녕하세요',
          date: '안녕하세요',
          days: '안녕하세요',
          location: '안녕하세요'
        }],
      subSectionCampsCardButton: '안녕하세요'
    }

  }
}


const arr = [
  {
    "page": "marketing",
    "section": "1a",
    "english": "hello",
    "korean": "what"
  },
  {
    "page": "marketing",
    "section": "1b",
    "english": "bye",
    "korean": "why"
  },
  {
    "page": "marketing",
    "section": "2",
    "english": "hello",
    "korean": "what"
  },
  {
    "page": "marketing",
    "section": "3",
    "english": "bye",
    "korean": "why"
  },
  {
    "page": "marketing",
    "section": "4",
    "english": "hello",
    "korean": "what"
  },
  {
    "page": "application",
    "section": "1a",
    "english": "bye",
    "korean": "why"
  },
  {
    "page": "application",
    "section": "2",
    "english": "hello",
    "korean": "what"
  },
  {
    "page": "loginn",
    "section": "3a",
    "english": "bye",
    "korean": "why"
  },
  {
    "page": "login",
    "section": "3b",
    "english": "hello",
    "korean": "what"
  },
  {
    "page": "login",
    "section": "1a",
    "english": "bye",
    "korean": "why"
  },
  {
    "page": "login",
    "section": "2",
    "english": "hello",
    "korean": "what"
  },
  {
    "page": "login",
    "section": "3a",
    "english": "bye",
    "korean": "why"
  },
  {
    "page": "login",
    "section": "3b",
    "english": "hello",
    "korean": "what"
  }
]

function convert(arr) {
  let obj = {}

  arr.forEach(x => {
    if (!(x.page in obj)) {
      obj[x.page] = {
        [x.section]: {
          en: x.english,
          ko: x.korean
        }
      }
    } else {
      obj[x.page] = {
        ...obj[x.page],
        [x.section]: {
          en: x.english,
          ko: x.korean
        }
      }
    }
  })

  return obj
}

export const { application, marketing, login, loginn } = convert(arr)
