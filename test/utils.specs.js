const assert = require('assert');
const utils = require('../src/utils');
const moment = require('moment');
const config = require('config');


describe('Test checkMandatoryFieldsValidity', () => {
    it('Check validity of mandatory fields for valid input', () => {
        const input = {
            name: 'Evento 1',
            type: 'Danza',
            date: '23/12/2019',
            place: 'Madrid',
            description: 'Día de la danza'
        }
        
        assert.equal(true, utils.checkMandatoryFieldsValidity(input));
    });

    it('Check validity of mandatory fields with empty field', () => {
        const input = {
            name: 'Evento 1',
            type: '',
            date: '23/12/2019',
            place: 'Madrid',
            description: 'Día de la danza'
        }
        
        assert.equal(false, utils.checkMandatoryFieldsValidity(input));
    });

    it('Check validity of mandatory fields without mandatory field', () => {
        const input = {
            type: 'Teatro',
            date: '23/12/2019',
            place: 'Madrid',
            description: 'Día de la danza'
        }
        
        assert.equal(false, utils.checkMandatoryFieldsValidity(input));
    });

    it('Check validity of mandatory fields with invalid date', () => {
        const input = {
            name: 'Evento 1',
            type: 'Teatro',
            date: '2019/12/30',
            place: 'Madrid',
            description: 'Día de la danza'
        }
        
        assert.equal(false, utils.checkMandatoryFieldsValidity(input));
    });
});

describe('Test formatFields', () => {
    it('Check format fields simple', () => {
        const input = {
            name: 'Evento 1',
            type: 'Teatro',
            date: '30/10/2018',
            place: 'Madrid',
            description: 'Día de la danza'
        }

        const formated = utils.formatFields(input);
        
        assert.equal('Evento 1', formated.name);
        assert.equal('Teatro', formated.type);
        assert.equal(moment('30/10/2018', config.get("dateFormat")).unix(), formated.date.unix());
        assert.equal('Madrid', formated.place);
        assert.equal('Día de la danza', formated.description);
    });

    it('Check format fields with spaces', () => {
        const input = {
            name: '          Evento 1',
            type: 'Teatro     ',
            date: '            30/10/2018   ',
            place: 'Madrid ',
            description: ' Día de la danza'
        }

        const formated = utils.formatFields(input);
        
        assert.equal('Evento 1', formated.name);
        assert.equal('Teatro', formated.type);
        assert.equal(moment('30/10/2018', config.get("dateFormat")).unix(), formated.date.unix());
        assert.equal('Madrid', formated.place);
        assert.equal('Día de la danza', formated.description);
    });
});

describe('Test formatFilters', () => {
    it('Check filters format with single field', () => {
        const filters = {
            name: 'Max Gómez'
        }

        const output = utils.formatFilters(filters);

        assert.equal('max gómez', output.name);
        assert.equal(1, Object.keys(output).length);
    });

    it('Check filters format with multiple field', () => {
        const filters = {
            name: 'una obra de teatro',
            type: 'Concierto'
        }

        const output = utils.formatFilters(filters);

        assert.equal('una obra de teatro', output.name);
        assert.equal('concierto', output.type);
        assert.equal(2, Object.keys(output).length);
    });

    it('Check filters format with multiple field with spaces', () => {
        const filters = {
            name: '    una obra de teatro',
            type: ' Concierto     '
        }

        const output = utils.formatFilters(filters);

        assert.equal('una obra de teatro', output.name);
        assert.equal('concierto', output.type);
        assert.equal(2, Object.keys(output).length);
    });

    it('Check filters format of date', () => {
        const filters = {
            date: '  25/05/2019    ',
        }
        const output = utils.formatFilters(filters);

        const filters2 = {
            date: '2019/05/25',
        }
        const output2 = utils.formatFilters(filters);

        assert.equal(moment(filters.date, config.get('dateFormat')).unix(), output.date.unix());
        assert.notEqual(moment(filters2.date, config.get('dateFormat')).unix(), output2.date.unix());
    });

    it('Check filters format ignores not filter param', () => {
        const filters = {
            name: 'una obra de teatro',
            foo: 'Bar'
        }

        const output = utils.formatFilters(filters);

        assert.equal(1, Object.keys(output).length);
    });
});