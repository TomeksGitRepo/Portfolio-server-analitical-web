import express from 'express';
import formidable from 'formidable';
import { readFileAndSaveDataToDB } from './../utilities/excel/processExcel';
import fs from 'fs';
import path from 'path';

export const router = express.Router();

router.get(
  '/excel/uploadForm',
  (req: express.Request, res: express.Response): void => {
    res.charset = 'utf-8';
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(
      '<form action="/excel/upload" enctype="multipart/form-data" method="post">' +
        '<h1>Załaduj plik na server</h1>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>'
    );
  }
);

router.post(
  '/excel/upload',
  (req: express.Request, res: express.Response): void => {
    var form = new formidable.IncomingForm();

    (form as any).keepExtensions = false;

    form.parse(req, () => console.log('req form parsed'));
    var filePath: string;
    //Create file path if not existing
    let dirPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
      fs.mkdirSync(path.join(dirPath, '/excel'));
    }

    form.on('fileBegin', function(name, file) {
      file.path = path.join(__dirname, 'uploads', 'excel', file.name as string);
      filePath = file.path;
    });

    form.on('file', function(name, file) {
      console.log('Uploaded ' + file.name);
      console.log('Uploading file to:', filePath)
      readFileAndSaveDataToDB(filePath)
        .then((result: string) => {
          res.send(result);
        })
        .catch(err => {
          res.send(err);
        });
    });
  }
);
