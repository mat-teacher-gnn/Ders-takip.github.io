```jsx
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';


export default function App(){
const [user, setUser] = useState(null);
return (
<div style={{fontFamily:'Arial, sans-serif', padding:20, background:'#f6f7f8', minHeight:'100vh'}}>
<h1>Öğrenci Günlük Soru Takibi</h1>
{!user ? <Login onLogin={(u)=>setUser(u)} /> : <Dashboard user={user} onLogout={()=>setUser(null)} />}
</div>
);
}
```
