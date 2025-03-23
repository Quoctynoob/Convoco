import { GoogleGenerativeAI } from '@google/generative-ai';

// Use environment variable for API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize the API client
export const genAI = new GoogleGenerativeAI(API_KEY || '');

// Create a model instance with gemini-pro
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro" });