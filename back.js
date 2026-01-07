// Acessa os dados de entrada (assumindo que vêm do nó anterior)
const items = $input.all();

// Se não houver dados, retorna vazio
if (items.length === 0) {
  return [{ json: { html_tabela: '<tr><td colspan="6">Sem dados</td></tr>', mes: '', ano: '' } }];
}

// Configurações iniciais
const executivos = {};
const totaisGerais = {
    'TV PARANAIBA (RECORD)': 0, 
    'PARANAIBA FM 100,7': 0,
    'EDUCADORA 90.9 FM': 0,
    'PORTAL + DIGITAL': 0,
    'OUT OF HOME': 0
};

// Pega mês e ano do primeiro registro para o cabeçalho
const mesRaw = items[0].json.mes_veiculacao || '';
const mes = mesRaw.charAt(0).toUpperCase() + mesRaw.slice(1).toLowerCase();
const ano = items[0].json.ano_veiculacao || '';

// 1. Agrupamento e Soma
for (const item of items) {
    const dados = item.json;
    const exec = dados.executivo;
    const veiculo = dados.nome_veiculo;
    const valor = parseFloat(dados.valor_total || 0);

    if (!executivos[exec]) {
        executivos[exec] = {
            'TV PARANAIBA (RECORD)': 0,
            'PARANAIBA FM 100,7': 0,
            'EDUCADORA 90.9 FM': 0,
            'PORTAL + DIGITAL': 0,
            'OUT OF HOME': 0
        };
    }

    if (executivos[exec][veiculo] !== undefined) {
        executivos[exec][veiculo] += valor;
        // Soma ao total geral também
        if (totaisGerais[veiculo] !== undefined) {
            totaisGerais[veiculo] += valor;
        }
    }
}

// Função auxiliar para formatar moeda BRL
const formatBRL = (val) => {
    if (!val || val === 0) return '-';
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// 2. Construção das Linhas HTML (Corpo da Tabela)
let linhasHTML = '';

for (const exec in executivos) {
    const v = executivos[exec];
    const totalExec = v['TV PARANAIBA (RECORD)'] + v['PARANAIBA FM 100,7'] + 
                      v['EDUCADORA 90.9 FM'] + v['PORTAL + DIGITAL'] + v['OUT OF HOME'];

    linhasHTML += `
    <tr>
        <td>${exec}</td>
        <td class="valor">${formatBRL(v['TV PARANAIBA (RECORD)'])}</td>
        <td class="valor">${formatBRL(v['PARANAIBA FM 100,7'])}</td>
        <td class="valor">${formatBRL(v['EDUCADORA 90.9 FM'])}</td>
        <td class="valor">${formatBRL(v['PORTAL + DIGITAL'])}</td>
        <td class="valor">${formatBRL(v['OUT OF HOME'])}</td>
        <td class="valor">${formatBRL(totalExec)}</td>
    </tr>`;
}

// 3. Construção da Linha de Totais
const totalGeralFinal = totaisGerais['TV PARANAIBA (RECORD)'] + totaisGerais['PARANAIBA FM 100,7'] + 
                        totaisGerais['EDUCADORA 90.9 FM'] + totaisGerais['PORTAL + DIGITAL'] + totaisGerais['OUT OF HOME'];

linhasHTML += `
<tr class="total-row">
    <td>Total Geral</td>
    <td class="valor">${formatBRL(totaisGerais['TV PARANAIBA (RECORD)'])}</td>
    <td class="valor">${formatBRL(totaisGerais['PARANAIBA FM 100,7'])}</td>
    <td class="valor">${formatBRL(totaisGerais['EDUCADORA 90.9 FM'])}</td>
    <td class="valor">${formatBRL(totaisGerais['PORTAL + DIGITAL'])}</td>
    <td class="valor">${formatBRL(totaisGerais['OUT OF HOME'])}</td>
    <td class="valor">${formatBRL(totalGeralFinal)}</td>
</tr>`;

// Retorna um único objeto JSON contendo o HTML pronto e as variáveis de data
return [{
    json: {
        html_tabela: linhasHTML,
        total_registros: items.length,
        mes: mes,
        ano: ano
    }
}];