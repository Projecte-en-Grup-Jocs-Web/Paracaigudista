$(document).ready(function () {
  //dificultat estandar si localStorage buit
  const defaultOpcions = {
    difficulty: 'normal'
  };

  const $difficulty = $('#difficulty');

  let opcions = JSON.parse(localStorage.getItem('opcions') || JSON.stringify(defaultOpcions));

  $difficulty.val(opcions.difficulty);
  //canviem variable temporal
  $difficulty.on('change', function () {
    opcions.difficulty = $difficulty.val();
  });
  //actualitzem loacalStorage
  $('#apply').on('click', function () {
    localStorage.setItem('opcions', JSON.stringify(opcions));
    location.href = "../index.html";
  });
  //actualitzem  variable temporal
  $('#default').on('click', function () {
    opcions.difficulty = defaultOpcions.difficulty;
    $difficulty.val(opcions.difficulty);
  });
  //sortir opcions
  $('#tornar').on('click', function () {
    window.location.href = '../index.html';
  });
});
