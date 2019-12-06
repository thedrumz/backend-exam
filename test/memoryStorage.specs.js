const assert = require('assert');
const storage = require('../src/memoryStorage');
const moment = require('moment');
const config = require('config');


describe('Get events', () => {
    beforeEach(function () {
        const events = [
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

        storage.setEvents(events);
    });

    it('Basic events get', () => {
        assert.equal(2, storage.getAllEvents().length);
    });

    it('Get events filtered by name', () => {
        const filters = {
            name: 'the beatles'
        }

        assert.equal(1, storage.getAllEvents(filters).length);
    });

    it('Get events filtered by date', () => {
        const filters = {
            date: moment('2019-12-05', 'YYYY-MM-DD')
        }

        assert.equal(1, storage.getAllEvents(filters).length);
    });

    it('Get events filtered by multiple fields', () => {
        const filters = {
            date: moment('1977-07-15', 'YYYY-MM-DD'),
            type: 'concierto'
        }
        const filters2 = {
            date: moment('1977-07-15', 'YYYY-MM-DD'),
            type: 'teatro'
        }

        assert.equal(1, storage.getAllEvents(filters).length);
        assert.equal(0, storage.getAllEvents(filters2).length);
    });
});