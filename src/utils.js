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
    if(event[field] === undefined || event[field].length === 0){
      return false;
    }
    if(field === 'date' && !moment(event[field], config.get('dateFormat'), true).isValid()) {
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

const formatFilters = filters => {
  let formatedFilters = {};

  if(filters.name !== undefined) {
    formatedFilters.name = filters.name.toLowerCase().trim();
  }
  if(filters.type !== undefined) {
    formatedFilters.type = filters.type.toLowerCase().trim();
  }
  if(filters.date !== undefined && moment(filters.date.trim(), config.get('dateFormat'), true).isValid()) {
    formatedFilters.date = moment(filters.date.trim(), config.get('dateFormat'));
  }
  if(filters.place !== undefined) {
    formatedFilters.place = filters.place.toLowerCase().trim();
  }

  return formatedFilters;
}

const addWeatherInfoToEvents = async events => {
  for(event of events) {
    const eventDate = moment.unix(event.date);
    const now = moment();
    const daysDiff = eventDate.diff(now, 'days');
    let weatherApiUrl = config.get('weatherAPI.current');

    if(daysDiff < 0) {
      return events;
    }else if(daysDiff >= 1) {
      weatherApiUrl = config.get('weatherAPI.future');
    }

    const wheather = await axios.get(`${weatherApiUrl}q=${event.place}`);
    event.weather = wheather.data;
  }

  return events;
}

module.exports = {
  checkMandatoryFieldsValidity,
  formatFields,
  formatFilters,
  addWeatherInfoToEvents
}