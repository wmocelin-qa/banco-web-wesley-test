async function listarContas() {
    const response = await fetch('/bff/contas');
    const data = await response.json();
    const contas = data.contas || [];

    const contaOrigemSelect = document.getElementById('conta-origem');
    const contaDestinoSelect = document.getElementById('conta-destino');

    contaOrigemSelect.innerHTML = '<option value="" disabled selected>Escolha a Conta Origem</option>';
    contaDestinoSelect.innerHTML = '<option value="" disabled selected>Escolha a Conta Destino</option>';

    contas.forEach(conta => {
        const option = `<option value="${conta.id}">${conta.titular} com saldo de R$ ${conta.saldo} (${(conta.ativa == 1) ? "Ativa" : "Inativa"})</option>`;
        contaOrigemSelect.innerHTML += option;
        contaDestinoSelect.innerHTML += option;
    });

    M.FormSelect.init(contaOrigemSelect);
    M.FormSelect.init(contaDestinoSelect);
}