var request = require('superagent');

var appRouter = function(app) {
  app.get('/', function(req, res) {
    res.send('Hello World');
  });

  app.get('/account', function(req, res) {
    var accountMock = {
      "username": "bbaker",
      "password": "washboard",
      "twitter": "@bbaker"
    };

    if (!req.query.username) {
      return res.send({ "status": "error", "message": "missing username" });
    } else if (req.query.username !== accountMock.username) {
      return res.send({ "status": "error", "message": "wrong username" });
    } else {
      return res.send(accountMock);
    }
  });

  app.post('/account', function(req, res) {
    if (!req.body.username || !req.body.password || !req.body.twitter) {
      return res.send({ "status": "error", "message": "missing a parameter" });
    } else {
      return res.send(req.body);
    }
  });

  app.post('/xml', function(req, res) {
    if(!req.body.url) {
      return res.send({ "status": "error", "message": "missing url" });
    } else {
      request
        .get(req.body.url)
        .accept('xml')
        .buffer()
        .end(function(err, rsp) {
          if (err) {
            return res.send({ "status": "error", "message": "unable to connect to url" });
          } else {
            res.send(rsp.text);
          }
        });
    }
  });
}

module.exports = appRouter;
