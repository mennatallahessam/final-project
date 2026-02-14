let foods = [];

function addFood() {
    const foodName = document.getElementById('foodName').value.trim();
    const calories = parseFloat(document.getElementById('calories').value) || 0;
    const protein = parseFloat(document.getElementById('protein').value) || 0;

    if (!foodName) {
        alert('Please enter a food name');
        return;
    }

    if (calories === 0 && protein === 0) {
        alert('Please enter at least calories or protein');
        return;
    }

    const food = {
        id: Date.now(),
        name: foodName,
        calories: calories,
        protein: protein
    };

    foods.push(food);
    renderFoods();
    updateStats();
    clearInputs();
}

function deleteFood(id) {
    foods = foods.filter(food => food.id !== id);
    renderFoods();
    updateStats();
}

function renderFoods() {
    const foodList = document.getElementById('foodList');
    
    if (foods.length === 0) {
        foodList.innerHTML = '<li class="empty-state">No foods tracked yet. Start by adding your first meal!</li>';
        return;
    }

    foodList.innerHTML = foods.map(food => `
        <li class="food-item">
            <div class="food-details">
                <span class="food-name">${food.name}</span>
                <span class="food-calories"><strong>${food.calories}</strong> kcal</span>
                <span class="food-protein"><strong>${food.protein}</strong> g protein</span>
            </div>
            <button class="delete-btn" onclick="deleteFood(${food.id})">Remove</button>
        </li>
    `).join('');
}

function updateStats() {
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
    
    document.getElementById('totalCalories').textContent = totalCalories.toFixed(0);
    document.getElementById('totalProtein').textContent = totalProtein.toFixed(1);
    document.getElementById('totalItems').textContent = foods.length;
}

function clearInputs() {
    document.getElementById('foodName').value = '';
    document.getElementById('calories').value = '';
    document.getElementById('protein').value = '';
    document.getElementById('foodName').focus();
}

// Allow Enter key to add food
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addFood();
    }
});
