// Save user data to localStorage
function saveUserData(data) {
    localStorage.setItem('gardenData', JSON.stringify(data));
}

// Load user data from localStorage
function loadUserData() {
    const data = localStorage.getItem('gardenData');
    return data ? JSON.parse(data) : null;
}

// Display user data on the page
function displayGardenData() {
    const data = loadUserData();
    const gardenDataElement = document.getElementById('gardenData');
    if (data) {
        gardenDataElement.innerHTML = `
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Plants:</strong></p>
            <ul>
                ${data.plants.map(plant => `<li>${plant.name} - Water: ${plant.waterSchedule}</li>`).join('')}
            </ul>
        `;
    } else {
        gardenDataElement.innerHTML = '<p>No garden data found. Please import or enter your data.</p>';
    }
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

// Example garden data to save for testing
const defaultData = {
    location: "New York",
    plants: [
        { name: "Tomato", waterSchedule: "Every 3 days" },
        { name: "Basil", waterSchedule: "Every 2 days" }
    ],
    progress: {
        tomatoPlanted: "2025-03-01",
        basilPlanted: "2025-03-01"
    }
};

// Initialize the app (load existing data or use default)
window.onload = function () {
    if (!loadUserData()) {
        saveUserData(defaultData); // Save default data if none exists
    }
    displayGardenData(); // Display the current garden data
};

// Listen for file import
document.getElementById('importFile').addEventListener('change', importData);
