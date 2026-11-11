import {randomInt} from 'node:crypto';
import {topics,initial,publicState,advance,parseAnswer} from '../lib/questions.mjs';
import {user,protect,error,transaction} from '../lib/service.mjs';
import {isAdmin,checkBan} from '../lib/moderation.mjs';
export default async function handler(req,res){try{protect(req,res);const u=await user(req);const result=await transaction(async c=>{
 await c.query('SELECT id FROM "user" WHERE id=$1 FOR UPDATE',[u.id]);
 await checkBan(c,u.id);
 await c.query('INSERT INTO progress(user_id,state) VALUES ($1,$2) ON CONFLICT DO NOTHING',[u.id,initial(randomInt(1000000))]);
 const row=(await c.query('SELECT state FROM progress WHERE user_id=$1 FOR UPDATE',[u.id])).rows[0];let s=row.state;
 if(req.method==='POST'){
 const b=typeof req.body==='string'?JSON.parse(req.body):req.body;
 if(b.version!==s.version)throw Object.assign(new Error('Прогресс изменился в другой вкладке. Обновите страницу.'),{status:409});
 if(b.action==='restart')s={...initial(randomInt(1000000)),version:s.version+1};
 else if(b.action==='select'&&Number.isInteger(b.level)&&b.level>=1&&b.level<=35)s={...initial(randomInt(1000000)),level:b.level,completed:s.completed||[],scores:s.scores||{},points:Object.values(s.scores||{}).reduce((a,b)=>a+b,0),version:s.version+1};
 else if(b.action==='next'&&s.status==='passed')s={...s,level:Array.from({length:35},(_,i)=>(s.level+i)%35+1).find(l=>!(s.completed||[]).includes(l))||s.level,index:0,correct:0,mistakes:0,status:'playing',last:null,version:s.version+1};
 else if(b.action==='answer'&&s.status==='playing'){
 if(b.questionId!==publicState(s).question.id||!Number.isFinite(parseAnswer(b.answer)))throw Object.assign(new Error('Введите число или дробь, например 3/4.'),{status:400});
 s=advance(s,b.answer);
 if(s.status==='won')await c.query('INSERT INTO diplomas(user_id,name,points) VALUES($1,$2,$3) ON CONFLICT(user_id) DO UPDATE SET name=$2,points=$3,awarded_at=now()',[u.id,u.name,s.points]);
 }else throw Object.assign(new Error('Недопустимое действие'),{status:400});
 await c.query('UPDATE progress SET state=$2,updated_at=now() WHERE user_id=$1',[u.id,s]);
 }
 return {state:publicState(s),topics,user:{name:u.name,developer:await isAdmin(c,u.id)},diploma:(await c.query('SELECT name,points,awarded_at FROM diplomas WHERE user_id=$1',[u.id])).rows[0]||null};
 });res.json(result);}catch(e){error(res,e);}}
