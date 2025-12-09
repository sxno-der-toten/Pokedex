const pokemonGrid = document.getElementById('pokemonGrid');
        const loadingElement = document.getElementById('loading');
        const errorElement = document.getElementById('error');
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        const pokemonCount = document.getElementById('pokemonCount');
        const displayedCount = document.getElementById('displayedCount');
        const totalCount = document.getElementById('totalCount');
        
        let allPokemon = [];
        let filteredPokemon = [];
        let displayedPokemon = 0;
        const POKEMON_PER_PAGE = 30; // Afficher 30 Pokémon à la fois
        
        // Fonction pour récupérer les données de l'API
        async function fetchPokemonData() {
            try {
                console.log('Début du chargement des Pokémon...');
                
                const response = await fetch('https://pokebuildapi.fr/api/v1/pokemon');
                
                console.log('Réponse reçue:', response.status);
                
                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Données reçues:', data.length, 'Pokémon');
                
                allPokemon = data;
                filteredPokemon = data;
                loadingElement.style.display = 'none';
                
                // Afficher les premiers Pokémon
                displayMorePokemon();
                
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                loadingElement.style.display = 'none';
                errorElement.textContent = `Erreur lors du chargement des Pokémon: ${error.message}. Veuillez réessayer plus tard.`;
                errorElement.style.display = 'block';
            }
        }
        
        // Fonction pour afficher plus de Pokémon
        function displayMorePokemon() {
            const startIndex = displayedPokemon;
            const endIndex = Math.min(displayedPokemon + POKEMON_PER_PAGE, filteredPokemon.length);
            
            const pokemonToDisplay = filteredPokemon.slice(startIndex, endIndex);
            
            pokemonToDisplay.forEach(pokemon => {
                const typeBadges = pokemon.apiTypes.map(type => {
                    const typeColor = getTypeColor(type.name);
                    return `<span class="type-badge me-1" style="background-color: ${typeColor}">${type.name}</span>`;
                }).join('');
                
                const pokemonCard = document.createElement('div');
                pokemonCard.className = 'col-md-4';
                pokemonCard.innerHTML = `
                    <div class="card h-100 pokemon-card shadow-sm">
                        <div class="text-center bg-light">
                            <img src="${pokemon.image}" alt="${pokemon.name}" class="pokemon-image" loading="lazy">
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
                `;
                
                pokemonGrid.appendChild(pokemonCard);
            });
            
            displayedPokemon = endIndex;
            
            // Mettre à jour le compteur
            displayedCount.textContent = displayedPokemon;
            totalCount.textContent = filteredPokemon.length;
            pokemonCount.style.display = 'block';
            
            // Afficher/cacher le bouton "Charger plus"
            if (displayedPokemon < filteredPokemon.length) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }
        
        // Fonction pour réinitialiser l'affichage
        function resetDisplay() {
            pokemonGrid.innerHTML = '';
            displayedPokemon = 0;
            
            if (filteredPokemon.length === 0) {
                pokemonGrid.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning text-center">
                            Aucun Pokémon trouvé avec ces critères de recherche.
                        </div>
                    </div>
                `;
                pokemonCount.style.display = 'none';
                loadMoreContainer.style.display = 'none';
            } else {
                displayMorePokemon();
            }
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
            
            filteredPokemon = allPokemon.filter(pokemon => {
                const nameMatch = pokemon.name.toLowerCase().includes(searchTerm);
                const typeMatch = selectedType === '' || 
                    pokemon.apiTypes.some(type => type.name === selectedType);
                
                return nameMatch && typeMatch;
            });
            
            resetDisplay();
        }
        
        // Événements pour les filtres
        searchInput.addEventListener('input', filterPokemon);
        typeFilter.addEventListener('change', filterPokemon);
        
        // Événement pour le bouton "Charger plus"
        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            displayMorePokemon();
        });
        
        // Charger les données au démarrage
        fetchPokemonData();
        