const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  favoriteItems: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    }
  ]
});

// Tạo model từ Schema
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;

// số lượng người thích 
// const mongoose = require('mongoose');
// const Favorite = require('./favoriteModel'); // Đây là tên file chứa model Favorite

// // Tính số lượng mục đã yêu thích
// Favorite.aggregate([
//     { $project: { numberOfFavorites: { $size: "$favoriteItems" } } }
// ])
// .exec((err, result) => {
//     if (err) {
//         // Xử lỗi
//     } else {
//         console.log("Số lượng mục đã yêu thích:", result[0].numberOfFavorites);
//     }
// });
