require('newrelic');

var cors    = require('cors')
  , express = require('express')
  , app     = express()
  , port    = process.env.PORT || 3000
  , oneDayInSeconds = 60 * 60 * 24
  , oneDayInMillis  = oneDayInSeconds * 1000
  ;

app.use(express.favicon(__dirname + '/public/favicon.ico'));
app.use(express.logger('dev'));
app.use(cors());

app.use('/data', express.static('data', { maxAge: oneDayInMillis }));
app.use(express.static('public',        { maxAge: oneDayInMillis }));

app.use(app.router);
app.get('*', function(req, res, next) {
  res.setHeader('Cache-Control', 'public, max-age=' + oneDayInSeconds);
  next();
});
require('./services')(app);

app.listen(port, function() {
  console.log('Tarantino movies server listening on port ' + port);
});