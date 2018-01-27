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
            timer:40,
            questions:10,
            currentQuestion:{},
            questionAnswered:0,
            correctAnswers:0,
            score:0

        }
    },
    categories:[]
}

var database = {
    users:[],
    scrores:[],
    settings:{},
    questions:[],
    categories:[]

}

var currentGame={
    category:{

    },
    score:{

    },
    questions:[]
}