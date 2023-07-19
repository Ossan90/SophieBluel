const form = document.querySelector('form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value
    })
    });

    const data = await response.json();
    const token = data.token;

    if (token) {
        localStorage.setItem('token', token);
        window.location.href = 'index.html';
    } else {
        alert('Erreur dans l\'identifiant ou le mot de passe')
    }});









    