loadCategories();
function showMenuDiv(id) {
    console.log(id)
    $('.menu-divs').hide();
    $('.' + id).show();
}
function loadCategories(data) {
    if (data) {
        stopLoad()
        try {
            data = JSON.parse(data);
            $('#categoryMenuList').html('');
            var counter = 0;
            $.each(data.data, function (index, value) {
                //counter = Math.floor((Math.random() * 9) + 1); 
                var background = generateColor();
                var data = `
                <div class='w3-col s6 m4 l3 w3-animate-zoom w3-ripple' id='${index}' onclick='loadGame(null,this.id)'>
				<div class='w3-card w3-hover-border w3-round catOption w3-margin' style='background:#${background}'>
                        <div class='w3-medium'><b>${value.name}</b></div>
                    </div>
                </div>
                `;
                $('#categoryMenuList').append(data);
            });
            abbrevi8.categories = data.data;
        } catch (error) {
            showMessage('Apologies. We we encountered a bug while completing your request :(', 'error')
            console.log(error)
        }
    } else {
        getRequest({ url: 'categories.json', callBack: 'loadCategories' })
    }
}
