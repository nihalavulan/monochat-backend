import express from 'express';
import { loginUser, registerUser, verifyUser } from '../controllers/auth.controller';


const router = express.Router();


router.get('/' , (req,res) => {
    res.status(200).json({ message: 'Auth API' });
});

router.post('/register' ,  registerUser);
router.get('/verify' ,  verifyUser);
router.post('/login' ,  loginUser);



export default router