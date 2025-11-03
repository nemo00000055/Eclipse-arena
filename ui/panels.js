const rosterListEl=()=>document.getElementById('roster-list');
const battleLogEl=()=>document.getElementById('battle-log');
const modalOverlayEl=()=>document.getElementById('modal-overlay');
const modalBodyEl=()=>document.getElementById('modal-body');
const modalTitleEl=()=>document.getElementById('modal-title');
export function writeRosterToDOM(roster){
 if(!rosterListEl())return;
 if(!Array.isArray(roster)||roster.length===0){rosterListEl().textContent='(no units yet)';return;}
 rosterListEl().textContent=roster.map((u,i)=>`#${i+1} ${u.name} [${u.element}] LV${u.level} HP:${u.hp} ATK:${u.atk}`).join('\n');
}
export function appendBattleLog(line){
 const box=battleLogEl(); if(!box)return; box.textContent+=(box.textContent?'\n':'')+line; box.scrollTop=box.scrollHeight;
}
export function openModal(title,body){ modalTitleEl().textContent=title; modalBodyEl().textContent=body; modalOverlayEl().classList.remove('hidden'); modalOverlayEl().querySelector('.modal').focus(); }
export function closeModal(){ modalOverlayEl().classList.add('hidden'); }
export function handleGlobalKeydown(ev){ if(ev.key==='Escape'){ const o=modalOverlayEl(); if(o && !o.classList.contains('hidden')) closeModal(); } }