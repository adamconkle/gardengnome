// Save user preferences to localStorage
function saveUserPreferences() {
    const location = document.getElementById('location').value;
    const plantSelect = document.getElementById('plants');
    const selectedPlants = Array.from(plantSelect.selectedOptions).map(option => option.value);
    const meals = document.getElementById('meals').value.split(',').map(meal => meal.trim());

    // Create an object to store preferences
    const userData = {
        location: location,
        plants: selectedPlants,
        meals: meals,
        gardenSchedule: generateGardenSchedule(selectedPlants)
    };

    saveUserData(userData); // Save to localStorage
    displayGardenData(); // Update the UI with the new data
}

// Example of garden scheduling based on plants
function generateGardenSchedule(plants) {
    const schedules = {
        tomato: { plantDate: "March 15", harvestDate: "August 15", waterSchedule: "Every 3 days" },
        basil: { plantDate: "April 1", harvestDate: "July 1", waterSchedule: "Every 2 days" },
        carrot: { plantDate: "March 10", harvestDate: "July 10", waterSchedule: "Every 4 days" },
        lettuce: { plantDate: "March 20", harvestDate: "June 20", waterSchedule: "Every 3 days" },
        cucumber: { plantDate: "April 10", harvestDate: "July 10", waterSchedule: "Every 2 days" }
    };

    // Generate a schedule for selected plants
    return plants.map(plant => schedules[plant] || { plantDate: "Unknown", harvestDate: "Unknown", waterSchedule: "Unknown" });
}

// Display the saved garden data
function displayGardenData() {
    const data = loadUserData();
    const gardenDataElement = document.getElementById('gardenData');
    if (data) {
        gardenDataElement.innerHTML = `
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Plants:</strong></p>
            <ul>
                ${data.plants.map(plant => `<li>${plant}</li>`).join('')}
            </ul>
            <p><strong>Meal Preferences:</strong> ${data.meals.join(', ')}</p>
            <p><strong>Garden Schedule:</strong></p>
            <ul>
                ${data.gardenSchedule.map(schedule => `
                    <li>${schedule.plantDate} - Plant | ${schedule.harvestDate} - Harvest | Water: ${schedule.waterSchedule}</li>
                `).join('')}
            </ul>
        `;
    } else {
        gardenDataElement.innerHTML = '<p>No garden data found. Please import or enter your data.</p>';
    }
}

// Save user data to localStorage
function saveUserData(data) {
    localStorage.setItem('gardenData', JSON.stringify(data));
}

// Load user data from localStorage
function loadUserData() {
    const data = localStorage.getItem('gardenData');
    return data ? JSON.parse(data) : null;
}

// Export garden data as JSON file
function exportData() {
    const data = loadUserData();
    if (!data) {
        alert('No data to export!');
        return;
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'garden_data.json';
    link.click();
}

// Import garden data from a file
function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = JSON.parse(e.target.result);
            saveUserData(data); // Save the imported data back to localStorage
            displayGardenData(); // Update the UI with imported data
        };
        reader.readAsText(file);
    }
}

// Initialize the app (load existing data or use default)
window.onload = function () {
    if (!loadUserData()) {
        const defaultData = {
            location: "New York",
            plants: ["tomato", "basil"],
            meals: ["vegan", "gluten-free"],
            gardenSchedule: generateGardenSchedule(["tomato", "basil"])
        };
        saveUserData(defaultData); // Save default data if none exists
    }
    displayGardenData(); // Display the current garden data
};

// Listen for file import
document.getElementById('importFile').addEventListener('change', importData);
