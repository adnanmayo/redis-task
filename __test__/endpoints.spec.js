process.env.NODE_ENV = 'test'



const request = require('supertest')
const app = require('../index');
describe('Post Endpoints', () => {
  it('should create a new target', async () => {
    const res = await request(app)
      .post('/targets')
      .send(
        {
          "id": 3,
          "url": "http://example.com",
          "value": "0.50",
          "maxAcceptsPerDay": 10,
          "accept": {
              "geoState": {
                  "$in": ["ca", "ny", "nv"]
              },
                  "hour": {
                  "$in": [ "13", "14", "15" ]
                  }
          }
      }
    
      )
    expect(res.statusCode).toEqual(201)
  })
})



// test.serial.cb('healthcheck', function (t) {
//   var url = '/health'
//   servertest(server(), url, { encoding: 'json' }, function (err, res) {
//     t.falsy(err, 'no error')

//     t.is(res.statusCode, 200, 'correct statusCode')
//     t.is(res.body.status, 'OK', 'status is ok')
//     t.end()
//   })
// })


