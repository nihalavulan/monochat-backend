import express from 'express';
import { registerUser } from '../controllers/auth.controller';


const router = express.Router();


router.get('/' , (req,res) => {
    res.status(200).json({ message: 'Auth API' });
});

router.post('/register' ,  registerUser);


export default router