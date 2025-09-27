import { createServer, Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import socketIO from './socketio';
import { Server as SocketIOServer } from 'socket.io'; 
import colors from 'colors';
import config from './app/config';
import { createSuperAdmin } from './app/DB';

let server: Server;

async function main() {
  try {

   
    await mongoose.connect(config.database_url as string);
    
    server = createServer(app);
    const io: SocketIOServer = new SocketIOServer(server, {
      cors: {
        origin: '*',
      },
    });

    server.listen(Number(config.port), () => {
      console.log(
        colors.green(
          `Server (HTTP + Socket.IO) is running on ${config.ip}:${config.port}`,
        ).bold,
      );
    });
    await createSuperAdmin();

    socketIO(io);

    global.io = io;
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled rejection detected: ${err}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught exception detected: ${err}`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
