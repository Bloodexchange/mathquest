import {randomUUID} from 'node:crypto';
import {hashPassword} from 'better-auth/crypto';
import {getPool} from '../lib/auth.mjs';
import {ADMIN_EMAIL} from '../lib/moderation.mjs';
// Run only on the server, after migrations. Never expose this password to public assets.
const password=process.env.DEVELOPER_INITIAL_PASSWORD;
if(!password||password.length<10)throw new Error('Set DEVELOPER_INITIAL_PASSWORD (at least 10 characters) in the server environment.');
const hash=await hashPassword(password),pool=getPool(),c=await pool.connect();
try{
  await c.query('BEGIN');
  await c.query("SELECT pg_advisory_xact_lock(91827364)");
  let u=(await c.query('SELECT id FROM "user" WHERE lower(email)=$1',[ADMIN_EMAIL])).rows[0];
  if(u){
    if(!(await c.query('SELECT user_id FROM developers WHERE user_id=$1',[u.id])).rows[0])throw new Error('Email already exists without developer role. Review ownership manually before provisioning.');
    throw new Error('Developer already configured. Use the account recovery process to change its password.');
  }
  u={id:randomUUID()};
  await c.query('INSERT INTO "user"(id,name,email,"emailVerified","createdAt","updatedAt") VALUES($1,$2,$3,true,now(),now())',[u.id,'Разработчик',ADMIN_EMAIL]);
  await c.query('INSERT INTO account(id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES($1,$2,\'credential\',$2,$3,now(),now())',[randomUUID(),u.id,hash]);
  await c.query('INSERT INTO developers(user_id) VALUES($1)',[u.id]);
  await c.query('COMMIT');console.log('Developer account created.');
}catch(e){await c.query('ROLLBACK');throw e}finally{c.release();await pool.end()}
