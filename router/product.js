import express from "express";

import { showProduct, addProduct, updateProduct, deleteProduct, productID, search } from "../controller/product.js";

const router = express.Router();

router.get('/show', showProduct);
router.get('/showProductDetail/:id', productID);
router.post('/add', addProduct);
router.delete('/delete/:id', deleteProduct);
router.patch('/update/:id', updateProduct);
router.get('/search', search);

export default router;