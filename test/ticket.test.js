/**
 * @author Anbarasan Swaminathan
 * @email anbu.369@gmail.com
 *
 * @file Test file
 */
//define environment
process.env.NODE_ENV = 'test'

//run server
require('../index')

//Helpers
let config = require('../helpers/config')

//Models
let Ticket = require('../tickets/Ticket')
let Line = require('../lines/Line')

//variables
let expect = require('chai').expect,
    supertest = require('supertest'),
    api = supertest(`http://localhost:${config.port}/api`)

//clean up database after tests
after((done) => {
    Ticket.deleteMany({}, (err) => {

    });
    Line.deleteMany({}, (err) => {
        done();
    });
});

describe('Lottery Game', () => {
    describe('Tickets', () => {
        let ticketId = ''
        let initialNumberOfLines = 0
        describe('Create a ticket', () =>  {
            it('should return a 200 response', (done) => {
                api.post('/ticket')
                    .set('Accept', 'application/json')
                    .expect(200, done)
            })
            it(`should create a ticket and return the same with ${config.defaultNoOfLines} (assigned in helpers/config.js) lines`, (done) => {
                api.post('/ticket')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        ticketId = res.body.ticket._id
                        initialNumberOfLines = res.body.ticket.noOfLines
                        expect(res.body).to.have.property('ticket')
                        expect(res.body.ticket).to.not.equal(null)
                        expect(res.body.ticket).to.have.property('lines')
                        expect(res.body.ticket.lines).to.not.equal(null)
                        expect(res.body.ticket.lines.length).to.be.greaterThan(0)
                        expect(res.body.ticket.lines.length).to.be.equal(config.defaultNoOfLines)
                        done()
                    })
            })
            let noOfLines = 5
            it(`should create a ticket with ${noOfLines} lines`, (done) => {
                api.post(`/ticket?noOfLines=${noOfLines}`)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('ticket')
                        expect(res.body.ticket).to.not.equal(null)
                        expect(res.body.ticket).to.have.property('lines')
                        expect(res.body.ticket.lines).to.not.equal(null)
                        expect(res.body.ticket.lines.length).to.be.greaterThan(0)
                        expect(res.body.ticket.lines.length).to.be.equal(noOfLines)
                        done()
                    })
            })
        })

        describe('Get Tickets', () => {
            it('should get all the tickets', (done) => {
                api.get('/ticket')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('tickets')
                        done()
                    })
            })
            it('should get ticket by id', (done) => {
                api.get(`/ticket/${ticketId}`)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('ticket')
                        expect(res.body.ticket).to.not.equal(null)
                        expect(res.body.ticket).to.have.property('lines')
                        expect(res.body.ticket.lines).to.not.equal(null)
                        expect(res.body.ticket.lines.length).to.be.greaterThan(0)
                        expect(res.body.ticket._id).to.be.equal(ticketId)
                        done()
                    })
            })
        })

        let additionalLines = 2
        describe('Update tickets', () => {
            it(`should update the number of lines of a ticket. Add ${additionalLines} more lines`, (done) => {
                api.put(`/ticket/${ticketId}?noOfLines=${additionalLines}`)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('ticket')
                        expect(res.body.ticket).to.not.equal(null)
                        expect(res.body.ticket).to.have.property('lines')
                        expect(res.body.ticket.lines).to.not.equal(null)
                        expect(res.body.ticket.lines.length).to.be.greaterThan(0)
                        expect(res.body.ticket._id).to.be.equal(ticketId)
                        expect(res.body.ticket.lines.length).to.be.equal(initialNumberOfLines + additionalLines)
                        done()
                    })
            })
            it('should return status of a ticket and close the ticket for further updation', (done) => {
                api.put(`/status/${ticketId}`)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property('ticket')
                        expect(res.body.ticket).to.not.equal(null)
                        expect(res.body.ticket).to.have.property('lines')
                        expect(res.body.ticket.lines).to.not.equal(null)
                        expect(res.body.ticket.lines.length).to.be.greaterThan(0)
                        expect(res.body.ticket._id).to.be.equal(ticketId)
                        expect(res.body.ticket.statusChecked).to.be.equal(true)
                        done()
                    })
            })
            it('should not allow ticket to be updated if the status of the ticket is checked', (done) => {
                api.put(`/ticket/${ticketId}?noOfLines=${additionalLines}`)
                    .set('Accept', 'application/json')
                    .expect(400, done)
            })
        })
    })

    describe('Lines', () => {
        let currentLine = null;
        it('should create a new Line', function() {
            currentLine = Line.newLine();
            expect(currentLine).to.not.be.null;
        });

        describe('Check the result of all line values', function() {
            it('should be 10 if sum of the values is 2. ex [1, 0, 1]', function() {
                currentLine.line = [1, 0, 1];
                expect(currentLine.result).to.be.equal(10);
            });
            it('should be 10 if sum of the values is 2. ex [2, 0, 0]', function() {
                currentLine.line = [2, 0, 0];
                expect(currentLine.result).to.be.equal(10);
            });
            it('should be 5 if all the values are same. ex [2, 2, 2]', function() {
                currentLine.line = [2, 2, 2];
                expect(currentLine.result).to.be.equal(5);
            });
            it('should be 5 if all the values are same. ex [0, 0, 0]', function() {
                currentLine.line = [0, 0, 0];
                expect(currentLine.result).to.be.equal(5);
            });
            it('should be 1 if 2nd and 3rd values are different from 1st. ex [1, 0, 2]', function() {
                currentLine.line = [1, 0, 2];
                expect(currentLine.result).to.be.equal(1);
            });
            it('should be 1 if 2nd and 3rd values are different from 1st. ex [2, 1, 1]', function() {
                currentLine.line = [2, 1, 1];
                expect(currentLine.result).to.be.equal(1);
            });
            it('should be 0 if it does not satisfy above conditions. ex [1, 1, 2]', function() {
                currentLine.line = [1, 1, 2];
                expect(currentLine.result).to.be.equal(0);
            });
            it('should be 0 if it does not satisfy above conditions. ex [0, 0, 1]', function() {
                currentLine.line = [0, 0, 1];
                expect(currentLine.result).to.be.equal(0);
            });
        });
    })
})
