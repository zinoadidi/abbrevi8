$(document).ready(function(){
	setTimeout(() => {
		checkUser();
	}, 2000);
});

function checkUser(){
	if(localStorage.active){
		abbrevi8.user = JSON.parse(localStorage.userInfo);		
		loadPage('menu');
	}else{
		loadPage('welcome');
	}
}

function initWelcomePage(params) {
	stopLoad();
}

function stopLoad() {
	$(".loadingbar").hide();
	$("#loadingbar").hide();
	$("#loadingbarr").hide();
	$("#loader").hide();
	$(".showAjaxLoad").removeClass('w3-animate-fading');
}

function startLoad() {
	$(".loadingbar").show();
	$("#loadingbarr").show();
	$("#loader").show();
	$(".showAjaxLoad").addClass('w3-animate-fading');
}

function storeUserInfo(){
	var date = new Date();
	var data = {
		username: $('#username').val(),
		country: $('#country').val(),
		date: date.toDateString()
	}
	if(validateObj(data)){
		var result = DB(data, 'addUser');
		console.log(result)
		if (result.status) { 
			showMessage(result.message, 'success');
			localStorage.userInfo = JSON.stringify(result.data)
			abbrevi8.user = JSON.parse(localStorage.userInfo);
			localStorage.active = true;
			loadPage('menu');

		}else { showMessage(result.message, 'warn') }
	}else{
		return false
	}
}

function generateColor(length) {
	length = 6;
	var chars = 'fbaced0099', result = '';
	for (var i = length; i > 0; --i)
		result += chars[Math.round(Math.random() * (chars.length - 1))]
	return result;
}

function loadGame(data,id){
	if (data) {
		stopLoad()
		try {
			data = JSON.parse(data);
			database.questions = data.data			
			currentGame.questions = data.data;
			$("#timerWrapperDiv").html('')
			$("#gameCategoryTitle").html('<b><span style="color:#e90aec">CATEGORY: '+currentGame.category.name+'</label></b>')
			var message = 'You have ' + abbrevi8.settings.difficulty.timer +' seconds to provide the meaning of each acronym!. Ready??';			
			swal(message,'Click OK to Begin','info')
				.then((value) => {
					currentGame.questions = shuffle(currentGame.questions);
					showQuestion(-1);
				});
			
		} catch (error) {
			showMessage('Apologies. We we encountered a error while completing your request :(', 'error')
			loadPage('menu')
			console.log(error)
		}
	} else {
		startLoad();
		loadPage('game');
		currentGame.category = abbrevi8.categories[id];
		getRequest({ url: 'questions/' + abbrevi8.categories[id].id + '.json', callBack: 'loadGame' })
	}
	
}

function showQuestion(id) {
	try {
		if (id) { id = id + 1 } else { id = currentGame.questionAnswered +1; };
			currentGame.currentQuestion = currentGame.questions[id];
			$('#question').html(`
			<big class='w3-jumbo w3-animate-fading' style='color:#${generateColor()}!important'>
			<b>${currentGame.currentQuestion.question}?</b>
			</big>
		`)
			$('#submitButton').html('Skip >>')
			$("#timerWrapperDiv").html(`
			<div class="gameTimer" data-timer="${abbrevi8.settings.difficulty.timer}" style="height: 100px;width: 80px;"></div>
		`)
		$(".gameTimer").TimeCircles({
			start: true,
			animation_interval: "smooth",
			circle_bg_color: '#090c0f',
			direction: "Counter-clockwise",
			count_past_zero: false,
			time: {
				Days: { show: false },
				Hours: { show: false },
				Minutes: { show: false },
				Seconds: { show: true, color: '#' + generateColor() }
			}
		});
		$(".gameTimer").TimeCircles().addListener(function (unit, value, total) {
			if (total <= 0) submitAnswer('timer');
		});
	} catch (error) {
		showMessage('Apologies. We we encountered a error while completing your request :(', 'error')
		loadPage('menu')
		console.log(error)
	}
	
	return false;
	
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function submitAnswer(type){
	currentGame.questionAnswered+=1;
	var answer = $('#answer').val()
	if (answer.toLowerCase() == currentGame.currentQuestion.answer.toLowerCase()){
		if(type =='submit'){
			currentGame.score += abbrevi8.settings.difficulty.level + 2;
		}else if(type=='timer'){
			currentGame.score += abbrevi8.settings.difficulty.level + 1;
		}
		currentGame.correctAnswers ++;
	}else{
		if (type == 'submit' && currentGame.score>1) {
			currentGame.score -=1;
		} else if (type == 'timer' && currentGame.score > abbrevi8.settings.difficulty.level) {
			currentGame.score -= abbrevi8.settings.difficulty.level;
		}
	}
	$('#scoreDisplayTitle').html(currentGame.score)
	$('#answer').val('')
	if(currentGame.questionAnswered>=abbrevi8.settings.difficulty.questions){
		if(currentGame.correctAnswers > (currentGame.questionAnswered/2)){
			levelUp()			
		}else{
			endGame()
		}
	}else{
		showQuestion()
	}
	
}

function endGame(){
	var status ='';
	var leaderboard =DB({'score':currentGame.score,'userId':abbrevi8.user.id,'level':abbrevi8.settings.difficulty.level},'addScore')
	
	if(abbrevi8.settings.difficulty.level>=9){
		status = 'success';
	}else{
		status = 'error';
	}
	var message = 'Game Over!. You Scored ' + currentGame.score + ' and got to Level ' + abbrevi8.settings.difficulty.level;
	//var msg2 = 'You are currently number ' + leaderboard + ' on the leaderboard.';
	var msg2 = 'click ok to continue';
	swal(message, msg2, status)
	.then((value) => {
		
	});
	abbrevi8.settings.difficulty.level = 1;
	abbrevi8.settings.difficulty.timer = 60;
	abbrevi8.settings.difficulty.questions = 10;
	currentGame.questionAnswered = 0;
	currentGame.correctAnswers = 0;
	currentGame.score = 0;
	$(".gameTimer").TimeCircles().stop();
	loadPage('menu')
	return false;
}

function levelUp(){
	if(abbrevi8.settings.difficulty.level >=11){
		endGame();
		return false;
	}else{
		abbrevi8.settings.difficulty.level++;
		abbrevi8.settings.difficulty.timer -= 5;
		abbrevi8.settings.difficulty.questions += 3;
		currentGame.questionAnswered = 0;
		currentGame.correctAnswers=0;
	}
	var message = 'Level Up!. You now have ' + abbrevi8.settings.difficulty.timer + ' seconds to provide the meaning of each acronym!. Ready??';
	swal(message, 'Click OK to Continue', 'success')
	.then((value) => {
		currentGame.questions = shuffle(currentGame.questions);
		showQuestion(-1);
	});

}
function checkInput(){
	$('#submitButton').html('Abbrevi8!');
	var answerStrenght = checkSimilarAns(currentGame.currentQuestion.answer,$('#answer').val())
	if(answerStrenght == null || answerStrenght == undefined || answerStrenght ==0){
		answerStrenght = 0
	}
	$('#answerStrenghtDiv').html(`
		<div class="w3-container w3-round" id="answerStrenght" style="width:${answerStrenght}%;height:3px;background:#d521f3">${answerStrenght}%</div>
	`)
}

function checkSimilarAns(a, b) {
	for (var i = 0, len = Math.max(a.length, b.length); i < len; i++)
		if (a.charAt(i) != b.charAt(i))
			return Math.round(i / len * 100);
}

function playAudio(option) {
	
	x.loop = "loop";
	//$('#audioDiv').append(x)
	x.play();
}

function leaderboardDisplay(){
	var scores = DB(null,'getScores');
	var users = DB(null, 'getUsers'); 
	try {
		$.each(scores, function (index, value) {
			
			var data = `  
				<li class='w3-medium' id=''><b>${value.score}</b>
				</li>
             `;
			$('#leaderboardDisplay').append(data);
		});
		abbrevi8.categories = data.data;
	} catch (error) {
		showMessage('Apologies. We we encountered a bug while completing your request :(', 'error')
		console.log(error)
	}
}




/////////////////////////////////////////////////////
///////////ABBREVI82D by Zino Adidi ////////////////
///////(C) ZSPS 2018. All Rights Reserved//////////
//////////Email: zinoadidi@gmail.com//////////////
/////////////Phone:2347055069014/////////////////
////////////////////////////////////////////////