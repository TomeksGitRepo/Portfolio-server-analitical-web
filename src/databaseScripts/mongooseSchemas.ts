import mongoose, { Document } from "mongoose";
import databaseAddress from "./dbAddress";

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connection to " + databaseAddress + " established.");
});

export interface IRecord extends Document {
  rodzaj: string;
  tytul: string;
  zrodlo?: string;
}

export interface IData extends Document {
  tytul: string;
  rodzaj: string;
  tagi: string[];
  data: IRecord[];
  createdAt: Date;
}

export interface IUser extends Document {
  UUID: string;
  searchedPhrases: string[];
}

var user = new mongoose.Schema({
  uuid: { type: String, index: true, required: true },
  searchedPhrases: { type: [String] },
});

var User = mongoose.model<IUser>("User", user);

var record = new mongoose.Schema(
  {
    rodzaj: { type: String, index: true },
    tytul: { type: String, index: true },
    zrodlo: String,
  },
  { strict: false }
);

var Record = mongoose.model<IRecord>("Record", record);

var data: any = new mongoose.Schema({
  tytul: { type: String, index: true, required: true, text: true },
  rodzaj: { type: String, required: true, index: true, text: true },
  tagi: { type: [String], index: true },
  data: [record],
  createdAt: { type: Date, default: Date.now },
});

export var Data = mongoose.model<IData>("Data", data);

// TODO remove this just to remaind how to save to db
// silence.save(function (err, silence) {
//    if (err) return console.error(err);
//    silence.speak();
//  });

export async function saveToDataBase(stringData: string): Promise<IData> {
  var dataObject = JSON.parse(stringData);
  //console.log('dataObject.data[0].tytul = ', dataObject.data[0].tytul);
  //console.log('dataObject.data[0].rodzaj = ', dataObject.data[0].rodzaj);

  var newDataSet = new Data({
    tytul: dataObject.data[0].tytul,
    rodzaj: dataObject.data[0].rodzaj,
  });

  var key;
  for (key in dataObject.data) {
    if (dataObject.data.hasOwnProperty(key)) {
      // console.log(
      //   'In for loop of object' +
      //     key +
      //     ' = ' +
      //     JSON.stringify(dataObject.data[key])
      // );
      var loopRecord = new Record(dataObject.data[key]);
      newDataSet.data.push(loopRecord);
    }
  }

  //Delete all previous data
  await Data.findOneAndDelete({
    tytul: dataObject.data[0].tytul,
    rodzaj: dataObject.data[0].rodzaj,
  }).exec();

  var restltOfSave = await newDataSet.save();

  return restltOfSave;
}

export async function saveUserToDatabase(uuid: String): Promise<IUser> {
  return User.create(new User({ uuid }));
}

export async function updateUserInDatabase(userUpdate: {
  uuid: String;
  newPhrase: String;
}) {
  if (userUpdate.uuid != null) {
   var result =  await User.findOneAndUpdate(
      { uuid: userUpdate.uuid },
      { $push: { searchedPhrases: userUpdate.newPhrase } }
    );
    console.log(`result of saving to database is ${result}`)
  }
}

export async function getUserLastSearchedPhrase(uuid: String): Promise<String> {
  var result = await User.findOne({ uuid }).exec();

  var lastSearchedQuery =
    result?.searchedPhrases[result?.searchedPhrases.length - 1]; //Off by one
  console.log("after result");
  if (lastSearchedQuery != undefined) {
    return lastSearchedQuery;
  } else {
    return "User did't searched any query";
  }
}
