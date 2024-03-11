const mongoose = require('mongoose');
const config = require('../config');
async function connect() {
  try{
    await mongoose.connect(config.db.uri);
    console.log("Kết nối với database thành công!!");
  }catch(error) {
    console.log("Kết nối thất bại!!");
  }
}

module.exports = { connect }