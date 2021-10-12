import mongoose from 'mongoose';
const databaseAddress = 'mongodb://127.0.0.1:27017/portfolio_analitical';
export default databaseAddress;

mongoose.connect(databaseAddress, { useNewUrlParser: true, autoIndex: true });
