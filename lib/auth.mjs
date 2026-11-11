import {betterAuth} from 'better-auth';
import pg from 'pg';
import {APIError} from 'better-auth/api';
import {ADMIN_EMAIL} from './moderation.mjs';
let instance,pool;
export function getPool(){if(!process.env.DATABASE_URL)throw new Error('DATABASE_NOT_CONFIGURED');return pool??=new pg.Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:10000,idleTimeoutMillis:10000});}
export function getAuth(){if(!process.env.BETTER_AUTH_SECRET)throw new Error('AUTH_NOT_CONFIGURED');return instance??=betterAuth({database:getPool(),secret:process.env.BETTER_AUTH_SECRET,baseURL:process.env.BETTER_AUTH_URL,databaseHooks:{user:{create:{before:async(u)=>{if(u.email.trim().toLowerCase()===ADMIN_EMAIL)throw new APIError('FORBIDDEN',{message:'Этот адрес зарезервирован для разработчика.'});return {data:u};}}}},socialProviders:{...(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET?{google:{clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET}}:{}),...(process.env.APPLE_CLIENT_ID&&process.env.APPLE_CLIENT_SECRET?{apple:{clientId:process.env.APPLE_CLIENT_ID,clientSecret:process.env.APPLE_CLIENT_SECRET}}:{})},emailAndPassword:{enabled:true,requireEmailVerification:false,minPasswordLength:10,maxPasswordLength:128},rateLimit:{enabled:true,storage:'database',window:60,max:30},session:{expiresIn:60*60*24*30,updateAge:60*60*24}});}
