document.addEventListener('DOMContentLoaded', function () {

    const urlParams = new URLSearchParams(window.location.search);
    const dessertId = urlParams.get('id');

    if (!dessertId) {
        alert('No dessert ID found!');
        return;
    }

    fetchDessertDetails(dessertId);
});

function fetchDessertDetails(id) {
    const apiUrl = https://671fc5b3e7a5792f052f7efc.mockapi.io/Pastry/${id};

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
                document.getElementById('dessert-details2').innerHTML = <p>Dessert not found.</p>;
            }
        })
        .catch(error => {
            document.getElementById('dessert-details2').innerHTML = <p>Error fetching dessert details: ${error.message}</p>;
        });
}

document.getElementById('order-button').addEventListener('click', function () {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
    } else {
        alert('You need to be logged in to place an order.');
        window.location.href = 'login.html';
    }
});

document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault(); 

    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value.trim(), 10);

    const extras = getSelectedExtras(); 
    const deliveryMethod = getSelectedDeliveryMethod(); 

    if (!name || !surname || !address || !quantity) {
        alert('Please fill out all required fields.');
        return;
    }

    const dessert = JSON.parse(localStorage.getItem('dessertDetails'));

    if (!dessert) {
        alert('Dessert details not found.');
        return;
    }

    if (quantity > dessert.stock) {
        alert(Only ${dessert.stock} ${dessert.item_name}(s) available. Please reduce the quantity.);
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
        extras, 
        deliveryMethod, 
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
