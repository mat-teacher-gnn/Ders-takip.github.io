```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EntryForm from './EntryForm';


export default function Dashboard({ user, onLogout }){
const [mydata, setMydata] = useState([]);
const [aggregate, setAggregate] = useState(null);


async function loadMyData(){
const res = await axios.get('/api/mydata', { withCredentials: true });
setMydata(res.data.values || []);
}


async function loadAggregate(){
const res = await axios.get('/api/admin/aggregate', { withCredentials: true });
setAggregate(res.data.users);
}


useEffect(()=>{ loadMyData(); if (user.role === 'admin') loadAggregate(); }, []);


async function logout(){
await axios.post('/api/logout', {}, { withCredentials: true });
onLogout();
}


return (
<div>
<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div>Hoş geldin: <b>{user.username}</b> ({user.role})</div>
<div><button onClick={logout}>Çıkış</button></div>
</div>


<h3>Kendi Kayıtların</h3>
<EntryForm onSaved={loadMyData} />
<table border={1} cellPadding={6} style={{marginTop:10, background:'#fff'}}>
<tbody>
{mydata.map((r,i)=>(<tr key={i}>{r.map((c,j)=>(<td key={j}>{c}</td>))}</tr>))}
</tbody>
</table>


{user.role === 'admin' && (
<div>
<h3>Yönetici - Tüm Kullanıcıların Verileri</h3>
{aggregate ? aggregate.map(u=> (
<div key={u.username} style={{marginBottom:10}}>
<h4>{u.username}</h4>
<table border={1} cellPadding={6}>
<tbody>
{u.rows.map((r,i)=>(<tr key={i}>{r.map((c,j)=>(<td key={j}>{c}</td>))}</tr>))}
</tbody>
</table>
</div>
)) : <div>Yükleniyor...</div>}
</div>
)}


</div>
);
}
```
