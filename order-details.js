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
        console.log('Email:', email); 

        if (!name || !surname || !address || !quantity) {
            throw new Error('Please fill out all required fields.');
        }

        const dessert = JSON.parse(localStorage.getItem('dessertDetails'));
        if (!dessert) {
            throw new Error('Dessert details not found in localStorage.');
        }
             if (quantity > dessert.stock) {
            throw new Error(`Only ${dessert.stock} ${dessert.item_name}(s) available. Please reduce the quantity.`);
        }

        // Get selected payment method and extras
        const paymentMethod = getSelectedPaymentMethod();
        const extras = getSelectedExtras();

        if (!paymentMethod) {
            throw new Error('Please select a payment method.');
        }

        dessert.stock -= quantity;

        const order = {
            name,
            surname,
            phone,
            email,
            address,
            quantity,
            dessertName: dessert.item_name,
            price: dessert.price,
            date: new Date().toLocaleDateString(),
            extras: extras,
            deliveryMethod: getSelectedDeliveryMethod(),
            paymentMethod: paymentMethod,
        };

        // Debug: Log the order object to check if phone and email are included
        console.log('Order:', order);

        // Save the order and update dessert stock in localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        console.log('Updated Orders:', orders); // Log updated orders to confirm data

        localStorage.setItem('dessertDetails', JSON.stringify(dessert)); // Update dessert stock in localStorage
        updateStockViaAPI(dessert.id, dessert.stock); // Update dessert stock via API

        displayThankYouMessage(order.name, order.surname, dessert.stock);

    } catch (error) {
        console.error('Order submission error:', error.message);
        alert(error.message);
    }
});

function getSelectedExtras() {
    // Find all checked checkboxes with the name 'extras' and get their values
    const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'))
        .map(extra => extra.value);
    
    // If there are extras selected, return them as a comma-separated string, otherwise an empty string
    return extras.length > 0 ? extras.join(", ") : "";
}

function getSelectedDeliveryMethod() {
    // Find the selected radio button for delivery method
    const selectedRadio = document.querySelector('input[name="delivery-method"]:checked');
    
    // If a radio button is selected, return its value, otherwise return null
    return selectedRadio ? selectedRadio.value : null;
}


// Function to retrieve selected payment method from <datalist>
function getSelectedPaymentMethod() {
    const paymentMethodInput = document.getElementById('paymentMethod');
    const paymentMethod = paymentMethodInput.value.trim();
    return paymentMethod ? paymentMethod : null;
}

// Example function to handle display after successful order submission
function displayThankYouMessage(name, surname, remainingStock) {
    const thankYouMessage = `
        <div class="thank-you-message">
            <img src="./assets/img/thank-you.png" alt="Thank You" class="thank-you-image">
            <h3>Thank You for Your Order!</h3>
            <p>Dear <strong>${name} ${surname}</strong>, your order has been successfully placed.</p>
            <p>We appreciate your trust in Doughlicious Creations!</p>
            ${remainingStock <= 0 ? '<p style="color: red; font-weight: bold;">The dessert is now out of stock.</p>' : ''}
        </div>
    `;
    document.getElementById('order-form').innerHTML = thankYouMessage;

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 3000);
}

// Example function to update stock via API
function updateStockViaAPI(dessertId, newStock) {
    const apiUrl = `https://671fc5b3e7a5792f052f7efc.mockapi.io/Pastry/${dessertId}`;
    fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
    })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to update stock. Status: ${response.status}`);
            return response.json();
        })
        .then(updatedDessert => console.log('Stock updated successfully:', updatedDessert))
        .catch(error => console.error('Error updating stock via API:', error.message));
}
