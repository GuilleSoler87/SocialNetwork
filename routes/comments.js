const express = require('express');
const router = express.Router()
const upload = require('../middlewares/multer'); 
const CommentController = require('../controllers/CommentController');
const { authentication, isAuthorCom } = require("../middlewares/authentication");

router.post('/create/:_id',authentication, upload.single('img'),CommentController.create)
router.get('/getAll',authentication, CommentController.getAll)
router.put('/update/:_id',authentication, isAuthorCom, upload.single('img'), CommentController.update)
router.delete('/delete/:_id',authentication, isAuthorCom, CommentController.delete)
router.put('/likes/:_id', authentication, CommentController.like);
router.put('/unlike/:_id', authentication, CommentController.unlike);




module.exports = router;