```js
req.user = payload;
next();
}


// Submit today's entry
app.post('/api/submit', authMiddleware, async (req, res) => {
const username = req.user.username;
const { date, turkce_correct, turkce_wrong, mat_correct, mat_wrong, sosyal_correct, sosyal_wrong, fen_correct, fen_wrong, ing_correct, ing_wrong, din_correct, din_wrong } = req.body;
const row = [date || new Date().toISOString().slice(0,10), turkce_correct||0, turkce_wrong||0, mat_correct||0, mat_wrong||0, sosyal_correct||0, sosyal_wrong||0, fen_correct||0, fen_wrong||0, ing_correct||0, ing_wrong||0, din_correct||0, din_wrong||0];
await ensureUserSheet(username);
await sheets.spreadsheets.values.append({
spreadsheetId: SPREADSHEET_ID,
range: `${username}!A:M`,
valueInputOption: 'RAW',
requestBody: { values: [row] }
});
res.json({ message: 'Kayıt eklendi' });
});


// Get user's own data
app.get('/api/mydata', authMiddleware, async (req, res) => {
const username = req.user.username;
await ensureUserSheet(username);
const r = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: `${username}!A1:M1000` });
res.json({ values: r.data.values || [] });
});


// Admin aggregate
app.get('/api/admin/aggregate', authMiddleware, async (req, res) => {
if (req.user.role !== 'admin') return res.status(403).json({ error: 'Yönetici yetkisi gerekli' });
// Read users list
const users = await getUsersSheet();
const header = users[0] || [];
const data = users.slice(1).map(r => ({ email: r[0], username: r[1], role: r[3] || 'user' }));
const result = [];
for (const u of data) {
try {
const r = await sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: `${u.username}!A2:M1000` });
const vals = r.data.values || [];
result.push({ username: u.username, rows: vals });
} catch (e) {
result.push({ username: u.username, rows: [] });
}
}
res.json({ users: result });
});


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
```
