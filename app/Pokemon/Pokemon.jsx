import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker, Image } from 'react-native';

const Pokemon = () => {
  const [pokemon, setPokemon] = useState('');
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState(null);

  useEffect(() => {
    // Fetch types on load
    fetch('https://pokeapi.co/api/v2/type')
      .then(response => response.json())
      .then(data => setPokemonTypes(data.results))
      .catch(error => console.log('Error fetching Pokémon types:', error));

    // Fetch full Pokémon list
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => setFilteredPokemons(data.results))
      .catch(error => console.log('Error fetching Pokémon list:', error));
  }, []);

  useEffect(() => {
    if (selectedType) {
      // Filter Pokémon by type
      fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
        .then(response => response.json())
        .then(data => {
          const pokemonOfType = data.pokemon.map(p => p.pokemon);
          setFilteredPokemons(pokemonOfType);
        })
        .catch(error => console.log('Error fetching Pokémon by type:', error));
    } else {
      // Reset to full Pokémon list
      fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => response.json())
        .then(data => setFilteredPokemons(data.results))
        .catch(error => console.log('Error fetching Pokémon list:', error));
    }
  }, [selectedType]);

  useEffect(() => {
    if (pokemon) {
      // Fetch Pokémon details when one is selected
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        .then(response => response.json())
        .then(data => setPokemonDetails(data))
        .catch(error => console.log('Error fetching Pokémon details:', error));
    }
  }, [pokemon]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Selecione o Tipo e o Pokémon</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={selectedType}
            onValueChange={itemValue => setSelectedType(itemValue)}
          >
            <Picker.Item label="Todos os Tipos" value="" />
            {pokemonTypes.map(type => (
              <Picker.Item key={type.name} label={type.name} value={type.name} />
            ))}
          </Picker>

          <Picker
            style={styles.picker}
            selectedValue={pokemon}
            onValueChange={itemValue => setPokemon(itemValue)}
          >
            <Picker.Item label="Selecione o Pokémon" value="" />
            {filteredPokemons.map((item, index) => (
              <Picker.Item key={index} label={item.name} value={item.name} />
            ))}
          </Picker>
        </View>

        {pokemon && pokemonDetails && (
          <View style={styles.detailsContainer}>
            <Text style={styles.pokemonName}>Você selecionou {pokemon}</Text>
            <Image
              style={styles.pokemonImage}
              source={{ uri: pokemonDetails.sprites.front_default }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0000FF', // Fundo azul
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  pickerContainer: {
    flexDirection: 'row', // Coloca os Pickers lado a lado
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  picker: {
    width: '48%', // Ocupa metade do espaço disponível
    height: 50,
    borderRadius: 10,
  },
  detailsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  pokemonImage: {
    width: 150,
    height: 150,
    marginTop: 10,
  },
});

export default Pokemon;
