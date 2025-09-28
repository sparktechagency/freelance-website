import { createServer, Server } from 'http';
import mongoose from 'mongoose';
import app, { allowedOrigins } from './app';
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
    // const io: SocketIOServer = new SocketIOServer(server, {
    //   cors: {
    //     origin: [
    //       'http://10.10.7.109:3000',
    //       'http://10.10.7.33:3000',
    //       'http://10.10.7.33:3001',
    //       'http://82.165.134.157:3000',
    //       'http://82.165.134.157:3001',
    //       'http://localhost:3000',
    //     ],
    //     credentials: true,
    //     methods: ['GET', 'POST'],
    //     allowedHeaders: [
    //       'Content-Type',
    //       'Authorization',
    //       'X-Requested-With',
    //       'Cookie',
    //       'Set-Cookie',
    //     ],
    //   },
    // });

    const io: SocketIOServer = new SocketIOServer(server, {
      cors: {
        origin: (origin, callback) => {
          const allowedOrigins = [
            'http://10.10.7.109:3000',
            'http://10.10.7.33:3000',
            'http://10.10.7.33:3001',
            'http://82.165.134.157:3000',
            'http://82.165.134.157:3001',
            'http://localhost:3000',
          ];

          console.log('🔵 Socket.IO Origin Check:', origin);

          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
            console.log('🟢 Socket.IO Origin Allowed:', origin);
          } else {
            callback(new Error('Not allowed by CORS'));
            console.log('🔴 Socket.IO Origin Denied:', origin);
          }
        },
        credentials: true,
        methods: ['GET', 'POST'],
      },
      allowEIO3: true,
      transports: ['websocket', 'polling'],
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
