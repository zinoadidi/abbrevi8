    
   /*App settings*/
    var authToken = btoa("abbreviate:somep@55") 
   var appSettings = {
        appTitle: 'Abbrevi8',
        displayContainer: 'display',
        defaultPage: 'menu',
        errorPage: 'welcome',
        loadDefaultPage: false,
        trackUrlChanges: false,
        registerPageHistory: true,
        viewPath: 'app/view/',
       serverUrl: 'app/gameData/',
        appMode: 'debug',
        httpReqHeaders: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Access-Control-Allow-Credentials": "true"
        },
        httpRequestAuth: {
            "status": true,
            "authName": "Basic",
            "authToken": authToken
        },
        loader: {
            active: false,
            useCustom: true,
            id: 'loadingContainer',
            imgUrl: '',
            text: 'Loading...',
            showImg: false,
            showTxt: false,
            imgSize: '',
            style: '',
            class: ''
        }
    };
    renda.config(appSettings);
    
 

 