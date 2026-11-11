import {fromNodeHeaders} from 'better-auth/node';
import {getAuth,getPool} from './auth.mjs';
import {checkBan} from './moderation.mjs';
export async function user(req){const s=await getAuth().api.getSession({headers:fromNodeHeaders(req.headers)});if(!s)throw Object.assign(new Error('Войдите в аккаунт'),{status:401});await checkBan(getPool(),s.user.id);return s.user;}
export function protect(req,res){res.setHeader('Cache-Control','no-store');if(req.method==='POST'){const origin=req.headers.origin;const expected=process.env.BETTER_AUTH_URL;if(!origin||!expected||new URL(origin).origin!==new URL(expected).origin)throw Object.assign(new Error('Недопустимый источник запроса'),{status:403});}if(!['GET','POST'].includes(req.method))throw Object.assign(new Error('Метод не поддерживается'),{status:405});}
export function error(res,e){const status=e.status||503;res.status(status).json({error:e.status?e.message:'Сервис временно недоступен. Прогресс не потерян; попробуйте ещё раз.'});}
export async function transaction(fn){const c=await getPool().connect();try{await c.query('BEGIN');const r=await fn(c);await c.query('COMMIT');return r;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}
