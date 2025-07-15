// import { createClient } from 'redis';

// const redisClient =  createClient({
//   url: 'redis://localhost:6666',
// });

// redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

// (async () => {
//   try {
//     await redisClient.connect(); // ✅ required to initialize the connection
//     console.log('✅ Redis connected');
//   } catch (err) {
//     console.error('Failed to connect to Redis:', err);
//   }
// })();

// export default redisClient;
