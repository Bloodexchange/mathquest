import {test} from 'node:test';
import assert from 'node:assert/strict';
import {banInput,absenceStage,checkBan,isAdmin} from '../lib/moderation.mjs';
test('warning and report use exact thresholds',()=>{
 assert.equal(absenceStage(119999),'away');assert.equal(absenceStage(120000),'warning');assert.equal(absenceStage(179999),'warning');assert.equal(absenceStage(180000),'reported');
});
test('ban duration and reason are validated on the server',()=>{
 for(const minutes of [20,21,60,1440,null])assert.deepEqual(banInput({reason:' Проверка ',minutes}),{reason:'Проверка',minutes});
 for(const minutes of [0,19,1441,-1,20.5,'20',undefined])assert.throws(()=>banInput({reason:'Причина',minutes}),{status:400});
 for(const reason of ['', '  ', 'x'.repeat(501),null])assert.throws(()=>banInput({reason,minutes:20}),{status:400});
});
test('only database role grants developer permissions',async()=>{
 assert.equal(await isAdmin({query:async()=>({rows:[]})},'ordinary-user'),false);
 assert.equal(await isAdmin({query:async()=>({rows:[{user_id:'admin'}]})},'admin'),true);
});
test('active bans reject game access and expose the reason',async()=>{
 await assert.rejects(checkBan({query:async()=>({rows:[{reason:'Нарушение правил',expires_at:null}]})},'player'),e=>e.status===403&&e.message.includes('Нарушение правил')&&e.message.includes('навсегда'));
 await checkBan({query:async()=>({rows:[]})},'player');
});
