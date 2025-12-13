import http from 'http';
import app from './app';
import { setupSocket } from './socket';
import dotenv from 'dotenv';
import { connectDB } from './db';
import router from './routes';


dotenv.config()

const server = http.createServer(app);
setupSocket(server);

connectDB();


app.use('/api/v1' , router)


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port link : http://localhost:${PORT}`);
});