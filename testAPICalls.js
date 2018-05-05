String.prototype.hexEncode = function(){
    var hex, i;
    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }
    return result
}

var fetch = require('node-fetch');
var crypto = require('crypto');
var bip39 = require('bip39');
var sha256 = require('sha256');

var token = null
var user = null

//callAPI('account/login', 'POST', { usernameOrEmail: 'test@test.com', password: '123456789' }, token, loginReturned)

//callAPI('account/sendResetPasswordEmail', 'POST', { email: 'antonnell.crypto@gmail.com', callbackURL: 'http://localhost:3000' }, null, logData)
callAPI('account/resetPassword', 'POST', { email: 'antonnell.crypto@gmail.com', password:'123123123', code:'CfDJ8N7FFOxtO0pAhVPgOFbi9L6VmRBEctt4jmtAy25Pm7W%2FdN4vlwVzaEj4xY0Ti8SYzfdHYjho8gbOvqR8dJbeMHOXdGhP9DMmgW2Rs54fzssCeXZULWfzR2xflim1kk5ZQ2EvMfPAIT%2F1qk0pt3PP3wLYOeQrf4UevA8qXq2SFYeQ8n3aA%2FSsQAe4WWVY%2BeZUllhDYoeE14kwEZQCY%2BA5QjB3KjYKSdsWdtNndfIz%2FW1FLjnuNc9kjFK0mCZTo%2B%2BmVQ%3D%3D' }, null, logData)

function callAPIFunctions() {
  //callAPI('account/register', 'POST', { username: 'test1', email: 'test1@test.com', password: '12345678' }, token, logData)
  //callAPI('account/updatePassword', 'POST', { username: user.username, password: '123456789' }, token, logData)

  //callAPI('contacts/getUserContacts/'+user.username, 'GET', null, token, logData)
  //callAPI('contacts/addUserContact', 'PUT', { username: 'test1', displayName: 'firend1', notes: 'note on friend1', ownerUsername: user.username }, token, logData)
  //callAPI('contacts/updateUserContact', 'PUT', { username: 'test1', displayName: 'firend1', notes: 'note on friend1', ownerUsername: user.username }, token, logData)

  //callAPI('ethereum/getUserAddresses/'+user.id, 'GET', null, token, logData)
  //callAPI('ethereum/createAddress', 'POST', { name: 'My New Eth Address', isPrimary: true }, token, logData)
  //callAPI('ethereum/importAddress', 'POST', { name: 'My Imported Eth Address', isPrimary: true, address: '0xB39F32F5E906fD32d51d88751f1d768EDf98F317', privateKey: '67ff394560d389e3e6fc8d898ef2168fcce3acce8d5c3d58f8aaeb4b1e16cac2' }, token, logData)

  //callAPI('wanchain/getUserAddresses/'+user.id, 'GET', null, token, logData)
  //callAPI('wanchain/createAddress', 'POST', { username: user.username, name: 'My New Wan Address', isPrimary: true }, token, logData)


}

function loginReturned(url, error, data) {
  if (error) {
    console.log("---------------------------\n"+url+"\n---------------------------- \n"+JSON.stringify(error, null, 2))
  } else {
    console.log("----------------------------\n"+url+"\n---------------------------- \n"+JSON.stringify(data, null, 2))
  }

  if (data.success) {
    token = data.token
    user = data.user

    callAPIFunctions()
  } else {
    process.exit(1)
  }
}

function logData(url, error, data) {
  if (error) {
    console.log("\n\n----------------------------\n"+url+"\n---------------------------- \n"+JSON.stringify(error, null, 2))
  } else {
    console.log("\n\n----------------------------\n"+url+"\n---------------------------- \n"+JSON.stringify(data, null, 2))
  }
}

function callAPI(url, method, postData, token, callback){
  let apiUrl = 'http://18.221.173.171:81/';
  var call = apiUrl+url

  if(method == 'GET') {
    postData = null
  } else {
    const signJson = JSON.stringify(postData);
    const signMnemonic = bip39.generateMnemonic();
    const cipher = crypto.createCipher('aes-256-cbc', signMnemonic);
    const signEncrypted = cipher.update(signJson, 'utf8', 'base64') + cipher.final('base64');
    var signData = {
      e: signEncrypted.hexEncode(),
      m: signMnemonic.hexEncode(),
      u: sha256(url.toLowerCase()),
      p: sha256(sha256(url.toLowerCase())),
      t: new Date().getTime(),
    }
    const signSeed = JSON.stringify(signData)
    const signSignature = sha256(signSeed)
    signData.s = signSignature
    postData = JSON.stringify(signData)
  }

  fetch(call, {
      method: method,
      body: postData,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token },
  })
  .then(res => res.json())
  .then((res) => {
    callback(url, null, res)
  })
  .catch((error) => {
    callback(url, error, null)
  });
}
