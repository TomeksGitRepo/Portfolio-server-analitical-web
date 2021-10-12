"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var site = new mongoose_1["default"].Schema({
    url: { type: String },
    title: { type: String },
    content: { type: String },
    isOnMainMenu: { type: Boolean, "default": false }
}, { strict: false });
exports.Site = mongoose_1["default"].model('Site', site);
