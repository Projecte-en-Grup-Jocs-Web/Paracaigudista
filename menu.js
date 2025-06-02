document.getElementById('BotoJugar').addEventListener('click', function() {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        startGame();
    });

document.getElementById('BotoOpcions').addEventListener('click', function() {
        window.location.href = 'opcions.html';
    });