import express from 'express';
import { searchWithUsername } from '../controllers/user.controller';



const router = express.Router();


router.get('/' , (req,res) => {
    res.status(200).json({ message: 'Users API' });
});

router.get('/search' ,  searchWithUsername);



export default router