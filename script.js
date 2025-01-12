function handleCalculation() {
    const length = parseFloat(document.getElementById('length').value);
    const breadth = parseFloat(document.getElementById('breadth').value);
    const totalArea = length * breadth;
    
    if (isNaN(length) || isNaN(breadth) || totalArea < 93 || totalArea > 185) {
        alert('Please enter valid length and breadth!');
        return;
    }

    // Show results section with animations
    const resultsSection = document.querySelector('.results-section');
    resultsSection.classList.remove('hidden');
    
    updateResults(length, breadth, totalArea);
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.classList.add('visible');
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 50);
}

function updateResults(length, breadth, totalArea) {
    // All calculations moved here
    const perimeter = 2 * (length + breadth);
    const concretePrice = 3500;
    const brickArea = 0.2 * 0.1;
    const bricks = ((2 * perimeter * 3.35) - (0.3 * 0.3 * 12)) / brickArea;
    const brickPrice = bricks * 7;

    // Calculate areas
    const kitchenPercentage = 0.09 * totalArea;
    const bedroomPercentage = 0.275 * totalArea;
    const livingRoomPercentage = 0.175 * totalArea;
    const diningRoomPercentage = 0.06 * totalArea;
    const corridorPercentage = 0.06 * totalArea;
    const verandaPercentage = 0.05 * totalArea;
    const storageRoomPercentage = 0.03 * totalArea;
    const parkingPercentage = 0.05 * totalArea;


    // Update all DOM elements
    document.getElementById('totalArea').innerText = Math.ceil(totalArea);
    document.getElementById('livingRoom').innerText = Math.ceil(livingRoomPercentage);
    document.getElementById('bedroom').innerText = Math.ceil(bedroomPercentage);
    document.getElementById('kitchen').innerText = Math.ceil(kitchenPercentage);
    document.getElementById('diningRoom').innerText = Math.ceil(diningRoomPercentage);
    document.getElementById('corridor').innerText = Math.ceil(corridorPercentage);
    document.getElementById('veranda').innerText = Math.ceil(verandaPercentage);
    document.getElementById('storageRoom').innerText = Math.ceil(storageRoomPercentage);
    document.getElementById('parking').innerText = Math.ceil(parkingPercentage);

    // Rest of calculations
    const slabVolume = totalArea * 0.15;
    const concreteVolume = slabVolume + (0.3 * 0.3 * 4.57 * 12);
    const fineVolume = 1.42 * concreteVolume;
    const coarseVolume = 0.84 * concreteVolume;
    const cementBags = Math.ceil((concreteVolume + (2 * perimeter * 3.35 * 0.1 * 0.3)) * 8);

    const totalCost = 2150 * totalArea + 260 * totalArea + 5 * 5500 + 6 * 4000 + brickPrice + (3454 * 2 * perimeter * 3.35 * 0.1 * 0.3) + 
    (67 * 0.015 * concreteVolume * 7850) + (fineVolume * 1100 + coarseVolume * 1800 + cementBags * 350);

    document.getElementById('totalCost').innerText = Math.ceil(totalCost);


    // Update concrete related values
    document.getElementById('bricks').innerText = Math.ceil(bricks);
    document.getElementById('brickPrice').innerText = Math.ceil(brickPrice);
    document.getElementById('brickWork').innerText = Math.ceil(brickPrice + (3454 * 2 * perimeter * 3.35 * 0.1 * 0.3));
    document.getElementById('concreteVolume').innerText = Math.ceil(concreteVolume);
    document.getElementById('fineVolume').innerText = Math.ceil(fineVolume);
    document.getElementById('coarseVolume').innerText = Math.ceil(coarseVolume);
    document.getElementById('cement').innerText = cementBags;
    document.getElementById('fineCost').innerText = Math.ceil(fineVolume * 1100);
    document.getElementById('coarseCost').innerText = Math.ceil(coarseVolume * 1800);
    document.getElementById('cementCost').innerText = Math.ceil(cementBags * 350);
    document.getElementById('concreteCost').innerText = Math.ceil(fineVolume * 1100 + coarseVolume * 1800 + cementBags * 350);

    // Other elements
    document.getElementById('reinforcementWeight').innerText = Math.ceil(0.015 * concreteVolume * 7850);
    document.getElementById('reinforcementCost').innerText = Math.ceil(67 * 0.015 * concreteVolume * 7850);
    document.getElementById('doors').innerText = '5';
    document.getElementById('doorPrice').innerText = Math.ceil(5 * 5500);
    document.getElementById('windows').innerText = '6';
    document.getElementById('windowPrice').innerText = Math.ceil(6 * 4000);
    document.getElementById('labourPrice').innerText = Math.ceil(2150 * totalArea);
    document.getElementById('shutteringPrice').innerText = Math.ceil(260 * totalArea);

    const brickWorkTotal = Math.ceil(brickPrice + (3454 * 2 * perimeter * 3.35 * 0.1 * 0.3));
    const concreteTotal = Math.ceil(fineVolume * 1100 + coarseVolume * 1800 + cementBags * 350);
    const reinforcementTotal = Math.ceil(67 * 0.015 * concreteVolume * 7850);
    const doorsTotal = Math.ceil(5 * 5500);
    const windowsTotal = Math.ceil(6 * 4000);
    const labourTotal = Math.ceil(2150 * totalArea);
    const shutteringTotal = Math.ceil(260 * totalArea);

    // Create or update pie chart
    createCostChart({
        brickWork: brickWorkTotal,
        concrete: concreteTotal,
        reinforcement: reinforcementTotal,
        doors: doorsTotal,
        windows: windowsTotal,
        labour: labourTotal,
        shuttering: shutteringTotal
    });
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
                'Concrete',
                'Reinforcement',
                'Doors',
                'Windows',
                'Labour',
                'Shuttering'
            ],
            datasets: [{
                data: [
                    costs.brickWork,
                    costs.concrete,
                    costs.reinforcement,
                    costs.doors,
                    costs.windows,
                    costs.labour,
                    costs.shuttering
                ],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#7CBA3B'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Added this
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 16  // Increased font size
                        },
                        padding: 20  // Added padding
                    }
                },
                tooltip: {
                    titleFont: {
                        size: 16  // Increased title font size
                    },
                    bodyFont: {
                        size: 14  // Increased body font size
                    },
                    callbacks: {
                        label: function(context) {
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
                duration: 1000  // Added duration
            }
        }
    });
}

// Event Listeners
document.getElementById('calculate').addEventListener('click', handleCalculation);

document.getElementById('calcForm').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleCalculation();
    }
});

// Add resize handler for responsive behavior
window.addEventListener('resize', () => {
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection.classList.contains('visible')) {
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});
