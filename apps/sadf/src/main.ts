import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 4444;
console.log(`🚀 Hello from app running on port ${port}`);
