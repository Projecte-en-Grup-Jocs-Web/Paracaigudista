document.getElementById('tornar').addEventListener('click', function () {
  window.location.href = 'menu.html';
});


var options = function(){
    const default_opcions = {
        difficulty:'normal',

    };

    var difficulty = $('#difficulty');

    var opcions = JSON.parse(localStorage.opcions||JSON.stringify(default_opcions));
        
    difficulty.on('change',()=>opcions.difficulty = difficulty.val());

    difficulty.val(opcions.difficulty);

    return { 
        applyChanges: function(){
            localStorage.opcions = JSON.stringify(opcions);
        },
        defaultValues: function(){
            opcions.difficulty = default_opcions.difficulty;
            difficulty.val(opcions.difficulty);
           
        }
    }
}();


document.getElementById('apply').addEventListener('click', function () {
    options.applyChanges();
    location.assign("../");
});

document.getElementById('default').addEventListener('click', function () {
    options.defaultValues();
});

document.getElementById('tornar').addEventListener('click', function () {
  window.location.href = 'menu.html';
});