const moment = require("moment");

let events = [
  {
    name: 'The Beatles',
    type: 'Concierto',
    date: moment('2019-12-05', 'YYYY-MM-DD'),
    place: 'Londres',
    description: 'Concierto en la azotea'
  },
  {
    name: 'Led Zeppelin',
    type: 'Concierto',
    date: moment('1977-07-15', 'YYYY-MM-DD'),
    place: 'Seattle',
    description: 'Gran concierto'
  }
];

const getAllEvents = (filters) => {
  if(filters === {}) {
    return events;
  }
  
  const result = events.filter(event => {
    let passFilters = true;

    for(key in filters) {
      if(!(key in event) || event[key].toLowerCase() !== filters[key]) {
        passFilters = false;
        break;
      }
    }

    return passFilters;
  })
  
  return result;
}

const saveEvent = event => {
  events.push(event);
}

module.exports = {
  getAllEvents,
  saveEvent
}