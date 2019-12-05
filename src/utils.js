const moment = require('moment');
const config = require('config');
const axiosCacheAdapter = require('axios-cache-adapter');

const axios = axiosCacheAdapter.setup({
  cache: {
    maxAge: 0.5 * 60 * 1000
  }
})

const checkMandatoryFieldsValidity = event => {
  const mandatoryFields = ['name', 'type', 'date', 'place'];

  for(let field of mandatoryFields) {
    if(event[field] === undefined || event[field] === 0){
      return false;
    }
    if(field === 'date' && !moment(event[field], config.get('dateFormat')).isValid()) {
      return false;
    }
  }

  return true;
}

const formatFields = event => {
  const formatedEvent = {};

  for(let field in event) {
    if(field === 'date') {
      formatedEvent[field] = moment(event[field].trim(), config.get('dateFormat'));
    }else {
      formatedEvent[field] = event[field].trim();
    }
  }

  return formatedEvent;
}

const addWeatherInfoToEvents = async events => {
  for(event of events) {
    const wheather = await axios.get(config.get('weatherAPI.current') + 'q=' + event.place);
    event.weather = wheather.data;
  }

  return events;
}

module.exports = {
  checkMandatoryFieldsValidity,
  formatFields,
  addWeatherInfoToEvents
}