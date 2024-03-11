const Cart = require('../models/cart');
const {User, Address} = require('../models/user');
const Product = require('../models/product');
const Comment = require('../models/comment');
const Delivery = require('../models/delivery_address');
const Notification = require('../models/notification');
const Repair = require('../models/repair');
const Contact = require('../models/contacts');

const addProduct = async (req, res, next) => {
    const product = new Product(
        {
            id: 1,
            name: 'Bếp điện từ đôi Kangaroo KG435i ',
            kind: 'Bếp điện',
            discription: 'sử dụng diện 220v',
            image: 'https://kangaroochinhhang.vn/Images/images/Bep-tu-kangaroo-KG435i.webp',
            price: 2990000,
            input_price: 1500000,
            quantity_in_stock: 10,
            quantity_purchased: 10
        }
    )
    try {
        await product.save(); 
        console.log('Đã thêm sản phẩm mới vào cơ sở dữ liệu');
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào cơ sở dữ liệu:', error);
      }
    res.json(product)
}

const addUser = async(req, res, next) => {
    const newuser = new User(
        {
            id: 1,
            roles: 'Shipper',
            name: 'Shipper',
            email: 'shipper@gmail.com',
            password: '123',
        }, 
        
    )
    try {
        await newuser.save(); 
        console.log('Đã thêm người dùng mới vào cơ sở dữ liệu');
      } catch (error) {
        console.error('Lỗi khi thêm người dùng vào cơ sở dữ liệu:', error);
      }
    res.json(newuser)
}

const getProducts = async(req, res, next) => {
  Product.find({})
    .then(products => res.json(products))
    .catch(next);
}

const getDetail = async(req, res, next) => {
  const {detail} = req.query;
  Product.find({kind: detail})
    .then(products => res.json(products))
    .catch(next);
}

const getProductById = async(req, res, next) => {
  const {id} = req.query;
  Product.findOne({id: id})
    .then(product => res.json(product))
    .catch(next);
}

const getCartWithIdUser = async(req, res, next) => {
  const {user_id} = req.query;
  const user = await User.findOne({id: user_id});
  try {
    await Cart.find({user_id: user._id, order: false}) 
    .populate('user_id')
    .populate('item.id_product')
    .then(carts => res.json(carts))
    .catch(next);
  } catch (error) {
    console.log('không tìm thấy user id');
  }
}

const getPay = async(req, res, next) => {
  const {user_id} = req.query;
  const user = await User.findOne({id: user_id});
  await Cart.find({user_id: user._id, order: false}) 
    .populate('user_id')
    .populate('item.id_product')
    .then(pays => res.json(pays))
    .catch(next);
}

const getAddressUserById = async(req, res, next) => {
  const {userId} = req.query;
  try {
    await User.findById(userId)
    .then(user => res.json(user))
    .catch(next);
  } catch (error) {
    console.log(error);
  }
}
const getOnlyAddressOfUserById = async(req, res, next) => {
  const {id_user} = req.query;
  await User.findById(id_user)
    .select('addresses')
    .then(addresses => res.json(addresses))
    .catch(next);
}
const getOrder = async(req, res, next) => {
  const {userId, value} = req.query;
  try {
    if(userId) {
      if (value === 'chưa duyệt') {
        await Cart.find({user_id: userId, order: true, status: 'Chờ duyệt'})
          .populate('user_id')
          .populate('item.id_product')
          .then(orders => res.json(orders))
          .catch(next); 
      } else if ( value === 'đang giao') {
        await Cart.find({user_id: userId, order: true, status: 'Đang giao'})
          .populate('user_id')
          .populate('item.id_product')
          .then(orders => res.json(orders))
          .catch(next);
      } else if (value === 'đã giao') {
        await Cart.find({user_id: userId, order: true, status: 'Đã giao'})
          .populate('user_id')
          .populate('item.id_product')
          .then(orders => res.json(orders))
          .catch(next);
      } else {
        await Cart.find({user_id: userId, order: true})
          .populate('user_id')
          .populate('item.id_product')
          .then(orders => res.json(orders))
          .catch(next);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const getNotification = (req, res, next) => {
  const {user_id} = req.query;
  try {
    Notification.find({user_id: user_id})
      .then(notifications => res.json(notifications))
      .catch(next);
  } catch (error) {
    console.log(error);
  }
}

const getDetailOrder = async(req, res, next) => {
  const { order_id } = req.query;
  await Cart.findById(order_id)
    .populate('user_id')
    .populate('item.id_product')
    .then(orders => res.json(orders))
    .catch(next);
}

const getProductWithKeySearch = async(req, res, next) => {
  const {key} = req.query;
  try {
    const products = await Product.find({ name: { $regex: new RegExp(key, "i") } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getNotificationByID = (req, res, next) => {
  const { id } = req.query;
  try {
    Notification.findById(id)
    .then(notification => res.json(notification))
    .catch(next);
  } catch (error) {
    console.log(error);
  }
}

const getComments = async(req, res, next) => {
  try {
    if(req.query.fillterStar == 0) {
      await Comment.find({product_id: req.query.product_id})
      .populate('user_id')
      .populate('reply.user_id')
      .then(comments => res.json(comments))
      .catch(next);
    } else {
      await Comment.find({product_id: req.query.product_id, number_star: req.query.fillterStar})
      .populate('user_id')
      .then(comments => res.json(comments))
      .catch(next);
    }
   
  } catch (error) {
    console.log(error);
  }
}

const addToCart = async (req, res, next) => {
  const { quantity, id_product, id_user } = req.query;
  const product = await Product.findOne({ id: id_product });
  const quantitys = product.quantity_purchased;
  const user = await User.findOne({ id: id_user });

  const existingCarts = await Cart.find({ user_id: user._id }).sort({ _id: -1 });
  if(quantitys >= quantity) {
    if (existingCarts.length > 0) {
      const lastCart = existingCarts[0];
      if (lastCart.order) {
        const total = product.price * parseInt(quantity);
        const newCart = new Cart({
          id: lastCart.id + 1, // Tạo ID mới cho giỏ hàng
          user_id: user._id,
          item: [
            {
              id_product: product._id,
              quantity: parseInt(quantity),
            },
          ],
          total: total,
          order: false,
          
        });
        try {
          await newCart.save();
          res.json({ notification: 'Sản phẩm đã được thêm vào giỏ hàng mới thành công!' });
        } catch (error) {
          console.log(error);
        }
      } else {
        lastCart.item.push({
          id_product: product._id,
          quantity: parseInt(quantity),
        });
        lastCart.total += product.price * parseInt(quantity);
        try {
          await lastCart.save();
          res.json({ notification: 'Sản phẩm đã được thêm vào giỏ hàng thành công!' });
        } catch (error) {
          console.log(error);
        }
      }
    
    } else {
      const total = product.price * parseInt(quantity);
      const newCart = new Cart({
        id: 1,
        user_id: user._id,
        item: [
          {
            id_product: product._id,
            quantity: parseInt(quantity),
          }
        ],
        total: total,
        order: false,
      });
      try {
        await newCart.save();
        res.json({notification: 'Sản phẩm đã được thêm vào giỏ hàng mới thành công!'});
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    res.json({notification: `Số lượng sản phẩm không đủ. Còn lại ${quantitys}`})
  }
}


const login = async(req, res, next) => {
  const { email, password } = req.body;
  try {
    const checkUer = await User.findOne({ email: email});
    if(!checkUer){
      res.json({error: 'Email không chính xác!'});
    }else if(checkUer.password != password ) {
      res.json({error: 'Mật khẩu không chính xác!'});
    } else {
      res.json({
        id: checkUer.id,
        email: email,
        _id: checkUer._id,
        roles: checkUer.roles,
      });
    }
    
  } catch (error) {
    
  }
}

const register = async(req, res, next) => {
  const {name, email, password, passwordagain} = req.body;
  const newUser = new User({
      id: 1,
      roles: 'User',
      name: name,
      avatar:'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg',
      email: email,
      password: password,
  })
  try {
    const checkUser = await User.findOne({email : email});
    if(checkUser) {
      res.json({error: 'Email đã được đăng ký!'});
    } else if (password.length < 8 ) {
      res.json({error: 'Mật khẩu tối thiểu 8 ký tự!'})
    } else if (password != passwordagain ) {
      res.json({error: 'Nhập mật khẩu không khớp!'});
    } else {
      res.json({success: "Đã đăng ký thành công."})
      await newUser.save();
    }
  } catch (error) {
    console.log(error);
  }
} 

const deleteProduct = async (req, res, next) => {
  const { id_user, product_id } = req.query;
  try {
    const checkCart = await Cart.findOne({ user_id: id_user });

    if (checkCart) {
      const updateResult = await Cart.updateOne(
        { user_id: id_user },
        {
          $pull: { 'item': { id_product: product_id } }
        }
      );

      if (checkCart.item.length <= 1) {
        const deleteCart = await Cart.deleteOne({ user_id: id_user });
        await deleteCart.exec;
      } else if (checkCart.item.length > 1) {
        await updateResult.exec;
        res.json({ notification: 'Đã xóa sản phẩm khỏi giỏ hàng.' });
      }
    } else {
      res.json({ notification: 'Không tìm thấy giỏ hàng cho người dùng.' });
    }
  } catch (error) {
    console.error(error);
  }
}


const addAddressWithIdUser = async(req, res, next) => {
  const {userId} = req.query; 
  const {phone, name, number_house, street, village, district, province} = req.body;
  
  try {
    const newAddress = {
      phone: phone,
      name: name,
      number_house: number_house,
      street: street,
      village: village,
      district: district,
      province: province,
      choose: false,
    };
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: newAddress } },
      { new: true });
      res.json({notitication: 'Thêm địa chỉ mới thành công'});
  } catch (error) {
      res.json({notitication: 'Thêm địa chỉ mới thất bại'});
  }
} 

const updateAddress = async(req, res, next) => {
  const {address_id} = req.query;

  try {

    await User.findOneAndUpdate(
      {'addresses._id': address_id },
      {$set: {"addresses.$.choose": true }},
    );

    const user = await User.findOne({ 'addresses._id': address_id });
    user.addresses.forEach(async (address) => {
      if (address._id.toString() !== address_id) {
        address.choose = false;
      }
    });
    await user.save();
    res.json({notitication: 'Thay đổi địa chỉ thành công.'});
  } catch (error) {
    console.log(error);
    res.json({notitication: 'Thay đổi địa chỉ thất bại.'});
  }
  
}

const orderCart = async(req, res, next) => {
  const {userId} = req.query;
  try {
    const lastCart = await Cart.findOne({ user_id: userId }).sort({ _id: -1 }); 
    if (lastCart) {
      const order = await Cart.updateOne(
        { _id: lastCart._id }, 
        { $set: { order: true } }
      );
      res.json({ notification: 'Đặt hàng thành công' });
    } else {
      res.json({ notification: 'Không tìm thấy giỏ hàng' });
    }
  } catch (error) { 
    res.json({ notification: 'Đặt hàng thất bại' });
    console.log(error);
  }
}

const updateMyFile = async(req, res, next) => {
  const {name, selectedGender, avatar} = req.body;
  const {user_id} = req.query;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { $set: { name: name, avatar: avatar, gender: selectedGender } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.log('lỗi');
    res.status(500).json({ error: "An error occurred while updating the user" });
  }
}
const deleteAddress = async (req, res, next) => {
  const { userId, addressId } = req.query;
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId }, 
      { $pull: { addresses: { _id: addressId } } }, 
      { new: true }
    );
    if (user) {
      console.log('Đã xóa địa chỉ thành công:', user);
    } else {
      console.log('Không tìm thấy người dùng');
    }
  } catch (error) {
    console.error('Lỗi khi xóa địa chỉ:', error);
  }

};

const updatePass = async(req, res, next) => {
  const {userId} = req.query;
  const {oldPass, newPass, confirmPass} = req.body;
  try {
    const user = await User.findById(userId);
    if (user.password != oldPass) {
      console.log(oldPass, user.password );
      res.json({notification: 'Mật khẩu không chính xác!'});
    } else if (newPass != confirmPass) {
      res.json({notification: 'Mật khẩu không khớp'});
    } else {
      user.password = newPass;
      await user.save();
      res.json({notification: 'Đổi mật khẩu thành công'});
    }
  } catch (error) {
    console.log(error);
  }
}

const addContact = async(req, res, next) => {
  const { name, phone, content, userId } = req.body;
  const newContact = await Contact(
    {
      name: name,
      email: userId,
      content: content,
      phone: phone,
    }
  )
  try {
    await newContact.save();
    res.json({message: 'Gửi liên hệ thành công.'});
  } catch (error) {
    res.json({message: 'Gửi liên hệ thất bại.'});
    console.log(error);
  }
}

const addRepair = async (req, res) => {
  const { name, phone, address, content, user_id} = req.body;
  try {
    const new_repair = new Repair(
      {
        user_id: user_id,
        name: name,
        phone: phone,
        address: address, 
        content_repair: content,
      }
    );
    if (new_repair) {
      await new_repair.save();
      res.json({message: 'Đăng ký sửa chữa thành công.'});
    } else {
      res.json({message: 'Đăng ký sửa chữa thất bại.'});
    }
  } catch (error) {
    console.log(error);
  }
}

const addComment = async(req, res) => {
  const { rating, reviewText, reviewImage, product_id, user_id } = req.body;
  let newComment = await Comment(
    {
      number_star: rating,
      user_id: user_id,
      product_id: product_id,
      comment_text: reviewText,
      image: reviewImage
    }
  );
  try {
    if(!newComment) {
      res.json({error: 'Bình luận không thành công'})
    } else {
      await newComment.save();
      res.json({message: 'Gửi bình luận thành công.'})
    }
  } catch (error) {
    console.log(error);
  }
}

const handleLike = async(req,res ) => {
  const { id, user_id } = req.query;
  const comment = await Comment.findById(id)
  try {
    const userIndex = comment.like.indexOf(user_id);
    if (userIndex === -1) {
      comment.like.push(user_id);
    } else {
      comment.like.splice(userIndex, 1);
    }
    res.json({updatedLikeCount : comment.like.length})
    await comment.save();
  } catch (error) {
    console.log(error);
  }
}

const handleReplyComment = async(req, res) => {
  const { id, user_id, content } = req.query;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    const newReply = {
      user_id: user_id, 
      content: content  
    };
    comment.reply.push(newReply);
    await comment.save();
    return res.status(200).json({replyComment: comment.reply, message: 'Reply added successfully' });
  } catch (error) {
    console.log(error);
  }
}

const handlePayPal = async(req, res) => {
  const { id } = req.query;
  try {
    const updatedCart = await Cart.findByIdAndUpdate(id, { order: true, status: 'Đang giao', pay: 'Đã thanh toán' }, { new: true });
    await updatedCart.save();
    return res.json({message: 'Đã thanh toán thành công'});
  } catch (error) {
    console.error('Error updating cart status:', error);
    throw error;
  }
}
module.exports = {
    handlePayPal,
    handleReplyComment,
    handleLike,
    getComments,
    addComment,
    addProduct,
    addUser,
    getProducts,
    getDetail,
    getProductById,
    addToCart,
    login,
    register,
    getCartWithIdUser,
    deleteProduct,
    getPay,
    addAddressWithIdUser,
    getAddressUserById,
    updateAddress,
    orderCart,
    getOrder,
    getDetailOrder,
    updateMyFile,
    getOnlyAddressOfUserById,
    deleteAddress,
    updatePass,
    getProductWithKeySearch,
    addContact,
    addRepair,
    getNotification,
    getNotificationByID

}