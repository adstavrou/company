import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 1;
console.log(`🚀 Hello from app running on port ${port}`);
