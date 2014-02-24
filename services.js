var pruner = require('./lib/pruner')
  , data   = {
      movies: require('./data/movies')
  };

function getBaseUrl(req) {
  return req.protocol + '://' + req.get('host');
}

function getCurrentUrl(req) {
  return getBaseUrl(req) + req.url.replace(/\/$/, '');
}

/**
 * Routes
 */
module.exports = function(app) {

  /**
   * GET /foo/7/bar
   */
  app.get('/:resources/:id/:nested', function(req, res) {
    var p = req.params;
    var actors = pruner(data[p.resources])
                 .select(p.id)
                 .nested(p.nested)
                 .val();
    res.send(actors || 404);      
  });

  /**
   * GET /foo/42
   */
  app.get('/:resources/:id', function(req, res) {
    var p = req.params;
    var movie = pruner(data[p.resources])
                .select(p.id)
                .replaceArraysByUri(getCurrentUrl(req))
                .prepend(/^\//, getBaseUrl(req))
                .val();
    res.send(movie || 404);
  });

  /**
   * GET /foo
   */
  app.get('/:resources', function(req, res) {
    var p = req.params;
    var movies = pruner(data[p.resources])
                 .replaceArraysByUriInEntries(getCurrentUrl(req))
                 .prependInEntries(/^\//, getBaseUrl(req))
                 .val();
    res.send(movies || 404);
  });

}