async function fazerTransferencia() {
    const contaOrigem = document.getElementById('conta-origem').value;
    const contaDestino = document.getElementById('conta-destino').value;
    const valor = document.getElementById('valor').value;
    const token = document.getElementById('token').value;

    console.log(JSON.stringify({ contaOrigem, contaDestino, valor, token }));

    const response = await fetch('/bff/transferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contaOrigem, contaDestino, valor, token }),
    });

    if (response.ok) {
        M.toast({ html: 'Transferência realizada!', classes: 'green' });
        listarTransferencias();
        resetarContas();
    } else {
        const data = await response.json();
        M.toast({ html: data.error || 'Erro na transferência.', classes: 'red' });
    }
}

async function listarTransferencias() {
    const response = await fetch(`/bff/transferencias?page=${paginaAtual}&limit=5`);
    const data = await response.json();

    const lista = document.getElementById('transferencias-list');
    lista.innerHTML = '';

    if (data.transferencias && data.transferencias.length > 0) {
        data.transferencias.forEach(transferencia => {
            const item = document.createElement('li');
            item.classList.add('collection-item');
            item.innerText = `De ${transferencia.titular_origem} para ${transferencia.titular_destino} - R$${transferencia.valor}`;
            lista.appendChild(item);
        });
        ultimaPagina = data.transferencias.length < 5;
    } else {
        ultimaPagina = true;
    }

    atualizarPaginacao();
}

function atualizarPaginacao() {
    document.getElementById('pagina-atual').innerText = `Página ${paginaAtual}`;
    document.getElementById('btn-anterior').disabled = paginaAtual === 1;
    document.getElementById('btn-proximo').disabled = ultimaPagina;
}

function proximo() {
    if (!ultimaPagina) {
        paginaAtual++;
        listarTransferencias();
    }
}

function anterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        listarTransferencias();
    }
}