var request = require('supertest')('http://localhost:3000');

describe('GET /movies', function() {
  it('respond with json', function(done) {
    request.get('/movies')
           .expect('Content-Type', /json/)
           .expect(200, done);
  });
});