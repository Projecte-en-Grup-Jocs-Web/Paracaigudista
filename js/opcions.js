$(document).ready(function () {
  const defaultOpcions = {
    difficulty: 'normal'
  };

  const $difficulty = $('#difficulty');

  let opcions = JSON.parse(localStorage.getItem('opcions') || JSON.stringify(defaultOpcions));

  $difficulty.val(opcions.difficulty);

  $difficulty.on('change', function () {
    opcions.difficulty = $difficulty.val();
  });

  $('#apply').on('click', function () {
    localStorage.setItem('opcions', JSON.stringify(opcions));
    location.href = "../index.html";
  });

  $('#default').on('click', function () {
    opcions.difficulty = defaultOpcions.difficulty;
    $difficulty.val(opcions.difficulty);
  });

  $('#tornar').on('click', function () {
    window.location.href = '../index.html';
  });
});
