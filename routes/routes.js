var request = require('superagent');

var appRouter = function(app) {
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
