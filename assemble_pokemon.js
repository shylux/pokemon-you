import fs from 'node:fs';
import Pokedex from "pokedex-promise-v2";
import ProgressBar from 'progress';

const P = new Pokedex()

let pokemonList = await P.getPokemonsList();
let pokemons = [];

const progress = new ProgressBar(':bar :current/:total :elapsed ETA :eta', {total: pokemonList.results.length});
for (const listEntry of pokemonList.results) {
  progress.tick();
  let name = listEntry.name;
  let pokemonDetails = await P.getPokemonByName(name);
  let stats = {'hp': 0, 'attack': 0, 'defense': 0, 'special-attack': 0, 'special-defense': 0, 'speed': 0}
  let statTotal = 0;
  for (const stat of pokemonDetails.stats) {
    statTotal += stat.base_stat;
    stats[stat.stat.name] = stat.base_stat;
  }
  stats.total = statTotal;
  let officalArtwork = pokemonDetails.sprites.other["official-artwork"].front_default;

  let names = {};
  let speciesDetails = await P.getPokemonSpeciesByName(pokemonDetails.species.name);
  for (const speciesName of speciesDetails.names) {
    names[speciesName.language.name] = speciesName.name;
  }

  pokemons.push({
    name,
    officalArtwork,
    stats,
    names
  });
}
fs.writeFile('./pokemon.json', JSON.stringify(pokemons), (err) => {
});

console.log('beep');
