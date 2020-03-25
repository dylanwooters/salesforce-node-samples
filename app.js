var jsforce = require('jsforce');
var fs = require('fs');
var path = require('path');

run();

async function run(){
    let creds = JSON.parse(fs.readFileSync(path.resolve(__dirname,'./keys/salesforce-conn-sandbox.json')).toString());
    let conn = new jsforce.Connection({ loginUrl : creds.url });
    try {
        await conn.login(creds.username, creds.password);
        
        let accounts = await conn.query('SELECT Id, Name FROM Account');
        console.log(accounts);
        
        await conn.logout();
    } catch (err) {
        console.error(err);
    }
}