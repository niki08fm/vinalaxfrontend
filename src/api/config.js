// Base URL of the website backend (vinalaxbackend).
// Production: "/site-api" on this same domain — vercel.json forwards it to the
// backend on AWS EC2. Local dev: set VITE_API_BASE_URL=http://localhost:5002/api
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/site-api').replace(/\/$/, '');
