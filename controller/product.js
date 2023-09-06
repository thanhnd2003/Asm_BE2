import Product from "../model/product.js";

const showProduct = async (req, res) => {
  const products = await Product.find();
  return res.json(products);
};

const search = async (req, res) => {
  const searchTerm = req.query.name;
  const product = await Product.find({ name: new RegExp(searchTerm, 'i') });
  return res.json(product)
};


const addProduct = async (req, res) => {
  const { name, price, img, cate, desc } = req.body;

  if (!name || !price || !img || !cate || !desc) {
    return res.json({
      success: false,
      message: "Khong duoc bo trong cac truong",
    });
  }
  if (name.length < 6) {
    return res.json({
      success: false,
      message: "Ten San Pham Phai > 6 ki tu",
    });
  }
  if (price == 0) {
    return res.json({
      success: false,
      message: "Gia San Pham Phai > 0",
    });
  }
  const product = await Product.create(req.body);

  return res.status(200).json({
    success: true,
    message: "Thêm sản phẩm thành công",
    product,
  });
};

const productID = async (req, res) => {
  const product = await Product.findById(req.params.id);

  return res.json(product);
};

const updateProduct = async (req, res) => {
  const oldProduct = await Product.findById(req.params.id);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (
    oldProduct.name == product.name &&
    oldProduct.price == product.price &&
    oldProduct.img == product.img &&
    oldProduct.desc == product.desc &&
    oldProduct.cate == product.cate
  ) {
    return res.json({
      success: false,
      message: "Phai Thay Doi It Nhat Mot Truong",
    });
  }

  if (
    !product.name ||
    !product.price ||
    !product.img ||
    !product.cate ||
    !product.desc
  ) {
    return res.json({
      success: false,
      message: "Khong duoc bo trong cac truong",
    });
  }
  if (product.name.length < 6) {
    return res.json({
      success: false,
      message: "Ten San Pham Phai > 6 ki tu",
    });
  }
  if (product.price == 0) {
    return res.json({
      success: false,
      message: "Gia San Pham Phai > 0",
    });
  }

  return res.json({
    success: true,
    message: "Cập nhật sản phẩm thành công",
    data: product,
  });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  return res.json({
    message: "Xóa sản phẩm thành công",
    product,
  });
};

export { showProduct, addProduct, productID, updateProduct, deleteProduct, search}
