import {toNodeHandler} from 'better-auth/node';
import {getAuth} from '../lib/auth.mjs';
export const config={api:{bodyParser:false}};
export default async function handler(req,res){try{await toNodeHandler(getAuth())(req,res);}catch{res.status(503).json({message:'Аккаунты ещё настраиваются. Попробуйте позже.'});}}
