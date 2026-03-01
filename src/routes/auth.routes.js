import {Router} from 'express';
import {register, login, logout} from '../controllers/user.controllers.js';
import authorizeUser from '../middlewares/auth.middlewares.js';

const router = Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(authorizeUser, logout);

export default router;