const chapters=[
 ['🌱','Арифметика','Числа и основные действия',1,5],
 ['🍄','Дроби и проценты','Доли, отношения и делимость',6,10],
 ['🌳','Основы алгебры','От отрицательных чисел до неравенств',11,15],
 ['⛰️','Уравнения и функции','Системы, многочлены и прогрессии',16,20],
 ['🔭','Геометрия и вычисления','Фигуры, тригонометрия и комбинаторика',21,25],
 ['🪐','Вероятность и анализ','Данные, пределы и производные',26,30],
 ['✦','Высшая математика','Интегралы, матрицы и ряды',31,35]
];
export function setupCatalog({$,topics,view,api,toast,mutate,context}){
 const entry=document.createElement('button');entry.className='secondary';entry.textContent='Уровни ↗';entry.id='levelsButton';$('continue').after(entry);
 const dev=document.createElement('a');dev.href='/developer.html';dev.className='text-button';dev.textContent='Страница разработчика ↗';document.querySelector('footer').append(dev);
 const section=document.createElement('section');section.id='topicsScreen';section.hidden=true;
 section.innerHTML='<button class="text-button" id="topicsBack">← Главное меню</button><div class="eyebrow">ТВОЯ ЭКСПЕДИЦИЯ</div><h1>Выбери тему</h1><p class="lead">Иди своим путём. Каждый уровень — отдельная история.</p><div class="catalog-grid" id="topicCards"></div>';
 document.querySelector('main').append(section);
 const levels=document.createElement('section');levels.id='levelsScreen';levels.hidden=true;
 levels.innerHTML='<button class="text-button" id="levelsBack">← Все темы</button><div class="eyebrow">10 НЕЗАВИСИМЫХ ЗАДАНИЙ НА УРОВЕНЬ</div><h1 id="selectedTopic"></h1><p>Выбирай любой уровень. Лучший результат сохранится. При выборе другого уровня текущая попытка начнётся заново.</p><div class="catalog-grid" id="levelCards"></div>';
 document.querySelector('main').append(levels);
 const open=()=>view('topicsScreen');entry.onclick=open;$('mapButton').onclick=open;
 $('topicsBack').onclick=()=>view('home');$('levelsBack').onclick=open;
 chapters.forEach(([icon,name,description,first,last])=>{
   const button=document.createElement('button');button.className='catalog-card';
   const badge=document.createElement('span');badge.className='catalog-icon';badge.textContent=icon;
   const title=document.createElement('strong');title.textContent=name;
   const text=document.createElement('span');text.textContent=description;
   const count=document.createElement('small');count.textContent='5 уровней · Выбрать →';button.append(badge,title,text,count);
   button.onclick=()=>{
     $('selectedTopic').textContent=name;$('levelCards').replaceChildren();
     for(let level=first;level<=last;level++){
       const c=document.createElement('button');c.className='catalog-card';
       const n=document.createElement('span');n.className='catalog-icon';n.textContent=String(level).padStart(2,'0');
       const t=document.createElement('strong');t.textContent=topics[level-1];
       const status=document.createElement('small');const score=context().data?.state.scores?.[level];status.textContent=score?`✓ Пройдено · ${score}/100`:'10 заданий · Начать →';
       c.append(n,t,status);c.onclick=()=>{if(!context().user){$('authDialog').showModal();return;}mutate('select',{level});};$('levelCards').append(c);
     }view('levelsScreen');
   };$('topicCards').append(button);
 });
 const banner=document.createElement('div');banner.id='absenceWarning';banner.className='absence-warning';banner.setAttribute('role','alert');banner.hidden=true;document.body.append(banner);
 let away=false,started=0,queue=Promise.resolve(),timerBusy=false,lastSync=0,awaySent=false;
 const send=action=>{queue=queue.catch(()=>{}).then(()=>api('/api/presence',{action}));return queue;};
 const notice=stage=>{if(stage==='warning'||stage==='reported'){
   banner.textContent=stage==='warning'?'Вы отсутствуете более 2 минут. Вернитесь в игру: после 3 минут событие будет передано разработчику.':'Отсутствие более 3 минут передано разработчику. Решение о блокировке принимается вручную.';banner.hidden=false;
 }};
 const check=()=>{
   const {user,data}=context();if(!user)return;
   const active=!$('game').hidden&&data?.state.status==='playing';
   const missing=document.hidden||!document.hasFocus();
   if(active&&missing&&!away){away=true;started=Date.now();banner.hidden=true;awaySent=false;send('away').then(()=>{awaySent=true;}).catch(e=>toast('Не удалось отправить событие: '+e.message));}
   else if(away&&!missing){away=false;send('back').then(r=>{notice(r.stage);if(r.stage==='away')banner.hidden=true;}).catch(e=>toast(e.message));}
 };
 document.addEventListener('visibilitychange',check);window.addEventListener('blur',check);window.addEventListener('focus',check);
 // On a reload/reconnection the server still knows when the absence started.
 let restoredUser=null;
 setInterval(async()=>{
   const {user}=context();if(!user){restoredUser=null;away=false;banner.hidden=true;return;}
   check();if(away&&Date.now()-started>=120000&&banner.hidden)notice('warning');
   if(timerBusy||Date.now()-lastSync<15000)return;timerBusy=true;lastSync=Date.now();
   try{
     const restore=restoredUser!==user.id&&!document.hidden&&document.hasFocus();
     const action=restore?'back':away&&!awaySent?'away':'check';
     const r=await send(action);if(action==='away')awaySent=true;restoredUser=user.id;notice(r.stage);
   }catch(e){toast(e.message)}finally{timerBusy=false;}
 },1000);
 banner.addEventListener('click',()=>{if(!away)banner.hidden=true;});
 const blocked=document.createElement('dialog');blocked.id='blockedDialog';
 blocked.innerHTML='<h2>Доступ к игре ограничен</h2><p id="blockedReason"></p><button class="primary" id="recheckAccess">Проверить доступ</button><button class="text-button" id="blockedLogout">Выйти из аккаунта</button>';
 document.body.append(blocked);blocked.addEventListener('cancel',e=>e.preventDefault());
 $('recheckAccess').onclick=()=>location.reload();$('blockedLogout').onclick=async()=>{try{await api('/api/auth/sign-out',{});location.reload();}catch(e){toast(e.message);}};
 window.addEventListener('account-blocked',e=>{document.querySelectorAll('dialog[open]').forEach(d=>{if(d!==blocked)d.close();});$('blockedReason').textContent=e.detail;if(!blocked.open)blocked.showModal();});
}
