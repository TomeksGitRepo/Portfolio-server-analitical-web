import express from "express";
import {
  Data,
  getUserLastSearchedPhrase,
  saveUserToDatabase,
  updateUserInDatabase,
  IData,
} from "../../../databaseScripts/mongooseSchemas";
import UniqueNumberGenerator from "../../../UniqueClientManager/UniqueNumberGenerator";

export const router = express.Router();

router.get(
  "/data/allData",
  async (req: express.Request, res: express.Response) => {
    var userUUID = req.cookies["userUUID"];
    res.header("Access-Control-Allow-Origin", "*");
    if (undefined != userUUID) {
      var lastQuery = await getUserLastSearchedPhrase(userUUID);
      if ("User did't searched any query" != lastQuery) {
        await getResultFromDBAndSendResponseFromCookie(lastQuery, res);
        return;
      }
    }
    if (undefined == userUUID) {
      await addUserUUIDCookie(req, res);
    }

    var allData = Data.find({}).sort({ createdAt: -1 }).exec();
    allData
      .then((data) => res.send(JSON.stringify(data)))
      .catch((err) => res.send(err));
  }
);

router.get(
  "/data/allDiagrams",
  (req: express.Request, res: express.Response): void => {
    var allData = Data.find({ rodzaj: "wykres" }).exec();
    allData
      .then((data) => res.send(JSON.stringify(data)))
      .catch((err) => res.send(err));
  }
);

router.get(
  "/data/allTables",
  (req: express.Request, res: express.Response): void => {
    var allData = Data.find({ rodzaj: "tabela" }).exec();
    allData
      .then((data) => res.send(JSON.stringify(data)))
      .catch((err) => res.send(err));
  }
);

router.get(
  "/data/allMapsPoland",
  (req: express.Request, res: express.Response): void => {
    var allData = Data.find({ rodzaj: "mapaPolski" }).exec();
    allData
      .then((data) => res.send(JSON.stringify(data)))
      .catch((err) => res.send(err));
  }
);

router.post("/data/getTitle", (req: express.Request, res: express.Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  var query = req.body["query"];
  if (query == null) {
    res.send("No query detected. You need to provide a query string.");
    return;
  }
  updateUserInDatabase({
    uuid: req.cookies["userUUID"] as String,
    newPhrase: query,
  });

  getResultFromDBAndSendResponse(query, res);
});

async function getResultFromDBAndSendResponse(
  query: any,
  res: express.Response<any>
) {
  var allData = Data.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
  allData
    .then((data) => {
      if (data.length > 0) {
        res.send(JSON.stringify(data));
      } else {
        var regex = new RegExp(`${query}`, "i");
        Data.find({ tytul: regex })
          .then((data) => {
            res.send(JSON.stringify(data));
          })
          .catch((err) => res.send(err));
      }
    })
    .catch((err) => res.send(err));
}

async function getResultFromDBAndSendResponseFromCookie(
  query: any,
  res: express.Response<any>
) {
  var allData = Data.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
  allData
    .then((data) => {
      if (data.length > 0) {
        var dataTemp = addInfoResponseToCookieToData(data);
        res.send(JSON.stringify(dataTemp));
      } else {
        var regex = new RegExp(`${query}`, "i");
        Data.find({ tytul: regex })
          .then((data) => {
            var dataTemp = addInfoResponseToCookieToData(data);
            var responseText = JSON.stringify(dataTemp);
            res.send(responseText);
          })
          .catch((err) => res.send(err));
      }
    })
    .catch((err) => res.send(err));

  function addInfoResponseToCookieToData(data: IData[]) {
    return data.map((item) => {
      var tempJson : any = item.toObject();
      tempJson.searchedFromCookie = true;
      tempJson.searchedQuery = query;
      return tempJson;
    });
  }
}

async function addUserUUIDCookie(req: express.Request, res: express.Response) {
  var userUUIDCookieValue = req.cookies["userUUID"];
  if (userUUIDCookieValue != null) {
    return;
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  var userUUID = UniqueNumberGenerator.generateUUIDv4();
  var farFuture = new Date(
    new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10
  );
  var userSetCookieValue;
  //console.log(`req.headers.host == ${req.headers.host}`);
  if (req.headers.host == "localhost:3000") {
    //console.log("In developement mode req.headers.host == localhost:3000");
    userSetCookieValue = `userUUID=${userUUID}; Path=/; Expires=${farFuture.toUTCString()}`;
  } else {
    userSetCookieValue = `userUUID=${userUUID}; Path=/; Expires=${farFuture.toUTCString()}; SameSite=None; Secure`;
  }

  console.log(
    `userSetCookieValue in addUserUUIDCookie is ${userSetCookieValue}`
  );
  res.setHeader("set-cookie", userSetCookieValue); // ~10y
  //res.cookie("userUUID", userUUID, { expires: farFuture, sameSite: "none" });
  saveUserToDatabase(userUUID);
}
