var jsforce = require('jsforce');
var fs = require('fs');
var path = require('path');
var express = require('express')
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

run();

async function run(){
    let creds = JSON.parse(fs.readFileSync(path.resolve(__dirname,'./salesforce-creds.json')).toString());
    let conn = new jsforce.Connection({ loginUrl : creds.url });
    try {
        await conn.login(creds.username, creds.password);
        console.log('Connected to Salesforce!');
        
        //Reading, Writing and Deleting Data Sample
        // let soql = `SELECT Id, Name, 
        //     (SELECT Id, FirstName, LastName, Email_Verified__c, Enrollment_Status__c from Contacts) 
        //     FROM Account`;
        // let accounts = await conn.query(soql);
        // let cooper = accounts.records
        //     .filter(x => x.Name === 'Twin Peaks Sheriff Dept.')[0].Contacts.records
        //     .filter(y => y.FirstName === 'Dale' && y.LastName === 'Cooper')[0];
        // console.log(cooper);
        // // Console output:
        // // { attributes:
        // //     { type: 'Contact',
        // //       url: '/services/data/v42.0/sobjects/Contact/0033h000001sDzDAAU' },
        // //    Id: '0033h000001sDzDAAU',
        // //    FirstName: 'Dale',
        // //    LastName: 'Cooper',
        // //    Email_Verified__c: true,
        // //    Enrollment_Status__c: 'Pending' 
        // //  }
        // cooper.Enrollment_Status__c = 'Accepted';
        // let ret = await conn.sobject('Contact').update(cooper);
        // if (ret.success) {
        //     console.log('Contact updated in Salesforce.');
        // }

        // Working with Large Amounts of Data
        // let contacts = [];
        // let soql = 'SELECT Id, FirstName, LastName, Email_Verified__c, Enrollment_Status__c from Contact';
        // let query = await conn.query(soql)
        // .on("record", (record) => {
        //     contacts.push(record);
        // })
        // .on("end", async () => {          
        //     console.log(`Fetched Contacts. Total records fetched: ${contacts.length}`);
        // })
        // .on("error", (err) => {
        //   console.error(err);
        // })
        // .run({ autoFetch : true, maxFetch : 5000 });

        // //set poll timeout to one minute for larger datasets
        // sfConnection.bulk.pollTimeout = 240000;
        // //normally you will have thousands of Accounts, this is just an example
        // let accounts = [
        //     { Name: 'Saul Goodman, LLC' },
        //     { Name: 'Los Pollos Hermanos Inc' },
        //     { Name: 'Hamlin, Hamlin & McGill' }
        // ];
        // let results = await conn.bulk.load('Account','insert', accounts);
        // console.log(results);
        // // Console output:
        // // [ { id: '0013h000006bdd2AAA', success: true, errors: [] },
        // // { id: '0013h000006bdd3AAA', success: true, errors: [] },
        // // { id: '0013h000006bdd4AAA', success: true, errors: [] } ]
        // if (accounts.length === results.filter(x => x.success).length){
        //     console.log('All account successfully loaded.');
        // }

        //Websocket Streaming
        //listen with express on localhost:3000
        server.listen(3000, function(){
            console.log('listening on *:3000');
        });

        //when the client connects, emit streaming updates from salesforce to client
        io.on("connection", (socket) => {
        console.log('A socket connection was made!');
        let eventHandler = (message) => {
                console.log('New streaming event received from Salesforce:', message);
                socket.emit('UserChange', message);
            };
        conn.streaming.topic('UserChange').subscribe(eventHandler);
        });

        await conn.logout();
    } catch (err) {
        console.error(err);
        await conn.logout();
    }
}