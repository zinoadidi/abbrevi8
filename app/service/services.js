function loadPage(page){
    renda.page(page)
}

function DB(data,task){
    console.log('task============')
    console.log(data)
    var db = database;
    var status = false;
    var message ='';
    try {
        db = JSON.parse(localStorage.database)
    } catch (ex) {
        console.log(ex)
    }
    switch (task) {
        case 'addUser':
            addUser();
            break;
    
        case 'addScore':
            addScore();
            break;
        default:
            break;
    }
    
    function prepareDb(){

    }
    function addUser(){
        data.id = db.users.push({
            'username':data.username,
            'location':data.location,
            'dateCreated':data.dateCreated
        })
        message = 'Registration Successful';
        status = true;
    }
    function deleteUser(){

    }
    function addScore(){
        data.id = db.scores.push({
            'score': data.score,
            'userId': data.userId,
            'level': data.level
        })
        message = 'Your score has been stored';
        status = true;
    }
    function listUsers(){

    }
    function listScores(){

    }
    function flushDb() {
        sessionStorage.clear()
        status = true;
        message = "reset successful";
    }
    localStorage.database = JSON.stringify(db);
    return {
        data: data,
        status: status,
        message:message
    }
}

function showMessage(message,type){
    var msgType = '';
    switch (type) {
        case 'warn':
            msgType = 'warning';
            break;
        case 'error':
            msgType = 'error';           
            break;
        case 'notify':
            msgType = 'info';                       
            break;
        case 'success':
            msgType = 'success';                                   
            break;
        default:
            msgType = 'success';                                               
            break;
    }
    swal({
        title: message,
        text: 'Click on the button to continue',
        icon: msgType,
        button: "Got It!",
    });
   
}

function validateObj(obj, silentMode) {
    var errorFound = 0;
    $.each(obj, function (key, value) {
        if (value) {
            if (value == null || value == '' || value.lenght == 0) {
                if (silentMode) { } else {
                    showMessage('Please fill in detail for: ' + key,'error');
                }
                errorFound++;
            }
        } else if (value == undefined) {

        } else if (value == 0) {

        } else {
            if (silentMode) { } else {
                showMessage('Please fill in detail for: ' + key,'error');
            }
            errorFound++;
        }

    });

    if (errorFound > 0) {
        return false;
    } else {
        return true;
    }

}

function getRequest(data){
    renda.get(data.url,data.callBack);
}
function postRequest(data) {
    renda.post(data);
}
function promiseXmlHTTP(options) {
    return new Promise(function (resolve, reject) {
        $.ajax(options).done(resolve).fail(reject);
    });
}
