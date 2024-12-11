document.addEventListener('DOMContentLoaded', function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
const dessertId = urlParams.get('id');
console.log('Dessert ID:', dessertId);  


        if (!dessertId) {
            throw new Error('No dessert ID found in the URL!');
        }

        fetchDessertDetails(dessertId);
    } catch (error) {
        console.error('Error during DOMContentLoaded:', error.message);
        alert(error.message);
    }

    const phoneElement = document.getElementById('phone');
    const phoneRegex = /(\d{3})(\d{3})(\d{4})/;

    if (phoneElement) {
        console.log('Phone input found:', phoneElement);

        phoneElement.addEventListener('input', function () {
            let inputValue = phoneElement.value.replace(/\D/g, ''); 

            if (phoneRegex.test(inputValue)) {
                const match = phoneRegex.exec(inputValue);

                if (match) {
                    const areaCode = match[1];
                    const prefix = match[2];
                    const lineNumber = match[3];

                    const formattedPhone = `(${areaCode}) ${prefix}-${lineNumber}`;
                    phoneElement.value = formattedPhone; 

                    console.log(`Formatted phone: ${formattedPhone}`);
                    console.log(`Area Code: ${areaCode}`);
                    console.log(`Prefix: ${prefix}`);
                    console.log(`Line Number: ${lineNumber}`);

                    localStorage.setItem('formattedPhone', formattedPhone);
                }
            } else {
                console.log('Pattern does not match.');
            }
        });
    } else {
        console.error('Phone input not found in the DOM.');
    }
});


function fetchDessertDetails(id) {
    const apiUrl = `https://671fc5b3e7a5792f052f7efc.mockapi.io/Pastry/${id}`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch dessert details. Status: ${response.status}`);
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
                $(orderForm).slideUp(1000);
                dessertDetailsElement.innerHTML = `
                    <div class="dessert-card2">
                        <img src="${dessert.item_image}" alt="${dessert.item_name}" style="border-radius: 15px; width: 100%; max-width: 300px;">
                        <h2>${dessert.item_name}</h2>
                        <p class="description">${dessert.description}</p>
                        <p><strong>Price:</strong> $${dessert.price}</p>
                        <p style="color: red; font-weight: bold;">Out of stock</p>
                    </div>
                `;
                $(dessertDetailsElement).fadeIn(1000).animate({
                    marginTop: '20px'  
                }, 1000); 
                orderForm.style.display = 'none';
            } else {
                $(orderForm).slideDown(1000); 
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
                
                $(dessertDetailsElement).fadeIn(1000).animate({
                    marginTop: '20px'  
                }, 1000); 
            }

            try {
                localStorage.setItem('dessertDetails', JSON.stringify(dessert));
            } catch (error) {
                console.error('Error saving dessert details to localStorage:', error.message);
            }
        })
        .catch(error => {
            console.error('Error fetching dessert details:', error.message);
            document.getElementById('dessert-details2').innerHTML = `<p>${error.message}</p>`;
        });
}

document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    
        try {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                alert('You should be logged in first to order!')
                
                window.location.href = 'login.html'; 
                return; 
            }
        
        const nameElement = document.getElementById('name');
        const surnameElement = document.getElementById('surname');
        const phoneElement = document.getElementById('phone');
        const emailElement = document.getElementById('email');
        const addressElement = document.getElementById('address');
        const quantityElement = document.getElementById('quantity');

        const name = nameElement ? nameElement.value.trim() : '';
        const surname = surnameElement ? surnameElement.value.trim() : '';
        const phone = localStorage.getItem('formattedPhone') || phoneElement.value.trim(); 
        const email = emailElement ? emailElement.value.trim() : '';
        const address = addressElement ? addressElement.value.trim() : '';
        const quantity = quantityElement ? parseInt(quantityElement.value.trim(), 10) : 0;


        if (!name || !surname || !address || !quantity) {
            throw new Error('Please fill out all required fields.');
        }

        const dessert = JSON.parse(localStorage.getItem('dessertDetails'));
        if (!dessert) {
            throw new Error('Dessert details not found in localStorage.');
        }

            if (isNaN(quantity) || quantity <= 0) {
            throw new Error('Please enter a valid quantity greater than 0.');
        }

        // i kom perdor te dyjat edhe MAX_SAFE_INTEGER edhe toExponential()
        // qetu bon edhe me MAX_VALUE veq se nuk mujsha me testu se numri shume i madh
        if (quantity > Number.MAX_SAFE_INTEGER) {
            throw new Error('Quantity is too large. Please enter a smaller number.');
        }

        if (quantity > 1000000) {
            console.warn(`Quantity entered is unusually large: ${quantity.toExponential(2)}`);
            alert(`You have entered an extremely large quantity: ${quantity.toExponential(2)}. Please confirm.`);
            
        }

        if (quantity > dessert.stock) {
            throw new Error(`Only ${dessert.stock} ${dessert.item_name}(s) available. Please reduce the quantity.`);
    // $(".warning-message").text(`Only ${dessert.stock} ${dessert.item_name}(s) available. Please reduce the quantity.`).slideDown(500).delay(3000).slideUp(500);
        }

  const remainingStock = dessert.stock - quantity;
  if (remainingStock < 0) {
      throw new Error('Insufficient stock. Please reduce the quantity.');
  }
  dessert.stock = remainingStock; 

  localStorage.setItem('dessertDetails', JSON.stringify(dessert));

  
        const paymentMethod = getSelectedPaymentMethod();
        const extras = getSelectedExtras();

        if (!paymentMethod) {
            throw new Error('Please select a payment method.');
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
            extras: extras,
            deliveryMethod: getSelectedDeliveryMethod(),
            paymentMethod: paymentMethod,
        };


        console.log('Order:', order);
        

        
      

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        console.log('Updated Orders:', orders); 

        localStorage.setItem('dessertDetails', JSON.stringify(dessert)); 
        updateStockViaAPI(dessert.id, dessert.stock);
        displayThankYouMessage(order.name, order.surname, dessert.stock);

    } catch (error) {
        console.error('Order submission error:', error.message);
        alert(error.message);
    }
});

function getSelectedExtras() {

    const extras = Array.from(document.querySelectorAll('input[name="extras"]:checked'))
        .map(extra => extra.value);
 
    return extras.length > 0 ? extras.join(", ") : "";
}

function getSelectedDeliveryMethod() {
    const selectedRadio = document.querySelector('input[name="delivery-method"]:checked');

    return selectedRadio ? selectedRadio.value : null;
}


function getSelectedPaymentMethod() {
    const paymentMethodInput = document.getElementById('paymentMethod');
    const paymentMethod = paymentMethodInput.value.trim();
    return paymentMethod ? paymentMethod : null;
}

function displayThankYouMessage(name, surname, remainingStock, totalPrice) {
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
