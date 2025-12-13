import express from 'express';
import authRoutes from './auth.routes'

const router = express.Router();


router.get('/' , (req,res) => {
    res.status(200).json({ message: 'Welcome to MonoChat API' });
});


router.use('/auth' , authRoutes);

export default router;