var abbrevi8 = {
    user:{
        id:'',
        username:'',
        location:'',
        date:''
    },
    score:{
        id:'',
        userId:'',
        score:'',
        date:''
    },
    settings:{
        difficulty:{
            level:1,
            timer:60,
            questions: 5
        },
        timer:0
    },
    categories:[]
}

var database = {
    users:[],
    scores:[],
    settings:{},
    questions:[],
    categories:[]

}

var currentGame={
    category:{
    },
    score:0,
    questions:[],
    currentQuestion: {},
    questionAnswered: 0,
    correctAnswers: 0,
    score: 0
}
var timerHook = '';
var answerStrenght = 0;
var backgroundMusic = document.createElement("AUDIO");
var success = document.createElement("AUDIO");
var failed = document.createElement("AUDIO");
var counter = document.createElement("AUDIO");
//backgroundMusic.src = "app/assets/sounds/background.mp3";