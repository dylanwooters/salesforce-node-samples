var jsforce = require('jsforce');

module.exports = {
    openSession: async function (username, password, url) {
        return new Promise((resolve, reject)=> {
            let conn = new jsforce.Connection({
                //you can change loginUrl to connect to sandbox or prerelease env.
                loginUrl : url
            });
            conn.login(username, password, (err, userInfo) => {
                if (err) { 
                    reject(err);
                } else {
                    console.log('Opened connection to Salesforce');
                    resolve(conn);
                }
            });
        });
    },
    closeSession: async function (conn) {
        return new Promise((resolve)=>{
            conn.logout((err) => {
                if (err) {
                    reject(err);
                }
                console.log('Closed connection to Salesforce');
                resolve();
            });
        });
    }
}