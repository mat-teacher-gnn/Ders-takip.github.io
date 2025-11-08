```jsx
import React, { useState } from 'react';
import axios from 'axios';


export default function EntryForm({ onSaved }){
const [date, setDate] = useState(new Date().toISOString().slice(0,10));
const emptyFields = { turkce_correct:0, turkce_wrong:0, mat_correct:0, mat_wrong:0, sosyal_correct:0, sosyal_wrong:0, fen_correct:0, fen_wrong:0, ing_correct:0, ing_wrong:0, din_correct:0, din_wrong:0 };
const [fields, setFields] = useState(emptyFields);


function change(k,v){ setFields({...fields, [k]: Number(v)}); }


async function submit(e){
e.preventDefault();
await axios.post('/api/submit', { date, ...fields }, { withCredentials: true });
setFields(emptyFields);
if (onSaved) onSaved();
}


return (
<form onSubmit={submit} style={{background:'#fff', padding:10}}>
<div>Tarih: <input type="date" value={date} onChange={e=>setDate(e.target.value)} /></div>
<h4>Türkçe</h4>
<div>Doğru: <input type=number value={fields.turkce_correct} onChange={e=>change('turkce_correct', e.target.value)} /></div>
<div>Yanlış: <input type=number value={fields.turkce_wrong} onChange={e=>change('turkce_wrong', e.target.value)} /></div>
<h4>Matematik</h4>
<div>Doğru: <input type=number value={fields.mat_correct} onChange={e=>change('mat_correct', e.target.value)} /></div>
<div>Yanlış: <input type=number value={fields.mat_wrong} onChange={e=>change('mat_wrong', e.target.value)} /></div>
<h4>Sosyal</h4>
<div>Doğru: <input type=number value={fields.sosyal_correct} onChange={e=>change('sosyal_correct', e.target.value)} /></div>
<div>Yanlış: <input type=number value={fields.sosyal_wrong} onChange={e=>change('sosyal_wrong', e.target.value)} /></div>
<h4>Fen</h4>
<div>Doğru: <input type=number value={fields.fen_correct} onChange={e=>change('fen_correct', e.target.value)} /></div>
<div>Yanlış: <input type=number value={fields.fen_wrong} onChange={e=>change('fen_wrong', e.target.value)} /></div>
<h4>İngilizce</h4>
<div>Doğru: <input type=number value={fields.ing_correct} onChange={e=>change('ing_correct', e.target.value)} /></div>
<div>Yanlış: <input type=number value={fields.ing_wrong} onChange={e=>change('ing_wrong', e.target.value)} /></div>
<h4>Din Kültürü</h4>
<div>Doğru: <input type=number value={fields.din_correct} onChange={e=>change('din_correct', e.target.value)} /></div>
<div>Yanlış: <input type=number value={fields.din_wrong} onChange={e=>change('din_wrong', e.target.value)} /></div>
<div style={{marginTop:8}}><button type="submit">Kaydet</button></div>
</form>
);
}
```
