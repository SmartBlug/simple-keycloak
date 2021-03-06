const config = require('./config.js');
const express = require('express');
const morgan = require('morgan');
const Package = require('./package.json');
const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session');
const Keycloak = require('keycloak-connect')

const memoryStore = new session.MemoryStore();
const kc = new Keycloak({memoryStore}, config.keycloak.back);

const app = express();

//*****************************************************

app.use( kc.middleware() );
app.use(bodyParser.json());

if (config.accessLog) {
  app.use(morgan(config.accessLog));
}

//*****************************************************

// Static files
app.use('/app', express.static(path.join(__dirname, './public/app')));
app.use('/assets', express.static(path.join(__dirname, './public/assets')));
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, './public/robots.txt'));
});

// Keycloak
app.get('/keycloak', (req, res) => {
  if (config.keycloak.front) res.sendFile(path.join(__dirname, './public/app/keycloak.js'));
  else res.end();
});
app.get('/keycloak.json', (req, res) => {
  res.json(config.keycloak.front);
});
app.get('/token',kc.protect(), (req, res) => {
  var token = req.kauth.grant.access_token.content;
  res.json(token);
});

// App
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/index.html'));
});

//*****************************************************

let server;
if(config.port) {
  // HTTP Server
  server = app.listen(config.port, config.iface, () => {
    console.log(Package.name,Package.version,'build',Package.build,`listening on http://${config.iface}:${config.port}`);
    if (config.keycloak.front) console.log(`Keycloak activated on ${config.keycloak.back["auth-server-url"]}realms/${config.keycloak.back["realm"]}`);
  });
}

let httpsServer;
if(config.sslPort && config.sslKeyFile && config.sslCertFile) {
  // HTTPS Server
  const sslOpts = {
    key: fs.readFileSync(config.sslKeyFile),
    cert: fs.readFileSync(config.sslCertFile)
  };
  httpsServer = https.createServer(sslOpts, app)
    .listen(config.sslPort, config.iface, () => {
      console.log(Package.name,Package.version,'build',Package.build,`listening on https://${config.iface}:${config.sslPort}`);
      if (config.keycloak.front) console.log(`Keycloak activated on ${config.keycloak.back["auth-server-url"]}realms/${config.keycloak.back["realm"]}`);
    });
}

// graceful shutdown
function shutdown() {
  console.log(Package.name,'shutting down...');
  if(server) {
    server.close(() => {
      server = false;
      if(!server && !httpsServer) process.exit(0);
    });
  }
  if(httpsServer) {
    httpsServer.close(() => {
      httpsServer = false;
      if(!server && !httpsServer) process.exit(0);
    });
  }
  setTimeout(function() {
    console.log('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 60 * 1000);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);