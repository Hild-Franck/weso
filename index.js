'use strict';

var Ev = require('geval/event');
var wesoStream = require('./src/stream');

var defaultFormatContent = function defaultFormatContent(content) {
  return JSON.stringify(content);
};

var defaultParser = function defaultParser(data) {
  if (!data) return {};

  var pos = data.indexOf(':');
  var route = data.slice(0, pos);

  return { route: route, data: JSON.parse(data.slice(pos + 1)) };
};

var checkRoute = function checkRoute(weso, route) {
  if (weso[route]) throw new Error('Route already reserved ' + route);
  if (/:/.test(route)) throw new Error('Invalid route ' + route);
};

module.exports = function (opts) {
  var broadcasters = {};
  var weso = Ev();
  var pos = content.indexOf(':');

  var formatContent = opts.formatContent || defaultFormatContent;
  var parser = opts.parser || defaultParser;
  var sub = opts.sub || opts.subscribe || [];
  var pub = opts.pub || opts.publish || [];
  var stream = opts.str || opts.stream || [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = sub[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var route = _step.value;

      checkRoute(weso, route);
      var ev = Ev();
      broadcasters[route] = ev.broadcast;
      weso[route] = ev.listen;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    var _loop = function _loop() {
      var route = _step2.value;

      checkRoute(weso, route);
      var prefixedRoute = route + ':';
      weso[route] = function (d) {
        return weso.broadcast(prefixedRoute + formatContent(d));
      };
    };

    for (var _iterator2 = pub[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    var _loop2 = function _loop2() {
      var route = _step3.value;

      checkRoute(weso, route);
      var prefixedRoute = route + ':';
      var ev = Ev();
      weso[route] = function (d) {
        return wesoStream(weso, prefixedRoute, formatContent, d);
      };
      broadcasters[route] = ev.broadcast;
      weso.streams[route] = ev.listen;
    };

    for (var _iterator3 = stream[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      _loop2();
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  weso.onmessage = function (data, ws) {
    var parsed = parser(data);
    var broadcast = broadcasters[parsed.route];
    if (!broadcast) return;

    parsed.ws = ws;
    broadcast(parsed);
  };

  return weso;
};
