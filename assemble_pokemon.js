import fs from 'node:fs';
import Pokedex from "pokedex-promise-v2";
const P = new Pokedex()

let pokemonList = await P.getPokemonsList();
let pokemons = [];

for (const listEntry of pokemonList.results) {
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
  pokemons.push({
    name,
    officalArtwork,
    stats
  });
}
fs.writeFile('./pokemon.json', JSON.stringify(pokemons), (err) => {});

console.log('beep');
