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
            timer:59,
            questions: 5
        }
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