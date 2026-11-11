import {user,protect,error,transaction} from '../lib/service.mjs';
import {checkBan,absenceStage} from '../lib/moderation.mjs';
export default async function handler(req,res){try{
  protect(req,res);const u=await user(req);
  if(req.method!=='POST')return res.status(405).end();
  const b=typeof req.body==='string'?JSON.parse(req.body):req.body;
  if(!['away','back','check'].includes(b.action))throw Object.assign(new Error('Недопустимое действие.'),{status:400});
  const result=await transaction(async c=>{
    await checkBan(c,u.id);
    await c.query('SELECT id FROM "user" WHERE id=$1 FOR UPDATE',[u.id]);
    const progress=(await c.query('SELECT state FROM progress WHERE user_id=$1',[u.id])).rows[0];
    if(b.action==='away'&&progress?.state.status==='playing')await c.query('INSERT INTO absences(user_id) VALUES($1) ON CONFLICT (user_id) WHERE ended_at IS NULL DO NOTHING',[u.id]);
    const a=(await c.query('SELECT id,extract(epoch FROM (now()-started_at))*1000 AS elapsed FROM absences WHERE user_id=$1 AND ended_at IS NULL',[u.id])).rows[0];
    if(b.action==='back')await c.query('UPDATE absences SET ended_at=now() WHERE user_id=$1 AND ended_at IS NULL',[u.id]);
    return {elapsed:Number(a?.elapsed||0),stage:a?absenceStage(Number(a.elapsed)):'active'};
  });res.json(result);
}catch(e){error(res,e)}}
