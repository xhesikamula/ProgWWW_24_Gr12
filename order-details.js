document.addEventListener('DOMContentLoaded', function () {
    // Get dessert ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const dessertId = urlParams.get('id');

    if (!dessertId) {
        alert('No dessert ID found!');
        return;
    }

    fetchDessertDetails(dessertId);
});

function fetchDessertDetails(id) {
    const apiUrl = `https://671fc5b3e7a5792f052f7efc.mockapi.io/Pastry/${id}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(dessert => {
            if (dessert) {
                document.getElementById('dessert-details2').innerHTML = `
                    <div class="dessert-card2">
                        <img src="${dessert.item_image}" alt="${dessert.item_name}" style="border-radius: 15px; width: 100%; max-width: 300px;">
                        <h2>${dessert.item_name}</h2>
                        <p class="description">${dessert.description}</p>
                        <p><strong>Price:</strong> $${dessert.price}</p>
                        <p><strong>Availability:</strong> ${dessert.available}</p>
                        <p><strong>Allergens:</strong> ${dessert.allergens}</p>
                    </div>
                `;

                localStorage.setItem('dessertDetails', JSON.stringify(dessert));
            } else {
                document.getElementById('dessert-details2').innerHTML = `<p>Dessert not found.</p>`;
            }
        })
        .catch(error => {
            document.getElementById('dessert-details2').innerHTML = `<p>Error fetching dessert details: ${error.message}</p>`;
        });
}
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const quantity = document.getElementById('quantity').value.trim();

    if (!name || !surname || !address || !quantity) {
        alert('Please fill out all required fields.');
        return;
    }

    const dessert = JSON.parse(localStorage.getItem('dessertDetails'));

    if (!dessert) {
        alert('Dessert details not found.');
        return;
    }

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
    };

    // Save the order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    
    const orderFormContainer = document.getElementById('order-form');
    orderFormContainer.innerHTML = `
        <div class="thank-you-message">
            <img src="./assets/img/thank-you.png" alt="Thank You" class="thank-you-image">
            <h3>Thank You for Your Order!</h3>
            <p>Dear <strong>${name} ${surname}</strong>, your order has been successfully placed.</p>
            <p>We appreciate your trust in Doughlicious Creations!</p>
        </div>
    `;

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 3000);
});
