// const mangopay = require('mangopay2-nodejs-sdk');
import mangopay from 'mangopay2-nodejs-sdk';

const paymentApi = new mangopay({
  clientId: 'your-mangopay-client-id',
  clientApiKey: 'your-mangopay-api-key',
  baseUrl: 'https://api.sandbox.mangopay.com',
});





// Step 6: API Calls Required

// User API: For managing users (clients, freelancers, admins).

// POST /users: Create users.

// GET /users/{userId}/cards: Get cards for a user.

// Card API: For handling card details.

// POST /users/{userId}/cards: Add cards for users.

// GET /users/{userId}/cards: List cards for a user.

// Pay-in API: For handling payments.

// POST /payins/card/direct: Direct card payment for the client.

// Transfer API: For transferring money between users.

// POST /transfers: Move funds from one user to another (client to admin, admin to freelancer).
