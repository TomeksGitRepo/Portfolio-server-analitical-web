const express = require("express");
const cors = require("cors");
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const {
  createProxyMiddleware
} = require("http-proxy-middleware");

const options = {
  key: fs.readFileSync(
    path.join(__dirname, "..", "keys", "Klucz prywatnyserver.txt")
  ),
  cert: fs.readFileSync(
    path.join(__dirname, "..", "keys", "Certyfikatserver.txt")
  ),
};

const app = express();
var port = 3004;

var dataServer;
var clientServer;

if (process.env.NODE_ENV == "dev") {
  dataServer = createProxyMiddleware("/data/**", {
    target: "http://localhost:3000",
    changeOrigin: true,
    ws: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    router: {
      localhost: "http://localhost:3000",
    },
  });
  clientServer = createProxyMiddleware("/", {
    target: "http://localhost:3001",
    changeOrigin: true,
    ws: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    router: {
      localhost: "http://localhost:3001",
    },
  });
} else {
  dataServer = createProxyMiddleware("/data/**", {
    target: "http://server332386.nazwa.pl:3000", 
    changeOrigin: true,
    ws: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    cookieDomainRewrite: "nazwa.pl", 
    router: {
      localhost: "http://localhost:3000",
    },
  });
  clientServer = createProxyMiddleware("/", {
    target: "http://server332386.nazwa.pl:3001", 
    changeOrigin: true,
    ws: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    cookieDomainRewrite: "nazwa.pl", 
    router: {
      localhost: "http://localhost:3001",
    },
  });
}

app.use(dataServer);
app.use(clientServer);
app.use(cors());

// if (process.env.NODE_ENV != "dev") {
//   const redirectingToHttps = express();
//   redirectingToHttps
//     .get("*", (req, res) => {
//       res.redirect("https://" + req.headers.host + req.url);

//       // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
//       // res.redirect('https://example.com' + req.url);
//     })
//     .listen(port);
//   https.createServer(options, app).listen(443);
// } else {
  http.createServer(options, app).listen(port);
// }
