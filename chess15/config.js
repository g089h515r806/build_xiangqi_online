import {fileURLToPath} from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);


export const port = process.env.PORT || 3000;
//export const mongodbUri = 'mongodb://admin:password@127.0.0.1:27017/chess?authSource=admin';
export const mongodbUri = 'mongodb://127.0.0.1:27017/chess';
export const jwtSecret = 'YourSecretKey123'; //change it
export const rootDir = dirname;
export const baseApi = 'api';
export const chessEnginePath = 'D:\\nodejs\\chess\\chess_engine\\gg\\';

