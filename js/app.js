import './vendor/jquery-3.7.1.min.js';
import PriorityQueue from "./priorityQueue.js";

let pokedex = await $.getJSON('pokemon.json');

// function init() {
//   let maxTotal = 0, minTotal = 2000;
//   for (const pokemon of pokedex) {
//     if (pokemon.stats.total > maxTotal) {
//       maxTotal = pokemon.stats.total;
//     }
//     if (pokemon.stats.total < minTotal) {
//       minTotal = pokemon.stats.total;
//     }
//   }
//   $('#total').attr('min', minTotal).attr('max', maxTotal);
// }

function calcMyStats() {
  // calculate your stat total
  let total = parseInt($('#total').val());
  let hp = parseInt($('#hp').val());
  let attack = parseInt($('#attack').val());
  let defense = parseInt($('#defense').val());
  let specialAttack = parseInt($('#special-attack').val());
  let specialDefense = parseInt($('#special-defense').val());
  let speed = parseInt($('#speed').val());
  let selectedTotal = hp + attack + defense + specialAttack + specialDefense + speed;
  let totalRatio = total / parseFloat(selectedTotal);
  return {
    hp: Math.round(hp * totalRatio),
    attack: Math.round(attack * totalRatio),
    defense: Math.round(defense * totalRatio),
    specialAttack: Math.round(specialAttack * totalRatio),
    specialDefense: Math.round(specialDefense * totalRatio),
    speed: Math.round(speed * totalRatio),
    total,
  }
}

function buildPokemonCard(pokemon) {
  let template = $($('#result-template').html());
  let cssWidth = 'calc(stat/255 * 100%)';
  $('.name', template).text(pokemon.names.en);
  $('img', template).attr('src', pokemon.officalArtwork).attr('alt', pokemon.name);
  $('.stat-number.hp .stat-value', template).text(pokemon.stats.hp);
  $('.hp .stat-bar-inner', template).css('width', cssWidth.replace('stat', pokemon.stats.hp));
  $('.stat-number.attack .stat-value', template).text(pokemon.stats.attack);
  $('.attack .stat-bar-inner', template).css('width', cssWidth.replace('stat', pokemon.stats.attack));
  $('.stat-number.defense .stat-value', template).text(pokemon.stats.defense);
  $('.defense .stat-bar-inner', template).css('width', cssWidth.replace('stat', pokemon.stats.defense));
  $('.stat-number.special-attack .stat-value', template).text(pokemon.stats['special-attack']);
  $('.special-attack .stat-bar-inner', template).css('width', cssWidth.replace('stat', pokemon.stats['special-attack']));
  $('.stat-number.special-defense .stat-value', template).text(pokemon.stats['special-defense']);
  $('.special-defense .stat-bar-inner', template).css('width', cssWidth.replace('stat', pokemon.stats['special-defense']));
  $('.stat-number.speed .stat-value', template).text(pokemon.stats.speed);
  $('.speed .stat-bar-inner', template).css('width', cssWidth.replace('stat', pokemon.stats.speed));
  return template;
}

$('#howami').click(() => {
  let stats = calcMyStats();

  // check pokemon and calculate error
  let matchingList = new PriorityQueue();
  for (const pokemon of pokedex) {
    let error = 0;
    error += Math.abs(pokemon.stats.hp - stats.hp);
    error += Math.abs(pokemon.stats.attack - stats.attack);
    error += Math.abs(pokemon.stats.defense - stats.defense);
    error += Math.abs(pokemon.stats['special-attack'] - stats.specialAttack);
    error += Math.abs(pokemon.stats['special-defense'] - stats.specialDefense);
    error += Math.abs(pokemon.stats.speed - stats.speed);
    matchingList.enqueue(pokemon, error);
  }

  $('#main-result, #other-results').empty();
  let mainResult = matchingList.dequeue().node;
  $('#main-result').append(buildPokemonCard(mainResult));
  for (let step = 0; step < 5; step++) {
    let result = matchingList.dequeue().node;
    $('#other-results').append(buildPokemonCard(result))
  }
  $('#results').show();
});

$('input[type=range]').on('input', function () {
  let stats = calcMyStats();
  $('.selected-stat-value.total').text(stats.total);
  $('.selected-stat-value.hp').text(stats.hp);
  $('.selected-stat-value.attack').text(stats.attack);
  $('.selected-stat-value.defense').text(stats.defense);
  $('.selected-stat-value.special-attack').text(stats.specialAttack);
  $('.selected-stat-value.special-defense').text(stats.specialDefense);
  $('.selected-stat-value.speed').text(stats.speed);
}).trigger('input');
