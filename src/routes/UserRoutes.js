
import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';

router.get('/', (req, res) => {
    res.json({ data: req.user });
});
router.get('/search', UserController.searchUsers);

export default router;