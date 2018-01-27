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
	var data = {
		username: $('#username').val(),
		country:$('#country').val()
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
			currentGame.questions = data.data;
			$("#timerWrapperDiv").html('')
			$("#gameCategoryTitle").html('<b><span style="color:#'+generateColor()+'">ACTIVE: '+currentGame.category.name+'</label></b>')
			var message = 'You have ' + abbrevi8.settings.difficulty.timer +' seconds to provide the full meaning of each acronyms!. Ready??';			
			swal(message,'Click OK to Begin','info')
				.then((value) => {
					$("#timerWrapperDiv").append(`
						<div class="gameTimer" data-timer="${abbrevi8.settings.difficulty.timer}" style="height: 120px;width: 200px;"></div>
					`)
					$(".gameTimer").TimeCircles({
						start: true,
						time: 4000,
						animation_interval: "smooth",
						circle_bg_color: '#' + generateColor(),
						direction: "Counter-clockwise",
						count_past_zero: false,
						time: {
							Days: { show: false },
							Hours: { show: false },
							Minutes: { show: true },
							Seconds: { show: true, color: '#' + generateColor() }
						}
					}); 
					
					showQuestion(-1);
				});
			
		} catch (error) {
			showMessage('Apologies. We we encountered a error while completing your request :(', 'error')
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
	id = id +1;
	currentGame.questions = shuffle(currentGame.questions);
	currentGame.currentQuestion = currentGame.questions[id];
	$('#question').html(`
		<big class='w3-jumbo w3-animate-fading' style='color:#${generateColor()}!important'>
		<b>${currentGame.currentQuestion.question}?</b>
		</big>
	`)
	console.log(currentGame.currentQuestion)
	return false;
	
	$('#').html()
	$('#').html()
	$('#').html()
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
/* 
///////////// Beware!!!!!!!



*/