import {user,protect,error,transaction} from '../lib/service.mjs';
import {banInput,isAdmin} from '../lib/moderation.mjs';
export default async function handler(req,res){try{
  protect(req,res);const u=await user(req);
  const result=await transaction(async c=>{
    if(!await isAdmin(c,u.id))throw Object.assign(new Error('Доступ только для разработчика.'),{status:403});
    if(req.method==='POST'){
      const b=typeof req.body==='string'?JSON.parse(req.body):req.body;
      const target=(await c.query('SELECT id FROM "user" WHERE id=$1 FOR UPDATE',[b.userId])).rows[0];
      if(!target||await isAdmin(c,target.id))throw Object.assign(new Error('Этот аккаунт нельзя заблокировать.'),{status:400});
      if(b.action==='ban'){
        const {reason,minutes}=banInput(b);
        await c.query('UPDATE bans SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL',[target.id]);
        await c.query("INSERT INTO bans(user_id,developer_id,reason,expires_at) VALUES($1,$2,$3,CASE WHEN $4::integer IS NULL THEN NULL ELSE now()+$4::integer*interval '1 minute' END)",[target.id,u.id,reason,minutes]);
      }else if(b.action==='unban'){
        await c.query('UPDATE bans SET revoked_at=now(),revoked_by=$2 WHERE user_id=$1 AND revoked_at IS NULL',[target.id,u.id]);
      }else throw Object.assign(new Error('Недопустимое действие.'),{status:400});
    }
    const players=(await c.query(`SELECT u.id,u.name,u.email,p.state->>'level' AS level,
      EXISTS(SELECT 1 FROM developers d WHERE d.user_id=u.id) AS developer,
      (SELECT row_to_json(b) FROM bans b WHERE b.user_id=u.id AND b.revoked_at IS NULL AND (b.expires_at IS NULL OR b.expires_at>now()) ORDER BY b.created_at DESC LIMIT 1) AS ban
      FROM "user" u LEFT JOIN progress p ON p.user_id=u.id ORDER BY u.name,u.id`)).rows;
    const incidents=(await c.query(`SELECT a.id,a.user_id,u.name,u.email,a.started_at,a.ended_at,
      floor(extract(epoch FROM (coalesce(a.ended_at,now())-a.started_at)))::integer AS seconds
      FROM absences a JOIN "user" u ON u.id=a.user_id
      WHERE coalesce(a.ended_at,now())-a.started_at>=interval '2 minutes'
      ORDER BY a.started_at DESC LIMIT 200`)).rows;
    const history=(await c.query('SELECT b.*,u.name FROM bans b JOIN "user" u ON u.id=b.user_id ORDER BY b.created_at DESC LIMIT 100')).rows;
    return {players,incidents,history};
  });res.json(result);
}catch(e){error(res,e)}}
