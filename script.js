      document.addEventListener('DOMContentLoaded', function() {
            const pokemonGrid = document.getElementById('pokemonGrid');
            const loadingElement = document.getElementById('loading');
            const errorElement = document.getElementById('error');
            const searchInput = document.getElementById('searchInput');
            const typeFilter = document.getElementById('typeFilter');
            
            let allPokemon = [];
            
            // Fonction pour récupérer les données de l'API
            async function fetchPokemonData() {
                try {
                    const response = await fetch('https://pokebuildapi.fr/api/v1/pokemon');
                    
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    allPokemon = data;
                    displayPokemon(allPokemon);
                    loadingElement.style.display = 'none';
                    
                } catch (error) {
                    console.error('Erreur lors de la récupération des données:', error);
                    loadingElement.style.display = 'none';
                    errorElement.textContent = `Erreur lors du chargement des Pokémon: ${error.message}`;
                    errorElement.style.display = 'block';
                }
            }
            
            // Fonction pour afficher les Pokémon
            function displayPokemon(pokemonList) {
                pokemonGrid.innerHTML = '';
                
                if (pokemonList.length === 0) {
                    pokemonGrid.innerHTML = `
                        <div class="col-12">
                            <div class="alert alert-warning text-center">
                                Aucun Pokémon trouvé avec ces critères de recherche.
                            </div>
                        </div>
                    `;
                    return;
                }
                
                pokemonList.forEach(pokemon => {
                    // Créer les badges de type avec des couleurs appropriées
                    const typeBadges = pokemon.apiTypes.map(type => {
                        const typeColor = getTypeColor(type.name);
                        return `<span class="type-badge me-1" style="background-color: ${typeColor}">${type.name}</span>`;
                    }).join('');
                    
                    const pokemonCard = `
                        <div class="col-md-4">
                            <div class="card h-100 pokemon-card shadow-sm">
                                <div class="text-center bg-light">
                                    <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-image">
                                </div>
                                <div class="card-body text-center">
                                    <h5 class="card-title pokemon-name">${pokemon.name}</h5>
                                    <p class="card-text pokemon-id">#${pokemon.pokedexId}</p>
                                    <div class="mb-3">
                                        ${typeBadges}
                                    </div>
                                    <div class="row text-center">
                                        <div class="col-4">
                                            <div class="border-end">
                                                <div class="stat-value">${pokemon.stats.HP}</div>
                                                <small class="text-muted">PV</small>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="border-end">
                                                <div class="stat-value">${pokemon.stats.attack}</div>
                                                <small class="text-muted">Attaque</small>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div>
                                                <div class="stat-value">${pokemon.stats.defense}</div>
                                                <small class="text-muted">Défense</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    pokemonGrid.innerHTML += pokemonCard;
                });
            }
            
            // Fonction pour obtenir la couleur associée à un type de Pokémon
            function getTypeColor(type) {
                const typeColors = {
                    'Normal': '#A8A878',
                    'Feu': '#F08030',
                    'Eau': '#6890F0',
                    'Plante': '#78C850',
                    'Électrik': '#F8D030',
                    'Glace': '#98D8D8',
                    'Combat': '#C03028',
                    'Poison': '#A040A0',
                    'Sol': '#E0C068',
                    'Vol': '#A890F0',
                    'Psy': '#F85888',
                    'Insecte': '#A8B820',
                    'Roche': '#B8A038',
                    'Spectre': '#705898',
                    'Dragon': '#7038F8',
                    'Ténèbres': '#705848',
                    'Acier': '#B8B8D0',
                    'Fée': '#EE99AC'
                };
                
                return typeColors[type] || '#777';
            }
            
            // Fonction pour filtrer les Pokémon
            function filterPokemon() {
                const searchTerm = searchInput.value.toLowerCase();
                const selectedType = typeFilter.value;
                
                const filteredPokemon = allPokemon.filter(pokemon => {
                    const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);
                    const typeMatch = selectedType === '' || 
                        pokemon.apiTypes.some(type => type.name === selectedType);
                    
                    return nameMatch && typeMatch;
                });
                
                displayPokemon(filteredPokemon);
            }
            
            // Événements pour les filtres
            searchInput.addEventListener('input', filterPokemon);
            typeFilter.addEventListener('change', filterPokemon);
            
            // Charger les données au démarrage
            fetchPokemonData();
        });