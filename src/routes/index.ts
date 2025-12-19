import express from 'express';
import authRoutes from './auth.routes'
import userRoutes from './users.routes'
import { authMiddleWare } from '../middlewares/auth.middleware';

const router = express.Router();


router.get('/' , (req,res) => {
    res.status(200).json({ message: 'Welcome to MonoChat API' });
});


router.get('/health' , (req,res) => {
    res.status(200).json({ message: 'Server is running' });
});

router.use('/auth' , authRoutes);
router.use('/users', authMiddleWare , userRoutes)



export default router;