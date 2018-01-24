import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

let app = null;
import config from '../config';

export default {
  init,
  get: getRout,
  put: putRout,
  post: postRout,
  delete: deleteRout
};

function init(expressApp) {
  app = expressApp;
}

function getRout(route, handler, options = {}) {
  let handlers = getHandlers(handler, options);

  app.get(route, handlers);
}

function putRout(route, handler, options = {}) {
  let handlers = getHandlers(handler, options);

  app.put(route, handlers);
}

function postRout(route, handler, options = {}) {
  let handlers = getHandlers(handler, options);

  app.post(route, handlers);
}

function deleteRout(route, handler, options = {}) {
  let handlers = getHandlers(handler, options);

  app.delete(route, handlers);
}

function getHandlers(handler, options) {
  setOptionsDefaults(options);

  let handlers = [];

  handlers.push(getDecodeJwtHandler());

  if (options.auth) {
    handlers.push(getAuthenticatedCheckHandler());
  }

  handlers.push(handler);

  return handlers;
}

function setOptionsDefaults(options) {
  //require auth by default
  if (options.auth === undefined) {
    options.auth = true;
  }
}

function getAuthenticatedCheckHandler() {
  return (req, res, next) => {
    let isAuthenticated = !!req.currentUser;

    if (isAuthenticated) return next();

    res.status(401).send('Unauthorized');
  };
}

function getDecodeJwtHandler() {
  return (req, res, next) => {
    let token = null;

    if (req.cookies && req.cookies['jwt_token']) {
      token = req.cookies['jwt_token'];
    } else {
      let header = req.headers['x-access-token'];

      token = parseTokenFromHeader(header);
    }

    if (!token) {
      return next();
    }

    // decode token
    // verifies secret and checks exp
    jwt.verify(token, config.auth.jwtKey, (err, decoded) => {
      if (err) {
        return next();
      }

      req.currentUser = decoded;

      return next();
    });
  };

  function parseTokenFromHeader(header) {
    if (!header) return null;

    let prefix = 'Bearer ';

    if (!_.startsWith(header, prefix)) return null;

    return header.substring(prefix.length);
  }
}
