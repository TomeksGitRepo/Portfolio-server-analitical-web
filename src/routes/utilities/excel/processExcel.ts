import XLSX from 'xlsx';
import Papa from 'papaparse';
import { saveToDataBase } from '../../../databaseScripts/mongooseSchemas';
import path from 'path';

export function readFileAndSaveDataToDB(filepath: string): Promise<string> {
  const fileName: string = path.basename(filepath);
  console.log('Starting to reading file fileName:', fileName)
  var workbook = XLSX.readFile(filepath); //TODO was fileName insted of filepath

  var first_sheet_name = workbook.SheetNames[0];
  workbook.vbaraw;
  var csvString = XLSX.utils.sheet_to_csv(workbook.Sheets[first_sheet_name]);

  console.log('csvString: ', csvString);
  var json_data = Papa.parse(csvString, { skipEmptyLines: true, header: true });
  console.log('Recived json: ', JSON.stringify(json_data, null, 2));
  // console.log(XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name]));
  // console.log("first_sheet_name", first_sheet_name);
  // for (var value in workbook.Sheets[first_sheet_name]) {
  //     console.log("value", workbook.Sheets[first_sheet_name][value].w);
  // }

  //TODO make error handling and return value
  return saveToDataBase(JSON.stringify(json_data, null, 2)).then(result => {
    console.log('File saved to DB from saveToDataBase');
    return 'File succesfuly saved to database';
  });
}
