"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var dbAddress_1 = require("./dbAddress");
var db = mongoose_1["default"].connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connection to ' + dbAddress_1["default"] + 'established');
});
var record = new mongoose_1["default"].Schema({
    rodzaj: {
        type: String,
        index: true
    },
    tytul: {
        type: String,
        index: true
    },
    zrodlo: String
}, {
    strict: false
});
var Record = mongoose_1["default"].model('Record', record);
var data = new mongoose_1["default"].Schema({
    tytul: {
        type: String,
        index: true,
        required: true
    },
    rodzaj: {
        type: String,
        required: true,
        index: true
    },
    tagi: {
        type: [String],
        index: true
    },
    data: [record],
    createdAt: {
        type: Date,
        "default": Date.now
    }
});
exports.Data = mongoose_1["default"].model('Data', data);
// TODO remove this just to remaind how to save to db
// silence.save(function (err, silence) {
//    if (err) return console.error(err);
//    silence.speak();
//  });
function saveToDataBase(stringData) {
    var dataObject = JSON.parse(stringData);
    console.log('dataObject.data[0].tytul = ', dataObject.data[0].tytul);
    console.log('dataObject.data[0].rodzaj = ', dataObject.data[0].rodzaj);
    var newDataSet = new exports.Data({
        tytul: dataObject.data[0].tytul,
        rodzaj: dataObject.data[0].rodzaj
    });
    var key;
    for (key in dataObject.data) {
        if (dataObject.data.hasOwnProperty(key)) {
            console.log('In for loop of object' +
                key +
                ' = ' +
                JSON.stringify(dataObject.data[key]));
            var loopRecord = new Record(dataObject.data[key]);
            newDataSet.data.push(loopRecord);
        }
    }
    var wasDataSuccessfulySavedToDb = newDataSet.save();
    return wasDataSuccessfulySavedToDb;
}
exports.saveToDataBase = saveToDataBase;