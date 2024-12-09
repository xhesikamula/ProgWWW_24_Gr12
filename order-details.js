// Listen for DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const dessertId = urlParams.get('id');

        if (!dessertId) {
            throw new Error('No dessert ID found in the URL!');
        }

        fetchDessertDetails(dessertId);
    } catch (error) {
        console.error('Error during DOMContentLoaded:', error.message);
        alert(error.message);
    }
});

// Function to fetch dessert details based on ID
function fetchDessertDetails(id) {
    const apiUrl = https://671fc5b3e7a5792f052f7efc.mockapi.io/Pastry/${id};
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(Failed to fetch dessert details. Status: ${response.status});
            }
            return response.json();
        })
        .then(dessert => {
            if (!dessert) {
                throw new Error('Dessert details not found.');
            }

            const dessertDetailsElement = document.getElementById('dessert-details2');
            const orderForm = document.getElementById('orderForm');

            if (dessert.stock <= 0) {
                dessertDetailsElement.innerHTML = `
                    <div class="dessert-card2">
                        <img src="${dessert.item_image}" alt="${dessert.item_name}" style="border-radius: 15px; width: 100%; max-width: 300px;">
                        <h2>${dessert.item_name}</h2>
                        <p class="description">${dessert.description}</p>
                        <p><strong>Price:</strong> $${dessert.price}</p>
                        <p style="color: red; font-weight: bold;">Out of stock</p>
                    </div>
                `;
                orderForm.style.display = 'none'; // Hide order form if out of stock
            } else {
                dessertDetailsElement.innerHTML = `
                    <div class="dessert-card2">
                        <img src="${dessert.item_image}" alt="${dessert.item_name}" style="border-radius: 15px; width: 100%; max-width: 300px;">
                        <h2>${dessert.item_name}</h2>
                        <p class="description">${dessert.description}</p>
                        <p><strong>Price:</strong> $${dessert.price}</p>
                        <p><strong>Availability:</strong> ${dessert.stock} left</p>
                        <p><strong>Allergens:</strong> ${dessert.allergens}</p>
                    </div>
                `;
            }

            try {
                localStorage.setItem('dessertDetails', JSON.stringify(dessert));
            } catch (error) {
                console.error('Error saving dessert details to localStorage:', error.message);
            }
        })
        .catch(error => {
            console.error('Error fetching dessert details:', error.message);
            document.getElementById('dessert-details2').innerHTML = <p>${error.message}</p>;
        });
}

document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    
        try {
            // Check if the user is logged in
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                alert('You should be logged in first to order!')
                // If no user is logged in, redirect to the login page
                window.location.href = 'login.html'; // Update with your actual login page URL
                return; // Stop further execution if the user is not logged in
            }
        // Get form values
        const nameElement = document.getElementById('name');
        const surnameElement = document.getElementById('surname');
        const phoneElement = document.getElementById('phone');
        const emailElement = document.getElementById('email');
        const addressElement = document.getElementById('address');
        const quantityElement = document.getElementById('quantity');

        const name = nameElement ? nameElement.value.trim() : '';
        const surname = surnameElement ? surnameElement.value.trim() : '';
        const phone = phoneElement ? phoneElement.value.trim() : '';
        const email = emailElement ? emailElement.value.trim() : '';
        const address = addressElement ? addressElement.value.trim() : '';
        const quantity = quantityElement ? parseInt(quantityElement.value.trim(), 10) : 0;

        // Debugging: Log phone and email values
        console.log('Phone:', phone); // Logs the phone value
        console.log('Email:', email); // Logs the email value

        if (!name || !surname || !address || !quantity) {
            throw new Error('Please fill out all required fields.');
        }

        const dessert = JSON.parse(localStorage.getItem('dessertDetails'));
        if (!dessert) {
            throw new Error('Dessert details not found in localStorage.');
        }
