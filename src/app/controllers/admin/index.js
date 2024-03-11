const Cart = require('../../models/cart');
const {User, Address} = require('../../models/user');
const Product = require('../../models/product');
const Comment = require('../../models/comment');
const Delivery = require('../../models/delivery_address');
const Notification = require('../../models/notification');
const Repair = require('../../models/repair');
const Contact = require('../../models/contacts');
const nodemailer = require("nodemailer");

const getAccountAdmin = async(req, res, next) => {
    const {adminId} = req.query;
    await User.findById(adminId)
        .then(admin => res.json(admin))
        .catch(next);
}
const getUserExceptAdmin = async (req, res, next) => {
    const {adminId} = req.query;
    await User.find({_id: {$ne: adminId}})
        .then(users => res.json(users))
        .catch(next);
}

const getContacts = async(req, res, next) => {
    try {
        const contacts = await Contact.find({});
        if(contacts) {
            return res.json(contacts);
        } else {
            return res.json({message: 'Không tìm thấy liên hệ nào'});
        }
    } catch (error) {
        console.log(error);
    }
}

const getRepairs = async(req, res, next) => {
    try {
        await Repair.find({})
            .then(repairs => res.json(repairs))
            .catch(next);
    } catch (error) {   
        console.log(error);
    }
}

const getOrderById = async(req, res, next) => {
    const {id} = req.query;
    try {
        await Cart.findById(id)
            .populate('user_id')
            .populate('item.id_product')
            .then(order => res.json(order))
            .catch(next);
    } catch (error) {
        console.log(error);
    }
}

const deleteOrderByID = async (req, res) => {
    const idOrders  = req.body.idOrders;
    try {
        await Cart.deleteMany({ _id: { $in: idOrders } });
        res.status(200).json({ message: 'Xóa đơn hàng thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đơn hàng' });
    }
}

const deleteContactById = async (req, res) => {
    const id = req.query.id;

    try {
        await Contact.findByIdAndDelete(id);
        res.status(200).json({ message: 'Xóa liên hệ thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đơn hàng' });
    }
}
const addUser = async(req, res) => {
    const {name, email, roles, password} = req.body;

    const newUser = new User({
        id: 1,
        roles: roles,
        name: name,
        avatar:'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg',
        email: email,
        password: password,
    });
    try {
        const checkUser = await User.findOne({email : email});
        if(checkUser) {
          res.json({notification: 'Email đã được đăng ký!'});
        } else if (password.length < 8 ) {
          res.json({notification: 'Mật khẩu tối thiểu 8 ký tự!'})
        }  else {
          res.json({success: "Thêm mới thành công."})
          await newUser.save();
        }
      } catch (error) {
        console.log(error);
      }
}

const updateInfoUser = async(req, res) => {
    const {name, email, roles, password, id} = req.body;
    
    try {
        const user = await User.findById(id); 
    
        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }
        if (roles) {
            user.roles = roles;
        }
        if (password) {
            user.password = password;
        }
        await user.save();
    
        return res.status(200).json({ message: "Thông tin người dùng được cập nhật thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi cập nhật thông tin người dùng", error: error.message });
    }
}

const deleteUser = async(req, res, next) => {
    const {id} = req.query;
    await User.findByIdAndDelete(id)
        .then(() => 
            res.status(200).json({ message: `Xóa người dùng có id: ${id} thành công` }))
        .catch(next);
}

const deleteAllChecked = async(req, res, next) => {
    const {checked} = req.query;
    console.log(checked);
    // try {
    //     for (const id of checked) {
    //       await User.deleteOne({ _id: id });
    //     }
    //     console.log({ message: 'Xóa thành công' });
    //     res.status(200).json({ message: 'Xóa thành công' });
    //   } catch (error) {
    //     console.log(error);
    //     res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: error.message });
    //   }
}

const deleteCart = async(req, res) => {
    const { id } = req.query;
    try {
        if(!id) {
            res.json({message: 'Không tìm thấy id đơn hàng.'});
        } else {
            await Cart.findByIdAndDelete(id)
                .then(() => res.json({message: 'Xóa đơn hàng thành công'}));
        }
    } catch (error) {
        console.log(error);
    }
}

const getAllOrders = async(req, res, next) => {
    const { value } = req.query;

    try {
        
        if(value == 'Chờ duyệt') {
            await Cart.find({order: true, status: 'Chờ duyệt'})
                .populate('item.id_product')
                .then(orders => res.json(orders))
                .catch(next);
        } else if(value == 'Đã duyệt') {
            await Cart.find({order: true, status: 'Đang giao'})
                .populate('item.id_product')
                .then(orders => res.json(orders))
                .catch(next);
        } else if ( value == 'Đã giao' ) { 
            await Cart.find({order: true, status: 'Đã giao'})
                .populate('item.id_product')
                .then(orders => res.json(orders))
                .catch(next);
        } else {
            await Cart.find({order: true})
            .populate('item.id_product')
            .then(orders => res.json(orders))
            .catch(next);
        }
    } catch (error) {
        console.log(error);
    }
}

const processOrder = async (req, res) => {
    const {id_cart} = req.query;
    try {
        const updatedCart = await Cart.updateOne(
            {_id: id_cart},
            { $set: { status: 'Đã duyệt' }},
        );
        if (!updatedCart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        } else {
            res.json({ message: 'Đã duyệt đơn hàng thành công' });
        }
        
    } catch (error) {   
        console.log(error);
    }
}

const addProduct = async(req, res, next) => {
    const { product } = req.body;
    try {
        const newProduct = await Product(product);
        if(!product) {
            return res.json({error: 'Lỗi, thêm sản phẩm mới thất bại.'})
        } else {
            await newProduct.save();
            return res.json({message: 'Thêm sản phẩm mới thành công.'})
        }
    } catch (error) {
        console.log(error);
    }
}

const processRepair = async (req, res) => {
    const {id} = req.query;
    try {
        const updatedRepair = await Repair.updateOne(
            {_id: id},
            { $set: { status: 'Đã duyệt' }},
        );
        if (!updatedRepair) {
            return res.status(404).json({ message: 'Không tìm thấy đơn sửa chữa' });
        } else {
            res.json({ message: 'Đã duyệt đơn hàng thành công' });
        }
        
    } catch (error) {   
        console.log(error);
    }
}

const deleteOrder = async (id_order, res) => {
    try {
      if (!id_order) {
        return res.json({ message: 'Không tìm thấy id đơn hàng.' });
      } else {
        await Cart.findByIdAndDelete(id_order);
        res.json({ message: 'Xóa đơn hàng thành công' }); // Gửi phản hồi sau khi thực hiện xong xóa đơn hàng
      }
    } catch (error) {
      console.log(error);
      res.json({ message: 'Có lỗi xảy ra khi xóa đơn hàng.' }); // Gửi phản hồi trong trường hợp lỗi
    }
  }

const addNotification = async(id_user) => {
    try {
        const newNotification = await Notification(
            {
                title: 'Xác nhận đã nhận đơn hàng.',
                user_id: id_user,
                message: 'Chào bạn! Chúng tôi rất vui thông báo rằng đơn hàng của bạn đã được nhận thành công. Cảm ơn bạn đã tin tưởng và mua hàng từ chúng tôi!Trân trọng, Cửa hàng chúng tôi",'
            }
        )
        await newNotification.save();
    } catch (error) {
        console.log(error);
    }
}

const sendEmail = async (req, res) => {
    const {id, id_order} = req.query;
    const checkUser = await User.findOne({ _id: id });
    const emailUser = checkUser.email;
    console.log(id_order);
    console.log(emailUser);
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "rak949427@gmail.com",
            pass: "bkeo sicd aqiu jhrx",
        },
    });
  
    let mailOptions = {
        from: "rak949427@gmail.com",
        to: `${emailUser}`,
        subject: "🌟 Xác nhận, nhận đơn hàng thành công 🌟",
        html: "<h1>Chào bạn!</h1><p>Chúng tôi rất vui thông báo rằng đơn hàng của bạn đã được nhận thành công.</p><p>Cảm ơn bạn đã tin tưởng và mua hàng từ chúng tôi!</p><p><b>Trân trọng,</b><br />Cửa hàng chúng tôi</p>",
    };
    await deleteOrder(id_order, res);
    await addNotification(req.query.id);
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        res.json({message: 'Gửi thành công'});
        await deleteOrder(id_order, res);
        await addNotification(req.query.id);
    } catch (error) {
        console.error("Lỗi khi gửi email xác nhận: " + error);
        return "Có lỗi xảy ra khi gửi email xác nhận.";
    }
};

module.exports = {
    deleteContactById,
    deleteOrderByID,
    getOrderById,
    getAccountAdmin,
    getUserExceptAdmin,
    addUser,
    updateInfoUser,
    deleteUser,
    deleteAllChecked,
    deleteCart,
    getAllOrders,
    getContacts,
    processOrder,
    getRepairs,
    processRepair,
    sendEmail,
    addProduct
}