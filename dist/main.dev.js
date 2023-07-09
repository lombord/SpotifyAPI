"use strict";

var baseUrl = "https://accounts.spotify.com/api";
var apiUrl = "https://api.spotify.com/v1";
var clientId = "17e9f2b4f43f43e7b3e538b363373553";
var clientSecret = "16a652d1e0b0453a887fb150ff598e83";

function updateToken() {
  var data;
  return regeneratorRuntime.async(function updateToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.t0 = regeneratorRuntime;
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch("".concat(baseUrl, "/token"), {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic ".concat(btoa(clientId + ":" + clientSecret))
            },
            body: new URLSearchParams({
              grant_type: "client_credentials"
            }),
            json: true
          }));

        case 4:
          _context.t1 = _context.sent.json();
          _context.next = 7;
          return _context.t0.awrap.call(_context.t0, _context.t1);

        case 7:
          data = _context.sent;
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t2 = _context["catch"](0);
          console.log(_context.t2);

        case 13:
          localStorage.setItem("token", data.access_token);
          console.log("Token has been updated: ".concat(data.access_token));
          setTimeout(updateToken, data.expires_in * 1000);
          return _context.abrupt("return", data.access_token);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function getData(subUrl, params) {
  return regeneratorRuntime.async(function getData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          params = new URLSearchParams(params);
          _context2.prev = 1;
          _context2.t0 = regeneratorRuntime;
          _context2.next = 5;
          return regeneratorRuntime.awrap(fetch("".concat(apiUrl, "/").concat(subUrl, "?") + params, {
            method: "GET",
            headers: {
              Authorization: "Bearer ".concat(localStorage.getItem("token") || updateToken())
            }
          }));

        case 5:
          _context2.t1 = _context2.sent.json();
          _context2.next = 8;
          return _context2.t0.awrap.call(_context2.t0, _context2.t1);

        case 8:
          return _context2.abrupt("return", _context2.sent);

        case 11:
          _context2.prev = 11;
          _context2.t2 = _context2["catch"](1);
          console.log(_context2.t2);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 11]]);
}

function getFullData(links) {
  return regeneratorRuntime.async(function getFullData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function showTracks() {
  var track,
      _ref,
      items,
      _args4 = arguments;

  return regeneratorRuntime.async(function showTracks$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          track = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : ".";
          _context4.next = 3;
          return regeneratorRuntime.awrap(getData("search", {
            q: track,
            type: ["track"],
            limit: 50,
            include_external: "audio"
          }));

        case 3:
          _ref = _context4.sent;
          items = _ref.tracks.items;
          console.log(items);

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}

window.onload = function () {
  updateToken();
  showTracks();
};