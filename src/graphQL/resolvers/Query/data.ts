import { Data } from '../../../databaseScripts/mongooseSchemas';

let getAllData = async () => {
  let result = await Data.find({}).exec();

  console.log('result after quering whole data:', result[0].data[0].toString());

  return result;
};

export { getAllData as default };
