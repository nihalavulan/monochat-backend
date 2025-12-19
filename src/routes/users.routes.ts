import express from 'express';
import { getUserDetails, searchWithUsername } from '../controllers/user.controller';



const router = express.Router();


router.get('/' , (req,res) => {
    res.status(200).json({ message: 'Users API' });
});

router.get('/search' ,  searchWithUsername);
router.get('/:id' , getUserDetails)


export default router