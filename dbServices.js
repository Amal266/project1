import mongoose from "mongoose";
import { User, Product,buyersInfo} from "./dbSchemas.js";

async function insertUser(username, email, password, verificationCode) {
    let newUser;
    try {
        newUser = await User.create({ username, email, password, verificationCode });
    } catch (error) {
        console.error(error);
    }

    return newUser;
};
// *****************
async function insertProduct(title,price,deposit,category,desc,images,phone,city){
    let newProduct;
    try {
        newProduct = await Product.create({title,price,deposit,category,desc,images,phone,city });
    } catch (error) {
        console.error(error);
    }

    return newProduct;
};
async function getUser(email, password) {
    return await User.findOne({ email, password });
};

async function getAllProducts(limit, id, category) {
    const exp = {
        ...id ? { _id: { $ne: id } } : {},
        ...category ? { category: category } : {}
    };
    
    const products = await Product.find(exp).limit(limit || 100);

    return products;
};


async function getProduct(productId) {
    return mongoose.Types.ObjectId.isValid(productId) ? await Product.findById(productId) : null;
}

async function getUserByEmail(email) {
    return await User.findOne({ email });
}

async function verifyUser(email) {
    return await User.updateOne({ email }, { verified: true });
}
async function insertbuyers(first_name,last_name,city,line_address1,Phone_number,email,delivery_method,payment_method) {
    let newbuyer;
    try {
        newbuyer = await buyersInfo.create({first_name,last_name,city,line_address1,Phone_number,email,delivery_method,payment_method});
    } catch (error) {
        console.error(error);
    }

    return newbuyer;
};

async function getBuyer() {
    try {
        const buyer = await buyersInfo.findOne().sort({ _id: -1 }).limit(1);
        return buyer;
    } catch (error) {
        console.error('Error fetching buyer:', error);
        return null;
    }
}


export {
    getProduct,
    getAllProducts,
    insertUser,
    getUser,
    getBuyer,
    insertbuyers,
    verifyUser,
    getUserByEmail,
    insertProduct,
}