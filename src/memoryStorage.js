const moment = require("moment");

let events = [
  {
    name: 'The Beatles',
    type: 'Concierto',
    date: moment('2019-12-05', 'YYYY-MM-DD').unix(),
    place: 'Londres',
    description: 'Concierto en la azotea'
  },
  {
    name: 'Led Zeppelin',
    type: 'Concierto',
    date: moment('1977-07-15', 'YYYY-MM-DD').unix(),
    place: 'Seattle',
    description: 'Gran concierto'
  }
];

const setEvents = data => {
  events = data;
}

const getAllEvents = (filters) => {
  if(filters === {}) {
    return events;
  }
  
  const result = events.filter(event => _byPassedFilters(event, filters));
  
  return result;
}

const _byPassedFilters = (event, filters) => {
  let passFilters = true;

  for(let key in filters) {
    if(key === 'date') {
      if(event[key] !== filters[key].unix()) {
        passFilters = false;
        break;
      }

      continue;
    }

    if(!(key in event) || event[key].toLowerCase() !== filters[key]) {
      passFilters = false;
      break;
    }
  }

  return passFilters;
}

const saveEvent = event => {
  events.push(event);
}

module.exports = {
  setEvents,
  getAllEvents,
  saveEvent,
  events
}