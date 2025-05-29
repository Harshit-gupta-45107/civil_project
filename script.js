let storeyData = {};

function handleCalculation() {
    const length = parseFloat(document.getElementById('length').value);
    const breadth = parseFloat(document.getElementById('breadth').value);
    const totalArea = length * breadth;

    if (isNaN(length) || isNaN(breadth) || totalArea < 90 || totalArea > 200) {
        alert('Please enter valid length and breadth!');
        return;
    }

    const storeyType = document.getElementById('storeys').value;
    const numStoreys = storeyType === 'G' ? 1 : storeyType === 'G+1' ? 2 : 3;

    storeyData = {};
    let totalCost = 0;

    for (let i = 0; i < numStoreys; i++) {
        const storeyResults = calculateStoreyResults(i);
        if (storeyResults === null) {
            return; // Stop if validation fails
        }
        storeyData[i] = storeyResults;
        totalCost += storeyResults.totalCost;
    }

    displayResults();

    const resultsSection = document.querySelector('.results-section');
    resultsSection.classList.remove('hidden');

    setTimeout(() => {
        resultsSection.classList.add('visible');
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 50);
}

function calculateStoreyResults(index) {
    const length = parseFloat(document.getElementById('length').value);
    const breadth = parseFloat(document.getElementById('breadth').value);
    let floorArea = Number((length * breadth).toFixed(3));
    let perimeter = length + breadth;
    
    // Get custom dimensions if specified
    const useCustomDimensions = document.querySelector(`[name="custom-${index}"]:checked`)?.value === 'yes';
    let totalRoomArea = 0;
    let kitchenArea = 0;
    let totalWashroomArea = 0;
    let roomCount = 0;
    let washroomCount = 0;
    let roomAreas = [];
    let washroomAreas = [];
    let isOpenKitchen = false;

    if (useCustomDimensions) {
        // Validate room count
        const roomCountInput = document.querySelector(`#custom-inputs-${index} .room-count`);
        roomCount = parseInt(roomCountInput?.value) || 0;
        if (roomCount < 1 || roomCount > 3) {
            alert('Number of rooms must be between 1 and 3');
            return null;
        }

        // Validate washroom count
        const washroomCountInput = document.querySelector(`#custom-inputs-${index} .washroom-count`);
        washroomCount = parseInt(washroomCountInput?.value) || 0;
        if (washroomCount < 1 || washroomCount > 3) {
            alert('Number of washrooms must be between 1 and 3');
            return null;
        }

        // Calculate total room area and validate dimensions
        const roomInputs = document.querySelectorAll(`#custom-inputs-${index} .room-dimensions .dimension-group`);
        roomInputs.forEach(room => {
            const rLength = parseFloat(room.querySelector('input[placeholder="Length (m)"]').value);
            const rBreadth = parseFloat(room.querySelector('input[placeholder="Breadth (m)"]').value);
            
            if (rLength <= 0 || rBreadth <= 0) {
                alert('Room dimensions must be greater than 0');
                return null;
            }
            
            perimeter = perimeter + rBreadth + rLength;
            const area = rLength * rBreadth;
            totalRoomArea += area;
            roomAreas.push(area);
        });

        // Get and validate kitchen dimensions
        const kLength = parseFloat(document.querySelector(`#custom-inputs-${index} .kitchen-inputs input[placeholder="Length (m)"]`).value);
        const kBreadth = parseFloat(document.querySelector(`#custom-inputs-${index} .kitchen-inputs input[placeholder="Breadth (m)"]`).value);
        
        if (kLength <= 0 || kBreadth <= 0) {
            alert('Kitchen dimensions must be greater than 0');
            return null;
        }
        
        isOpenKitchen = document.querySelector(`#custom-inputs-${index} .kitchen-type-open`).checked;
        kitchenArea = kLength * kBreadth;
        perimeter = perimeter + kBreadth + kLength;

        // Calculate washroom areas and validate dimensions
        const washroomInputs = document.querySelectorAll(`#custom-inputs-${index} .washroom-dimensions .dimension-group`);
        washroomInputs.forEach(washroom => {
            const wLength = parseFloat(washroom.querySelector('input[placeholder="Length (m)"]').value);
            const wBreadth = parseFloat(washroom.querySelector('input[placeholder="Breadth (m)"]').value);
            
            if (wLength <= 0 || wBreadth <= 0) {
                alert('Washroom dimensions must be greater than 0');
                return null;
            }
            
            perimeter = perimeter + wLength + wBreadth;
            const area = wLength * wBreadth;
            totalWashroomArea += area;
            washroomAreas.push(area);
        });

        // Validate total area (must not exceed 75% of floor area)
        const totalUsedArea = totalRoomArea + kitchenArea + totalWashroomArea;
        const maxAllowedArea = floorArea * 0.75;
        if (totalUsedArea > maxAllowedArea) {
            alert(`Total constructed area (${totalUsedArea.toFixed(2)} m²) exceeds 75% of floor area (${maxAllowedArea.toFixed(2)} m²). Please adjust dimensions.`);
            return null;
        }

        // Update floor area based on custom dimensions
        perimeter = perimeter * 2;
    } else {
        // Default values when custom dimensions are not specified
        roomCount = 2; // Default 2 bedrooms
        const defaultRoomArea = Number((floorArea * 0.15).toFixed(3)); // 15% of total area for each bedroom
        roomAreas = [defaultRoomArea, defaultRoomArea];
        totalRoomArea = defaultRoomArea * 2;

        // Default kitchen
        kitchenArea = Number((floorArea * 0.09).toFixed(3)); // 9% of total area

        // Default washroom
        washroomCount = 2;
        const defaultWashroomArea = Number((floorArea * 0.04).toFixed(3)); // 4% of total area for each washroom
        washroomAreas = [defaultWashroomArea, defaultWashroomArea];
        totalWashroomArea = defaultWashroomArea * 2;

        perimeter = perimeter * 5; // Default perimeter calculation
    }

    // Floor-specific adjustments
    const columnNumber = Number(((length + breadth) / 4.0 + 2) * 3 - 3).toFixed(3);
    const slabVolume = Number((floorArea * 0.15).toFixed(3));
    let columnVolume;
    if(index == 0) {
        columnVolume = Number((0.3 * 0.3 * 4.3 * columnNumber).toFixed(3));
    } else {
        columnVolume = Number((0.3 * 0.3 * 3.0 * columnNumber).toFixed(3));
    }

    // Add additional concrete volume based on total number of floors
    const storeyType = document.getElementById('storeys').value;
    const totalFloors = storeyType === 'G' ? 1 : storeyType === 'G+1' ? 2 : 3;
    const additionalConcreteVolume = 2 * totalFloors;  // 2 units per floor
    
    const concreteVolume = Number((slabVolume + columnVolume + additionalConcreteVolume).toFixed(3));
    let mortarVolume;
    if(index == 0)
    mortarVolume = Number((perimeter * 3 * 0.13 + 0.5 * floorArea).toFixed(3))
    else
    mortarVolume = Number((perimeter * 3 * 0.13 + 0.05 * floorArea).toFixed(3));
    const fineVolume = Number((0.75 * mortarVolume + (1.5/5.5) * concreteVolume).toFixed(3));
    const coarseVolume = Number((3.0/5.5 * concreteVolume).toFixed(3));
    const cementVolume = Number((1.0/5.5 * concreteVolume + 0.25 * mortarVolume).toFixed(3));
    const cementBags = Math.ceil(cementVolume / 0.033);

    // Adjust brick calculations for each floor
    const brickArea = Number((0.19 * 0.009 * 0.009).toFixed(3));
    let bricks = Number((perimeter * 3 * 0.09) / 0.00154).toFixed(3);
    bricks = Number((bricks * 0.8).toFixed(3));
    const brickPrice = Number((bricks * 8).toFixed(3));
    const mortarPrice = Number((3454 * mortarVolume).toFixed(3));
    const brickWorkTotal = Number(brickPrice.toFixed(3));
    const electricalWork = Number((200 * floorArea).toFixed(3));
    const sanitaryWork = Number((600 * floorArea).toFixed(3));

    // Calculate costs based on actual dimensions and floor level
    const excavationCost = Number((1700 * (0.9 * 1.2 * perimeter)).toFixed(3));

    // Adjust door count based on kitchen type
    const doorCount = roomCount + washroomCount + (isOpenKitchen ? 0 : 1);

    const costs = {
        brickWork: brickWorkTotal,
        reinforcement: Math.ceil(68 * 0.015 * concreteVolume * 7850),
        labour: Math.ceil(2150 * floorArea),
        shuttering: Math.ceil(295 * floorArea),
        excavation: excavationCost,
        fine: Math.ceil(fineVolume * 1800),
        coarse: Math.ceil(coarseVolume * 2200),
        cement: Math.ceil(cementBags * 350),
        concrete: Math.ceil(fineVolume * 1800 + coarseVolume * 2200 + cementBags * 350),
        sanitaryWork: sanitaryWork,
        electricalWork: electricalWork
    };

    // Add damp proof cost for ground floor only
    if (index === 0) {
        costs.dampProofCost = Math.ceil(205 * 0.3 * 0.08 * perimeter);
    }

    return {
        floorLevel: ['Ground Floor', 'First Floor', 'Second Floor'][index],
        totalArea: floorArea,
        dimensions: {
            rooms: roomAreas,
            kitchen: kitchenArea,
            washrooms: washroomAreas
        },
        materials: {
            bricks: Math.ceil(bricks),
            concrete: Number(concreteVolume.toFixed(3)),
            cement: cementBags,
            fineAggregate: Number(fineVolume.toFixed(3)),
            coarseAggregate: Number(coarseVolume.toFixed(3))
        },
        costs: costs,
        totalCost: Object.entries(costs).reduce((total, [key, value]) => 
            key !== 'concrete' ? total + value : total, 0)
    };
}

function displayResults() {
    const container = document.getElementById('storeyResults');
    container.innerHTML = '';

    let totalProjectCost = 0;
    Object.keys(storeyData).forEach(index => {
        totalProjectCost += storeyData[index].totalCost;
        container.appendChild(createStoreyResultsSection(index));
    });

    // Add Total Project Cost section with notes
    const totalCostDiv = document.createElement('div');
    totalCostDiv.className = 'total-project-cost';
    totalCostDiv.innerHTML = `
        <h2>Total Cost of Project</h2>
        <p class="result-line">Total Project Cost = <b>${totalProjectCost.toLocaleString()}</b> Rs.</p>
        <div class="notes" style="margin-top: 20px; font-style: italic; color: #666;">
            <p>* Excluding all taxes</p>
            <p>* All calculations as per NBC, DSR</p>
        </div>
    `;
    container.appendChild(totalCostDiv);

    updateTotalCostChart();
}

function createStoreyResultsSection(index) {
    const storey = storeyData[index];
    const div = document.createElement('div');
    div.className = 'storey-results';
    
    // Check if custom dimensions are being used
    const useCustomDimensions = document.querySelector(`[name="custom-${index}"]:checked`)?.value === 'yes';

    div.innerHTML = `
        <h2>${storey.floorLevel} Results</h2>
        <div class="results-grid">
            <div class="results-left">
                <p class="result-line">Area of Plot = <b>${Math.ceil(storey.totalArea)}</b> m²</p>

                ${(!useCustomDimensions) ? `
                <h3>Area Distribution</h3>
                <p class="result-line">Living Room Area = <b>${Math.ceil(storey.totalArea * 0.175)}</b> m²</p>
                <p class="result-line">Bedroom Area = <b>${Math.ceil(storey.totalArea * 0.275)}</b> m²</p>
                <p class="result-line">Kitchen Area = <b>${Math.ceil(storey.dimensions.kitchen)}</b> m²</p>
                <p class="result-line">Dining Room Area = <b>${Math.ceil(storey.totalArea * 0.06)}</b> m²</p>
                <p class="result-line">Corridor Area = <b>${Math.ceil(storey.totalArea * 0.06)}</b> m²</p>
                <p class="result-line">Veranda Area = <b>${Math.ceil(storey.totalArea * 0.05)}</b> m²</p>
                <p class="result-line">Storage Room Area = <b>${Math.ceil(storey.totalArea * 0.03)}</b> m²</p>
                <p class="result-line">Parking Area = <b>${Math.ceil(storey.totalArea * 0.05)}</b> m²</p>
                ` : ''}

                <h3>BRICKWORK</h3>
                <p class="result-line">Number of Bricks = <b>${storey.materials.bricks}</b></p>
                <p class="result-line">Total cost of bricks = <b>${storey.costs.brickWork}</b> Rs.</p>

                <h3>CONCRETE</h3>
                <p class="result-line">Volume of Concrete = <b>${storey.materials.concrete}</b> m³</p>
                <p class="result-line">Volume of fine aggregate = <b>${storey.materials.fineAggregate}</b> m³</p>
                <p class="result-line">Volume of coarse aggregate = <b>${storey.materials.coarseAggregate}</b> m³</p>
                <p class="result-line">Number of cement bags = <b>${storey.materials.cement}</b></p>
                <p class="result-line">Cost of fine aggregate = <b>${storey.costs.fine}</b> Rs.</p>
                <p class="result-line">Cost of coarse aggregate = <b>${storey.costs.coarse}</b> Rs.</p>
                <p class="result-line">Cost of cement bags = <b>${storey.costs.cement}</b> Rs.</p>
                <p class="result-line">Cost of concrete = <b>${storey.costs.concrete}</b> Rs.</p>
            </div>
            
            <div class="results-right">
                <h3>REINFORCEMENT</h3>
                <p class="result-line">Weight of reinforcement = <b>${Math.ceil(0.015 * storey.materials.concrete * 7850)}</b> kg</p>
                <p class="result-line">Cost of reinforcement = <b>${storey.costs.reinforcement}</b> Rs.</p>

                <h3>DOORS</h3>
                <p class="result-line">Number of doors provided = <b>${storey.dimensions.rooms.length + storey.dimensions.washrooms.length + 1}</b></p>
                
                <h3>WINDOWS</h3>
                <p class="result-line">Number of windows provided = <b>${(storey.dimensions.rooms.length + storey.dimensions.washrooms.length + 1)}</b></p>

                <h3>LABOUR</h3>
                <p class="result-line">Labour Cost = <b>${storey.costs.labour}</b> Rs.</p>

                <h3>SHUTTERING</h3>
                <p class="result-line">Shuttering Cost = <b>${storey.costs.shuttering}</b> Rs.</p>

                ${index == 0 ? `
                <h3>EXCAVATION</h3>
                <p class="result-line">Excavation Cost = <b>${storey.costs.excavation}</b> Rs.</p>
                `: ''}

                ${index == 0 ? `
                <h3>DAMP PROOF</h3>
                <p class="result-line">Damp Proof Cost = <b>${storey.costs.dampProofCost}</b> Rs.</p>
                ` : ''}

                <h3>TOTAL</h3>
                <p class="result-line">Total Floor Cost = <b>${storey.totalCost.toFixed(3)}</b> Rs.</p>
            </div>
        </div>
    `;
    return div;
}

function updateTotalCostChart() {
    const totalCosts = {
        brickWork: 0,
        reinforcement: 0,
        labour: 0,
        shuttering: 0,
        excavation: 0,
        fine: 0,
        coarse: 0,
        concrete: 0,
        sanitaryWork: 0,
        electricalWork: 0,
        dampProofCost: 0
    };

    // Sum up costs from all storeys
    Object.values(storeyData).forEach(storey => {
        Object.entries(storey.costs).forEach(([key, value]) => {
            totalCosts[key] += value;
        });
    });

    createCostChart(totalCosts);
}

let costChart = null;

function createCostChart(costs) {
    const ctx = document.getElementById('costChart').getContext('2d');

    if (costChart) {
        costChart.destroy();
    }

    costChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'Brickwork',
                'Reinforcement',
                'Labour',
                'Shuttering',
                'Excavation',
                'Fine Aggregate',
                'Coarse Aggregate',
                'Concrete'
                // 'Sanitary Work',
                // 'Electrical Work',
                // 'Damp Proof'
            ],
            datasets: [{
                data: [
                    costs.brickWork,
                    costs.reinforcement,
                    costs.labour,
                    costs.shuttering,
                    costs.excavation,
                    costs.fine,
                    costs.coarse,
                    costs.concrete,
                    // costs.sanitaryWork,
                    // costs.electricalWork,
                    // costs.dampProofCost
                ],
                backgroundColor: [
                    '#FF6384',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#7CBA3B',
                    '#D3D3D3',
                    '#36A2EB',
                    // '#90EE90',
                    // '#FFB6C1',
                    // '#DDA0DD'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 16
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 16
                    },
                    bodyFont: {
                        size: 14
                    },
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b);
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: Rs. ${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000
            }
        }
    });
}

document.getElementById('calculate').addEventListener('click', handleCalculation);

document.getElementById('calcForm').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleCalculation();
    }
});

window.addEventListener('resize', () => {
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection.classList.contains('visible')) {
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

document.getElementById('storeys').addEventListener('change', function (e) {
    createStoreyInputs(e.target.value);
});

function createStoreyInputs(storeyType) {
    const container = document.getElementById('storeyInputs');
    container.innerHTML = '';

    const numStoreys = storeyType === 'G' ? 1 : storeyType === 'G+1' ? 2 : 3;
    const storeyNames = ['Ground Floor', 'First Floor', 'Second Floor'];

    for (let i = 0; i < numStoreys; i++) {
        container.appendChild(createStoreyForm(storeyNames[i], i));
    }
}

function createStoreyForm(name, index) {
    const div = document.createElement('div');
    div.className = 'storey-details';
    
    div.innerHTML = `
        <h3>${name}</h3>
        <div class="custom-dimensions-toggle">
            <label>Specify Custom Dimensions:</label>
            <input type="radio" name="custom-${index}" value="yes"> Yes
            <input type="radio" name="custom-${index}" value="no" checked> No
        </div>
        <div id="custom-inputs-${index}" class="hidden">
            <div class="room-inputs">
                <label>Number of Rooms (1-3):</label>
                <input type="number" class="room-count" min="1" max="3" required>
                <div class="room-dimensions"></div>
            </div>
            <div class="kitchen-inputs">
                <label>Kitchen Dimensions:</label>
                <div class="dimension-group">
                    <input type="number" placeholder="Length (m)" step="0.01" min="0.1" required>
                    <input type="number" placeholder="Breadth (m)" step="0.01" min="0.1" required>
                </div>
                <div class="kitchen-type">
                    <label>Kitchen Type:</label>
                    <input type="radio" name="kitchen-type-${index}" class="kitchen-type-closed" value="closed" checked> Closed
                    <input type="radio" name="kitchen-type-${index}" class="kitchen-type-open" value="open"> Open
                </div>
            </div>
            <div class="washroom-inputs">
                <label>Number of Washrooms (1-3):</label>
                <input type="number" class="washroom-count" min="1" max="3" required>
                <div class="washroom-dimensions"></div>
            </div>
        </div>
    `;
    return div;
}

// Update the room count event listener
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('room-count')) {
        const parentDiv = e.target.closest('.room-inputs');
        const dimensionsDiv = parentDiv.querySelector('.room-dimensions');
        const count = parseInt(e.target.value) || 0;
        dimensionsDiv.innerHTML = '';
        
        for(let i = 0; i < count; i++) {
            const roomGroup = document.createElement('div');
            roomGroup.className = 'dimension-group';
            roomGroup.innerHTML = `
                <input type="number" placeholder="Length (m)" step="0.01" min="0">
                <input type="number" placeholder="Breadth (m)" step="0.01" min="0">
            `;
            dimensionsDiv.appendChild(roomGroup);
        }
    }
    
    if (e.target.classList.contains('washroom-count')) {
        const parentDiv = e.target.closest('.washroom-inputs');
        const dimensionsDiv = parentDiv.querySelector('.washroom-dimensions');
        const count = parseInt(e.target.value) || 0;
        dimensionsDiv.innerHTML = '';
        
        for(let i = 0; i < count; i++) {
            const washroomGroup = document.createElement('div');
            washroomGroup.className = 'dimension-group';
            washroomGroup.innerHTML = `
                <input type="number" placeholder="Length (m)" step="0.01" min="0">
                <input type="number" placeholder="Breadth (m)" step="0.01" min="0">
            `;
            dimensionsDiv.appendChild(washroomGroup);
        }
    }
});

// Add event listener for custom dimensions toggle
document.addEventListener('change', function(e) {
    if (e.target.name && e.target.name.startsWith('custom-')) {
        const index = e.target.name.split('-')[1];
        const customInputs = document.getElementById(`custom-inputs-${index}`);
        customInputs.classList.toggle('hidden', e.target.value === 'no');
    }
});
