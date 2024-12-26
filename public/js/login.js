async function login() {
    const username = document.getElementById('username').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('/bff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, senha }),
    });

    if (response.ok) {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('app-section').classList.remove('hidden');
        listarContas();
        listarTransferencias();
    } else {
        M.toast({ html: 'Erro no login. Tente novamente.', classes: 'red' });
    }
}