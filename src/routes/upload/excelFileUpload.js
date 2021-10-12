"use strict";
exports.__esModule = true;
var express_1 = require("express");
var formidable_1 = require("formidable");
var processExcel_1 = require("./../utilities/excel/processExcel");
exports.router = express_1["default"].Router();
exports.router.get('/excel/uploadForm', function (req, res) {
    res.charset = 'utf-8';
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('<form action="/excel/upload" enctype="multipart/form-data" method="post">' +
        '<h1>Załaduj plik na server</h1>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>');
});
exports.router.post('/excel/upload', function (req, res) {
    var form = new formidable_1["default"].IncomingForm();
    form.keepExtensions = false;
    form.parse(req);
    var filePath;
    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/uploads/excel/' + file.name;
        filePath = file.path;
    });
    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
        processExcel_1.readFileAndSaveDataToDB(filePath)
            .then(function (result) {
            res.send(result);
        })["catch"](function (err) {
            res.send(err);
        });
    });
});
