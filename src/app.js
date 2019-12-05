const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const storage = require('./memoryStorage');
const utils = require('./utils');

// Winton config
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = createLogger({
  level: 'debug',
  format: combine(
    label({ label: 'main' }), timestamp(),
    myFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'debug.log', level: 'debug' })
  ]
});

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  const API_KEY = req.query['key'];
  const VALID_KEY = '999111222';

  if(API_KEY === undefined || API_KEY !== VALID_KEY) {
    res.status(401).send();
    return;
  }

  next();
});
app.use((req, res, next) => {
  logger.debug(`Request to ${req.url} with method ${req.method} and body data ${JSON.stringify(req.body)}`);

  next();
});

// Endpoints

app.get('/events', async (req, res) => {
  let filters = {};

  if(req.query.name !== undefined) {
    filters.name = req.query.name.toLowerCase().trim();
  }
  if(req.query.type !== undefined) {
    filters.type = req.query.type.toLowerCase().trim();
  }
  if(req.query.date !== undefined) {
    filters.date = req.query.date.toLowerCase().trim();
  }
  if(req.query.place !== undefined) {
    filters.place = req.query.place.toLowerCase().trim();
  }

  const events = storage.getAllEvents(filters);

  const eventsWhithWeather = await utils.addWeatherInfoToEvents(events);
  
  res.send(eventsWhithWeather)
});

app.post('/events', (req, res) => {
  const event = {
    name: req.body.name,
    type: req.body.type,
    date: req.body.date,
    place: req.body.place,
    description: req.body.description
  }

  if(!utils.checkMandatoryFieldsValidity(event)) {
    res.status(400).send();
    return;
  }

  const formatedEvent = utils.formatFields(event)

  storage.saveEvent(formatedEvent);

  res.send();
});

const port = config.get('server.port');

app.listen(port, () => {
  // logger.info(`Starting points of interest application listening on port ${port}`);
});