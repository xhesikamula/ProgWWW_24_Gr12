function updateHeader() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const authLinks = document.getElementById('auth-links');
    const dashboardLinks = document.getElementById('dashboard-links');

    if (currentUser) {
        authLinks.style.display = 'none';
        dashboardLinks.style.display = 'flex'; 
    } else {
        authLinks.style.display = 'flex';
        dashboardLinks.style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    updateHeader();

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');

            updateHeader();

            window.location.href = 'index.html';
        });
    }
});
document.querySelector('#login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const email = event.target.email.value.trim();
    const password = event.target.password.value.trim();

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);

    if (user && user.password === password) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true'); 

        const currentDate = new Date();
        localStorage.setItem('lastLogin', currentDate.toLocaleString()); 

        const successPopup = document.getElementById('success-popup');
        if (successPopup) {
            successPopup.classList.add('show');
            setTimeout(() => {
                successPopup.classList.remove('show');
                window.location.href = 'index.html'; 
            }, 2000); 
        }
    } else {
        alert('Invalid email or password. Please try again.');
        localStorage.setItem('isLoggedIn', 'false'); 
    }
});
