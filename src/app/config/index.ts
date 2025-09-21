import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join((process.cwd(), '.env')) });

const aws = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.S3_BUCKET_NAME,
};

const stripe = {
  stripe_api_key: process.env.STRIPE_API_KEY,
  stripe_api_secret: process.env.STRIPE_API_SECRET,
  stripe_payment_success_url: process.env.SUCCESS_URL,
  stripe_payment_cancel_url: process.env.CANCEL_URL,
};
const ai_info = {
  ai_gemini_token: process.env.AI_GEMINI_TOKEN,
};

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  ip: process.env.IP,
  frontend_ip_address: process.env.FRONTEND_IP_ADDRESS,
  database_url: process.env.DATABASE_URL,
  server_url: process.env.SERVER_URL,
  client_Url: process.env.CLIENT_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  nodemailer_host_email: process.env.NODEMAILER_HOST_EMAIL,
  nodemailer_host_pass: process.env.NODEMAILER_HOST_PASS,
  otp_expire_time: process.env.OTP_EXPIRE_TIME,
  otp_token_expire_time: process.env.OTP_TOKEN_EXPIRE_TIME,
  socket_port: process.env.SOCKET_PORT,
  stripe_secret: process.env.STRIPE_API_SECRET,
  // stripe_key: process.env.STRIPE_API_KEY,
  WEBHOOK: process.env.WEBHOOK || '',
  RENEWAL_WEBHOOK: process.env.RENEWAL_WEBHOOK || '',
  aws,
  stripe,
  googleApiKey: process.env.GOOGLEAPI,
  shipment_key: process.env.SHIPMENT_KEY,
  PAYPAL_MODE: process.env.PAYPAL_MODE,
  hospitable_api_url: process.env.HOSPITABLE_API_URL,
  hospitable_api_key: process.env.HOSPITABLE_API_KEY,
  // user_jwt_token: process.env.USER_JWT_TOKEN,
  ai_info,
};
