const express = require('express');
const router = express.Router()
const upload = require('../middlewares/multer'); 
const PostController = require('../controllers/PostController');
const { authentication, isAuthor } = require("../middlewares/authentication");


router.post('/create', authentication, upload.single('img'), PostController.create)
router.put("/update/:_id", authentication, isAuthor, upload.single('img'), PostController.update);
router.delete("/delete/:_id", authentication, isAuthor, PostController.delete);
router.get("/getByTitle/:title", authentication, PostController.getByTitle);
router.get("/getById/:_id", authentication, PostController.getById);
router.get("/getInfo", PostController.getInfo);
router.put('/likes/:_id', authentication, PostController.like);
router.put('/unlike/:_id', authentication, PostController.unlike);



module.exports = router;