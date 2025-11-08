

```js
// init_users.js
const fs = require('fs');
const { google } = require('googleapis');
const bcrypt = require('bcrypt');
require('dotenv').config();


const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const credentials = JSON.parse(fs.readFileSync('credentials.json'));
const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
const sheets = google.sheets({ version: 'v4', auth });


async function main(){
// Kullanıcı listesi — sağladığınız e-postalar ve şifreler
const users = [
['yanikeymen525@gmail.com','Eymen burn','aB3dF7gH','admin'],
['sewdamsonsuz2@gmail.com','İrem Köseoğlu','K9mN4pQr','user'],
['pinarcaliskan76@gmail.com','Yağmur','W2xY6zQ8','user'],
['elifnuryilmaz204@gmail.com','Nisanur Yılmaz','R7tU5vWx','user'],
['merar7470@gmail.com','Merve','P1qR3sT9','user']
];


const hashed = [];
for (const u of users) {
const hash = await bcrypt.hash(u[2], 10);
hashed.push([u[0], u[1], hash, u[3]]);
}


// create users sheet header if not exists
try {
await sheets.spreadsheets.values.update({ spreadsheetId: SPREADSHEET_ID, range: 'users!A1:D1', valueInputOption: 'RAW', requestBody: { values: [['E-posta','Kullanıcı Adı','ŞifreHash','Role']] } });
} catch(e){
console.error('users sheet olmadi — lutfen spreadsheeti service account ile paylasin:', e.message);
process.exit(1);
}


// write users
await sheets.spreadsheets.values.update({ spreadsheetId: SPREADSHEET_ID, range: 'users!A2:D10', valueInputOption: 'RAW', requestBody: { values: hashed } });
console.log('Kullanıcılar eklendi.');
}


main().catch(console.error);
```
