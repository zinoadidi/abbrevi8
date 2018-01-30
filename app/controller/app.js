$(document).ready(function(){
	$('.emoji_class').hide()	
	setTimeout(() => {
		$('.emoji_class').hide()			
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
			$("#timer").html(abbrevi8.settings.difficulty.timer)
			$("#gameCategoryTitle").html('<b><span style="color:#e90aec">CATEGORY: '+currentGame.category.name+'</label></b>')
			var message = 'You have ' + abbrevi8.settings.difficulty.timer +' seconds to provide the meaning of each acronym!. Ready??';			
			swal(message,'Click OK to Begin','info')
				.then((value) => {
					currentGame.questions = shuffle(currentGame.questions);
					showQuestion(-1);
					timer('start')
					stopLoad()
				});
			
		} catch (error) {
			showMessage('Apologies. We we encountered a error while completing your request :(', 'error')
			loadPage('menu')
			alert('them:' + error)
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
			//$('#question').show("slide", { direction: "left" }, 1000);
			$('#question').html(`
			<big class='w3-jumbo w3-animate-right' style='color:#${generateColor()}!important'>
			<b>${currentGame.currentQuestion.question}?</b>
			</big>
			`)
			$('#submitButton').html('Skip >>')
			timer('hook')
	} catch (error) {
		showMessage('Apologies. We we encountered a error while completing your request :(', 'error')
		loadPage('menu')
		alert('this:'+error)
		
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

function timer(option){
	switch (option) {
		case 'start':
			abbrevi8.settings.timer = abbrevi8.settings.difficulty.timer;
			timerHook = window.setInterval(timer, 1200);	
			break;		
		case 'stop':
			abbrevi8.settings.timer = 0;
			window.clearInterval(timerHook);
			break;
		case 'hook':
			abbrevi8.settings.timer = abbrevi8.settings.difficulty.timer;
			break;
		default:
			if (abbrevi8.settings.timer <= 0){
				submitAnswer('timer')
			}
			abbrevi8.settings.timer = abbrevi8.settings.timer -1;
			break;
	}
	$("#timerWrapperDiv").html(`
	<div class="w3-circle w3-white w3-animate-zoom" style="height: 80px;width: 80px;color:#${generateColor()};border:2px solid #${generateColor()}" >
	<div id="timer" style="position: relative; vertical-align: center; text-align: center;font-size: 50px!important;" class="">${abbrevi8.settings.timer}</div>
	</div>
	`);
}

function submitAnswer(type){
	currentGame.questionAnswered+=1;
	var answer = $('#answer').val()
	if (answer.toLowerCase() == currentGame.currentQuestion.answer.toLowerCase()){
		if(type =='submit'){
			showEmoji('thumbs-up')
			currentGame.score += abbrevi8.settings.difficulty.level + 2;
		}else if(type=='timer'){
			showEmoji('clapping')			
			currentGame.score += abbrevi8.settings.difficulty.level + 1;
		}
		currentGame.correctAnswers ++;
	}else{
		if(answerStrenght > 50){
			showEmoji('handshake')						
			currentGame.score += abbrevi8.settings.difficulty.level;			
		}else{
			if (type == 'submit' && currentGame.score > 1) {
				showEmoji('facepalm')										
				currentGame.score -= 1;
			} else if (type == 'timer' && currentGame.score > abbrevi8.settings.difficulty.level) {
				showEmoji('thumbs-down')														
				currentGame.score -= abbrevi8.settings.difficulty.level;
			}else{
				showEmoji('wtf-emoji')																		
			}
		}
	}
	$('#scoreDisplayTitle').html(currentGame.score)
	$('#answer').val('')
	if(currentGame.questionAnswered>=abbrevi8.settings.difficulty.questions){
		if(currentGame.correctAnswers > (currentGame.questionAnswered/2)){
			showEmoji('celebrate')														
			levelUp()			
		}else{
			showEmoji('cry-baby')																	
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
	timer('stop')
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
	answerStrenght = checkSimilarAns(currentGame.currentQuestion.answer,$('#answer').val())
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
		alert('that:' + error)
		
		console.log(error)
	}
}
function showEmoji(type){
	switch (type) {
		case 'thumbs-up':
			$('#'+type).fadeIn();
			break;
		case 'clapping':
			$('#' + type).fadeIn();			
			break;
		case 'handshake':
			$('#' + type).fadeIn();		
			break;
		case 'facepalm':
			$('#' + type).fadeIn();		
			break;
		case 'thumbs-down':
			$('#' + type).fadeIn();		
			break;
		case 'facepalm':
			$('#' + type).fadeIn();		
			break;
		case 'celebrate':
			$('#' + type).fadeIn();		
			break;
		case 'cry-baby':
			$('#' + type).fadeIn();		
			break;
		case 'wtf-emoji':
			$('#' + type).fadeIn();
			break;
		default:
			break;
	}
	console.log(type)
	$('#emojisDiv').show();
	setTimeout(hideEmoji,1200);
}

function hideEmoji() {
	$('.emoji_class').fadeOut();
}

/////////////////////////////////////////////////////
///////////ABBREVI82D by Zino Adidi ////////////////
///////(C) ZSPS 2018. All Rights Reserved//////////
//////////Email: zinoadidi@gmail.com//////////////
/////////////Phone:2347055069014/////////////////
////////////////////////////////////////////////