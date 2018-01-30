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
            $('#categoryMenuList').html(`
            <div class='w3-col s6 m4 l3 w3-animate-zoom w3-ripple' id='menuBtn' onclick='loadPage("menu")'>
            <div class='w3-card w3-hover-border w3-round catOption w3-margin' style='background:#${generateColor()}'>
                    <div class='w3-large textShadow' style="color:#302626!important;"><b>GAME MENU</b></div>
                </div>
            </div>
            `);
            var counter = 0;
            $.each(data.data, function (index, value) {
                var background = generateColor();
                $('#categoryMenuList').append(`
                <div class='w3-col s6 m4 l3 w3-animate-zoom w3-ripple' id='${index}' onclick='loadGame(null,this.id)'>
				<div class='w3-card w3-hover-border w3-round catOption w3-margin' style='background:#${background}'>
                        <div class='w3-large textShadow' style="color:#302626!important"><b>${value.name}</b></div>
                    </div>
                </div>
                `);
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
