const plans={
Montag:{focus:'Beine · Brust · Trizeps · Core',optional:false,ex:[['Aufwärmen','7–10 Min.','Ergometer / Crosstrainer'],['Beinpresse','3 × 10–12','Hackenschmidt-/Squat-Maschine'],['Beinbeuger','3 × 10–12','sitzend oder liegend'],['Hip Thrust','3 × 10–12','Hip-Thrust-/Glute-Maschine'],['Bankdrücken','3 × 8–12','Brustpresse'],['Schrägbankdrücken','3 × 8–12','schräge Brustpresse'],['Trizepsdrücken','3 × 10–15','Trizeps-/Dip-Maschine'],['Dead Bug','3 × 6–10/Seite','Core-Maschine*'],['Side Plank','2–3 × 20–40 s/Seite','seitliche Rumpfmaschine*']]},
Dienstag:{focus:'Haltung · Core · Kondition',optional:true,ex:[['Aufwärmen','5–7 Min.','Ergometer / Crosstrainer'],['Bird Dog','3 × 8/Seite','Core-Gerät*'],['Pallof Press','3 × 10/Seite','Kabelzug / Torso-Gerät*'],['Face Pull','3 × 12–15','Reverse-Fly-Maschine'],['Reverse Fly','3 × 12–15','Reverse-Pec-Deck'],['Side Plank','3 × 20–40 s/Seite','seitliche Rumpfmaschine*'],['Glute Bridge','3 × 12–15','Hip-Thrust-/Glute-Maschine'],['Cardio moderat','30–40 Min.','Ergometer / Crosstrainer / Laufband'],['Mobilität','5 Min.','Hüfte / Brust / BWS']]},
Mittwoch:{focus:'Rücken · Bizeps · hintere Schulter',optional:false,ex:[['Aufwärmen','7–10 Min.','Crosstrainer / Ruderergometer'],['Latziehen zur Brust','3 × 8–12','unterstützte Klimmzugmaschine'],['Rudern sitzend','3 × 8–12','Ruderzugmaschine mit Brustpolster'],['Einarmiges Kabelrudern','3 × 10–12/Seite','einarmige Ruderzugmaschine'],['Reverse Fly','3 × 12–15','Reverse-Pec-Deck'],['Face Pull','3 × 12–15','Rear-Delt-/hohe Rudermaschine'],['Bizepscurl','3 × 8–12','Bizepsmaschine / Kabelzug'],['Hammercurl','2–3 × 10–12','Seil am Kabelzug'],['Pallof Press','3 × 10/Seite','Core-/Torso-Maschine*']]},
Donnerstag:{focus:'Schwimmen · optional Core',optional:true,ex:[['Einschwimmen','5–10 Min.','–'],['gleichmäßiges Schwimmen','20–30 Min.','–'],['schnellere Abschnitte','5–10 Min.','–'],['Ausschwimmen','5 Min.','–'],['Optional: Face Pull','2 × 15','Reverse-Fly-Maschine'],['Optional: Pallof Press','2 × 10/Seite','Torso-/Core-Gerät*'],['Optional: Bird Dog','2 × 8/Seite','Core-Gerät*'],['Optional: Glute Bridge','2 × 12–15','Hip-Thrust-/Glute-Maschine']]},
Freitag:{focus:'Ganzkörper · Schulter · Arme',optional:false,ex:[['Aufwärmen','7–10 Min.','Crosstrainer / Ergometer'],['Goblet Squat','3 × 8–12','Hackenschmidt-/Squat-Maschine'],['Hip Thrust','3 × 8–12','Hip-Thrust-/Glute-Maschine'],['Schulterdrücken','3 × 8–12','Schulterpresse'],['Seitheben','3 × 12–15','Seithebemaschine'],['Bizepscurl','3 × 8–12','Bizepsmaschine / Kabelzug'],['Trizepsdrücken','3 × 10–15','Trizepsmaschine / Kabelzug'],["Farmer's Carry",'3 × 30–45 s','Farmer Hold / Core-Kabelübung'],['Dead Bug','3 × 6–10/Seite','Core-Maschine*']]},
Samstag:{focus:'Optional · Haltung · Körperbeherrschung',optional:true,ex:[['Bird Dog','3 × 8/Seite','Core-Gerät*'],['Side Plank','3 × 20–40 s/Seite','seitliche Rumpfmaschine*'],['Glute Bridge','3 × 12–15','Hip-Thrust-/Glute-Maschine'],['Liegestütze','3 × 8–15','Brustpresse'],['leichte Kniebeugen','2 × 10–15','Squat-/Beinpresse'],['Mobilität','8–10 Min.','Hüfte / Brust / BWS']]},
Sonntag:{focus:'Regeneration',optional:true,ex:[]}}
const days=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];let state=JSON.parse(localStorage.getItem('trainingState')||'{"sessions":{},"history":[]}');let currentDay=days[new Date().getDay()],guidedIndex=0;
function key(day=currentDay){let d=new Date(),m=new Date(d);m.setDate(d.getDate()-((d.getDay()+6)%7));return m.toISOString().slice(0,10)+'_'+day}function sess(day=currentDay){let k=key(day);if(!state.sessions[k])state.sessions[k]={day,date:new Date().toISOString(),items:plans[day].ex.map(x=>({name:x[0],target:x[1],alt:x[2],status:'open',sets:[{},{},{}],effort:'',pain:'',note:''}))};return state.sessions[k]}function save(){localStorage.setItem('trainingState',JSON.stringify(state))}
function parseDate(v){return new Date(v)}
function previousExercise(name,currentSession){
  const candidates=[];
  (state.history||[]).forEach(s=>{
    if(s===currentSession)return;
    const x=(s.items||[]).find(i=>i.name===name);
    if(x)candidates.push({date:parseDate(s.date),x});
  });
  Object.values(state.sessions||{}).forEach(s=>{
    if(s===currentSession)return;
    const x=(s.items||[]).find(i=>i.name===name);
    const hasData=x&&(x.sets||[]).some(z=>z.kg!==undefined&&z.kg!==''||z.reps!==undefined&&z.reps!=='');
    if(hasData)candidates.push({date:parseDate(s.date),x});
  });
  candidates.sort((a,b)=>b.date-a.date);
  return candidates[0]?.x||null;
}
function ensurePreviousValues(x,s){
  if(x.previousLoaded)return;
  const prev=previousExercise(x.name,s);
  x.previousLoaded=true;
  x.previous=prev?{sets:(prev.sets||[]).map(z=>({kg:z.kg??'',reps:z.reps??''}))}:null;
  if(prev){
    x.sets.forEach((v,j)=>{
      const p=prev.sets?.[j];
      if(p&&v.kg===undefined&&p.kg!==undefined&&p.kg!=='')v.kg=p.kg;
    });
  }
  save();
}
let timerHandle=null,timerRemaining=0;
function startRestTimer(seconds=90){
  clearInterval(timerHandle);timerRemaining=seconds;
  restTimer.classList.remove('hidden');
  timerValue.textContent=timerRemaining+' s';
  timerHandle=setInterval(()=>{
    timerRemaining--;
    timerValue.textContent=timerRemaining+' s';
    if(timerRemaining<=0){clearInterval(timerHandle);restTimer.classList.add('hidden')}
  },1000);
}
function stopRestTimer(){clearInterval(timerHandle);restTimer.classList.add('hidden')}

function renderToday(){let p=plans[currentDay],s=sess();dayLabel.textContent=currentDay+(p.optional?' · optional':'');focus.textContent=p.focus;summary.textContent=p.ex.length?`${s.items.filter(x=>x.status==='done').length} von ${s.items.length} Übungen erledigt`:'Regeneration / leichte Bewegung';exerciseList.innerHTML='';s.items.forEach((x,i)=>{let c=document.createElement('div');c.className='card exercise '+(x.status==='done'?'status-done':'');c.innerHTML=`<div><span class="pill">${x.status==='done'?'ERLEDIGT':x.status==='occupied'?'BELEGT':'OFFEN'}</span><h3>${x.name}</h3><div class="meta">${x.target} · Alt.: ${x.alt}</div></div><button class="${x.status==='done'?'ghost':'secondary'}">${x.status==='done'?'Öffnen':'Start'}</button>`;c.querySelector('button').onclick=()=>openGuided(i);exerciseList.appendChild(c)});startGuided.disabled=!s.items.length;startGuided.textContent=s.items.length?'Training starten':'Heute kein Krafttraining'}
function openGuided(i){guidedIndex=i;guided.classList.remove('hidden');renderGuided()}
function renderGuided(){
  let s=sess(),x=s.items[guidedIndex];ensurePreviousValues(x,s);
  progress.textContent=`${guidedIndex+1}/${s.items.length}`;
  gStatus.textContent=x.status.toUpperCase();gName.textContent=x.name;gTarget.textContent=x.target;gAlt.textContent='Alternative: '+x.alt;
  const prev=x.previous;
  if(prev&&prev.sets?.some(z=>z.kg!==''||z.reps!=='')){
    const rows=prev.sets.map((z,j)=>{
      const parts=[];
      if(z.kg!==''&&z.kg!==undefined)parts.push(`${z.kg} kg`);
      if(z.reps!==''&&z.reps!==undefined)parts.push(`${z.reps} Wdh.`);
      return parts.length?`S${j+1}: ${parts.join(' · ')}`:'';
    }).filter(Boolean);
    lastTraining.innerHTML=`<strong>Letztes Training</strong><div>${rows.join(' &nbsp;|&nbsp; ')}</div><small>Gewichte wurden als Startwert für heute übernommen.</small>`;
    lastTraining.classList.remove('hidden');
  }else{
    lastTraining.innerHTML='<strong>Letztes Training</strong><div>Noch keine Vergleichswerte vorhanden.</div>';
    lastTraining.classList.remove('hidden');
  }
  sets.innerHTML='';
  x.sets.forEach((v,j)=>{
    let r=document.createElement('div');r.className='setRow';
    r.innerHTML=`<strong>S${j+1}</strong><label>kg<input type="number" step="0.5" inputmode="decimal" value="${v.kg??''}"></label><label>Wdh.<input type="number" inputmode="numeric" value="${v.reps??''}"></label><button class="setCheck">${v.done?'✓':'○'}</button>`;
    let ins=r.querySelectorAll('input');
    ins[0].oninput=e=>{v.kg=e.target.value;save()};
    ins[1].oninput=e=>{v.reps=e.target.value;save()};
    r.querySelector('button').onclick=()=>{v.done=!v.done;save();if(v.done)startRestTimer(90);renderGuided()};
    sets.appendChild(r)
  });
  effort.value=x.effort;pain.value=x.pain;note.value=x.note;
  effort.onchange=e=>{x.effort=e.target.value;save()};
  pain.oninput=e=>{x.pain=e.target.value;save()};
  note.oninput=e=>{x.note=e.target.value;save()}
}
skipTimer.onclick=stopRestTimer;
occupied.onclick=()=>{let x=sess().items[guidedIndex];x.status='occupied';save();let open=sess().items.findIndex((y,i)=>i!==guidedIndex&&y.status==='open');if(open>=0){guidedIndex=open;renderGuided()}else{guided.classList.add('hidden');renderToday()}};done.onclick=()=>{let s=sess(),x=s.items[guidedIndex];x.status='done';save();let open=s.items.findIndex(y=>y.status==='open');if(open>=0){guidedIndex=open;renderGuided()}else{guided.classList.add('hidden');finishSession();renderToday()}};chooseExercise.onclick=()=>{guided.classList.add('hidden');renderToday()};closeGuided.onclick=()=>{guided.classList.add('hidden');renderToday()};startGuided.onclick=()=>{let s=sess(),i=s.items.findIndex(x=>x.status==='open');openGuided(i<0?0:i)};
function finishSession(){let s=sess();if(s.items.length&&s.items.every(x=>x.status==='done')&&!s.archived){s.archived=true;state.history.unshift(JSON.parse(JSON.stringify(s)));save();renderHistory()}}
function renderWeek(){weekList.innerHTML='';['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'].forEach(d=>{let p=plans[d],s=sess(d),done=s.items.filter(x=>x.status==='done').length;let e=document.createElement('div');e.className='weekDay';e.innerHTML=`<strong>${d}${p.optional?' · optional':''}</strong><div class="muted">${p.focus}</div><div>${p.ex.length?done+'/'+p.ex.length:'Regeneration'}</div>`;weekList.appendChild(e)})}function renderHistory(){historyList.innerHTML=state.history.length?'':'Noch keine abgeschlossene Einheit.';state.history.forEach(s=>{let e=document.createElement('div');e.className='historyItem';e.innerHTML=`<strong>${s.day}</strong><div class="muted">${new Date(s.date).toLocaleDateString('de-DE')} · ${s.items.length} Übungen</div>`;historyList.appendChild(e)})}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button,.view').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById(b.dataset.view).classList.add('active');if(b.dataset.view==='week')renderWeek();if(b.dataset.view==='history')renderHistory()});exportBtn.onclick=()=>{let blob=new Blob([JSON.stringify({version:2,exportedAt:new Date().toISOString(),plans,state},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='training-export-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href)};importFile.onchange=async e=>{let obj=JSON.parse(await e.target.files[0].text());if(obj.state){state=obj.state;save();renderToday();alert('Daten importiert.')}};resetBtn.onclick=()=>{if(confirm('Alle lokalen Trainingsdaten wirklich löschen?')){localStorage.removeItem('trainingState');location.reload()}};
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});installBtn.onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;installBtn.hidden=true}};if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');renderToday();renderHistory();
