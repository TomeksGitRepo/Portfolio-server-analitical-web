"use strict";
exports.__esModule = true;
var express_1 = require("express");
var mongooseSchemas_1 = require("../../../databaseScripts/mongooseSchemas");
exports.router = express_1["default"].Router();
exports.router.get('/data/allData', function (req, res) {
    var allData = mongooseSchemas_1.Data.find({}).exec();
    allData
        .then(function (data) { return res.send(JSON.stringify(data)); })["catch"](function (err) { return res.send(err); });
});
