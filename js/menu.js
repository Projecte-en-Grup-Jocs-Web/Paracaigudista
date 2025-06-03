$('#BotoJugar').on('click', function () {
  $('#menu').hide();
  $('#game-container').show();
  startGame();
});

$('#BotoOpcions').on('click', function () {
  window.location.href = 'html/opcions.html';
});
