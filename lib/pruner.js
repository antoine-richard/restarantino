var _ = require('lodash');

function cutArrayProperties(object) {
  return _.omit(object, function(value) {
    return _.isArray(value);
  });
}

function replaceArrayProperties(object, uri) {
  return _.mapValues(object, function(value, key) {
    return _.isArray(value) ? uri + '/' + key : value;
  });
}

function prependProperties(object, matcher, prefix) {
  return _.mapValues(object, function(value) {
    return matcher.test(value) ? prefix + value : value;
  });
}

function Wrapper(object) {
  this.value = object;
}

Wrapper.prototype = {
  
  /**
   * (convention : "id")
   */
  select: function(id) {
    this.value = _.find(this.value, function(current) {
      return current.id == id;
    });
    return this;
  },

  /**
   *
   */
  nested: function(nestedResources) {
    if (!this.value) return this;
    this.value = this.value[nestedResources]
    return this;
  },

  /**
   *
   */
  cut: function() {
    if (!this.value) return this;
    this.value = cutArrayProperties(this.value);
    return this;
  },

  /**
   *
   */
  cutInEntries: function() {
    if (!this.value) return this;
    this.value = _.map(this.value, function(value) {
      return cutArrayProperties(value);
    });
    return this;
  },

  /**
   *
   */
  replaceArraysByUri: function(uri) {
    if (!this.value) return this;
    this.value = replaceArrayProperties(this.value, uri);
    return this;
  },

  /**
   *
   */
  replaceArraysByUriInEntries: function(uri) {
    if (!this.value) return this;
    this.value = _.map(this.value, function(value) {
      return replaceArrayProperties(value, uri + '/' + value.id);
    });
    return this;
  },

  prepend: function(matcher, prefix) {
    if (!this.value) return this;
    this.value = prependProperties(this.value, matcher, prefix);
    return this;
  },

  prependInEntries: function(matcher, prefix) {
    if (!this.value) return this;
    this.value = _.map(this.value, function(value) {
      return prependProperties(value, matcher, prefix);
    });
    return this;
  },

  /**
   *
   */
  val: function() {
    return this.value;
  }

};

module.exports = function(object) {
  return new Wrapper(object);
};
