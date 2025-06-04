
// Amaga menu mostra partida 
$('#BotoJugar').on('click', function () {
  $('#menu').hide();
  $('#game-container').show();
  startGame();
});


//redireccio a opcions
$('#BotoOpcions').on('click', function () {
  window.location.href = 'html/opcions.html';
});
