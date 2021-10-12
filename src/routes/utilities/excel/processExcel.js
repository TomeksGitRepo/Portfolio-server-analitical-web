"use strict";
exports.__esModule = true;
var xlsx_1 = require("xlsx");
var papaparse_1 = require("papaparse");
var mongooseSchemas_1 = require("../../../databaseScripts/mongooseSchemas");
var path_1 = require("path");
function readFileAndSaveDataToDB(filepath) {
    var fileName = path_1["default"].basename(filepath);
    var workbook = xlsx_1["default"].readFile(fileName);
    var first_sheet_name = workbook.SheetNames[0];
    workbook.vbaraw;
    var csvString = xlsx_1["default"].utils.sheet_to_csv(workbook.Sheets[first_sheet_name]);
    console.log(csvString);
    var json_data = papaparse_1["default"].parse(csvString, { skipEmptyLines: true, header: true });
    console.log('Recived json: ', JSON.stringify(json_data, null, 2));
    // console.log(XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]));
    // console.log("first_sheet_name", first_sheet_name);
    // for (var value in workbook.Sheets[first_sheet_name]) {
    //     console.log("value", workbook.Sheets[first_sheet_name][value].w);
    // }
    //TODO make error handling and return value
    return mongooseSchemas_1.saveToDataBase(JSON.stringify(json_data, null, 2)).then(function (result) {
        console.log('Result of save: ');
        console.log(result);
        return 'File succesfuly saved to database';
    });
}
exports.readFileAndSaveDataToDB = readFileAndSaveDataToDB;
