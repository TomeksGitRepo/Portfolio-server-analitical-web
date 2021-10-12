"use strict";
exports.__esModule = true;
var express_1 = require("express");
var Site_1 = require("../../../databaseScripts/Site");
exports.router = express_1["default"].Router();
exports.router.get('/sites/getAll', function (req, res) {
    var allSites = Site_1.Site.find({}).exec();
    allSites
        .then(function (data) { return res.send(JSON.stringify(data)); })["catch"](function (err) { return res.send(err); });
});
exports.router.get('/sites/getMainManu', function (req, res) {
    var allSites = Site_1.Site.find({ isOnMainMenu: true }).exec();
    allSites
        .then(function (data) { return res.send(JSON.stringify(data)); })["catch"](function (err) { return res.send(err); });
});
