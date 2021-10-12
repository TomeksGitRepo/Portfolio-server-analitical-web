#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;

use serde_json::{json, Value};

use rocket::Config;
use mongodb::options::ClientOptions;
use mongodb::{Client, Database};
use rocket::futures::{TryFutureExt, StreamExt};
use rocket::response::content::Json;
use mongodb::{bson::{doc, Bson, Document}};

use rocket::State;

pub struct databaseConnection {
    pub client_options : ClientOptions,
    pub client : Option<Client>,
    pub database : Option<Database>,
}

impl databaseConnection {
    pub async fn connect_to_db() -> databaseConnection {
        databaseConnection {
            client_options : ClientOptions::parse("mongodb://localhost:27017").await.unwrap(),
            client: None,
            database: None,
        }
    }

    pub async fn init(&mut self) {
        self.client = Some(Client::with_options( self.client_options.clone()).unwrap());
        self.database = Some(self.client.clone().unwrap().database("portfolio_analitical"));

    }
}

#[get("/data/allData")]
async fn index(database_connetor: State<'_,databaseConnection>) -> String {

        let mut cursor = database_connetor.database.as_ref().unwrap().collection("datas").find(None, None).await.unwrap().enumerate();
    let mut stringToSend = "[".to_string();
    while let Some((i, result)) = cursor.next().await {

        let doc = result.unwrap();
       // print!("{}",doc);
        let document = doc ;
        let jsonParsed  = serde_json::to_string_pretty(&document).unwrap();
        stringToSend = stringToSend + &jsonParsed.clone() + ",";
       // print!("{:?}", jsonParsed);
    }
    let stringLength = stringToSend.len() - 1;
    stringToSend = stringToSend[..stringLength].into();
    stringToSend = stringToSend + "]";
    stringToSend
}

#[rocket::main]
async fn main() {
    let mut database_connector = databaseConnection::connect_to_db().await;
    database_connector.init().await;
    let result = rocket::ignite().manage(database_connector).mount("/", routes![index]).launch().await;
    assert!(result.is_ok());
}