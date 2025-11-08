```jsx
import React, { useState } from 'react';
import axios from 'axios';


export default function Login({ onLogin }){
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');


async function submit(e){
e.preventDefault();
try{
const res = await axios.post('/api/login', { email, password }, { withCredentials: true });
onLogin({ username: res.data.username, role: res.data.role });
}catch(err){
setError(err.response?.data?.error || 'Hata');
}
}


return (
<form onSubmit={submit} style={{maxWidth:400}}>
<div><label>E-posta</label><input value={email} onChange={e=>setEmail(e.target.value)} required /></div>
<div><label>Şifre</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
<button type="submit">Giriş</button>
{error && <div style={{color:'red'}}>{error}</div>}
</form>
);
}
```
