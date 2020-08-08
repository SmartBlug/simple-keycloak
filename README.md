# simple-keycloak

[![Latests Version](https://img.shields.io/github/package-json/v/SmartBlug/simple-keycloak.svg)](https://github.com/SmartBlug/simple-keycloak)
[![Latests Build](https://img.shields.io/github/package-json/build/SmartBlug/simple-keycloak)](https://github.com/SmartBlug/simple-keycloak)
[![Current Release](https://img.shields.io/github/release/SmartBlug/simple-keycloak.svg)](https://github.com/SmartBlug/simple-keycloak/releases)
[![Known Vulnerabilities](https://snyk.io/test/github/SmartBlug/simple-keycloak/badge.svg)](https://snyk.io/test/github/SmartBlug/simple-keycloak)
[![Docker Automated buil](https://img.shields.io/docker/automated/smartblug/simple-keycloak.svg)](https://hub.docker.com/r/smartblug/simple-keycloak)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Patrick%40Bouffel.com&item_name=simple-keycloak&currency_code=EUR&source=url)

Simple Keycloak Application to connect with your keycloak server and retrieve your token

## Quickstart

### Docker with keycloak
Just add your front and back parameter in SIMPLE-KEYCLOAK_KEYCLOAK env as this sample :
```bash
$ docker run -p 0.0.0.0:3000:3000 -e SIMPLE-KEYCLOAK_KEYCLOAK='{"front":{"realm":"simple-keycloak","auth-server-url":"http://localhost:8080/auth","ssl-required":"external","resource":"simple-keycloak_frontend","public-client":true,"confidential-port":0},"back":{"realm":"simple-keycloak","bearer-only":true,"auth-server-url":"http://localhost:8080/auth","ssl-required":"external","resource":"simple-keycloak_backend","confidential-port":0}}' smartblug/simple-keycloak
```
Connect to your server to check

### Manual, from source

Download and extract latest release package from https://github.com/smartblug/simple-keycloak

```bash
# Install dependencies
$ npm install
$ npm start
```

### Configuration

There are some configs in `config.js` like port and data-dir.  
You can:
* Edit the `config.js` **(not recommend)**
* Add a `config.production.js` where `production` is the value from `NODE_ENV`
  
```
'use strict';

module.exports = {
  keycloak: {
    front: {
      "realm": "simple-keycloak",
      "auth-server-url": "https://iam.mydomain.com/auth/",
      "ssl-required": "external",
      "resource": "simple-keycloak_frontend",
      "public-client": true,
      "confidential-port": 0
    },
    back: {
      "realm": "simple-keycloak",
      "bearer-only": true,
      "auth-server-url": "https://iam.mydomain.com/auth/",
      "ssl-required": "external",
      "resource": "simple-keycloak_backend",
      "confidential-port": 0
    }
  }
};
```

* Define environment Variables like `SIMPLE-KEYCLOAK_KEYCLOAK`
