import http from 'http';
import app from './app';
import { setupSocket } from './socket';
import dotenv from 'dotenv';
import { connectDB } from './db';


dotenv.config()

const server = http.createServer(app);
setupSocket(server);

connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});