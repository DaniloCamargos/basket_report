// Acessa os dados de entrada
const items = $('business_basket').all();

let items25 = [];
try {
    // Tenta acessar os dados de 2025 (garante que não quebre se o nó estiver vazio)
    items25 = $('business_basket_25').all();
} catch (e) {
    items25 = [];
}

if (items.length === 0) {
  return [{ json: { html_tabela: '<tr><td colspan="10" style="padding:20px;text-align:center;color:#888;">Nenhum dado encontrado.</td></tr>', mes: '', ano: '' } }];
}

// Configurações iniciais
const executivos = {};
const totaisGerais = {
    'TV PARANAIBA RECORD': 0, 'PARANAIBA FM 1007': 0, 'EDUCADORA 909 FM': 0, 'PORTAL  DIGITAL': 0, 'OUT OF HOME': 0
};

// Histórico 2025 por Executivo
const executivos25 = {};
let totalGeral25 = 0;

// Metas originais
const metas_planilha = {
    "Alexandre Leal Martins": { "Março": 169043, "Abril": 143645, "Maio": 158809, "Junho": 162296, "Julho": 134735, "Agosto": 160985, "Setembro": 183809, "Outubro": 199057, "Novembro": 169064, "Dezembro": 173375 },
    "Claudia Sueli Dos Santos": { "Março": 135022, "Abril": 96698, "Maio": 89834, "Junho": 86921, "Julho": 141494, "Agosto": 100342, "Setembro": 124241, "Outubro": 151848, "Novembro": 128805, "Dezembro": 75739 },
    "Niromar Siqueira da Silva": { "Março": 136684, "Abril": 141684, "Maio": 146194, "Junho": 100293, "Julho": 126639, "Agosto": 138676, "Setembro": 162052, "Outubro": 125180, "Novembro": 168453, "Dezembro": 199094 },
    "Daniel Arnez Silveira": { "Março": 154030, "Abril": 197699, "Maio": 210226, "Junho": 437061, "Julho": 159189, "Agosto": 128940, "Setembro": 293558, "Outubro": 254400, "Novembro": 290708, "Dezembro": 167317 },
    "Elvia Martins De Freitas": { "Março": 104488, "Abril": 104265, "Maio": 157718, "Junho": 104224, "Julho": 134005, "Agosto": 124024, "Setembro": 104315, "Outubro": 109426, "Novembro": 114823, "Dezembro": 117345 },
    "Elza Edy Bueno Andrade": { "Março": 213258, "Abril": 207249, "Maio": 261811, "Junho": 210441, "Julho": 221748, "Agosto": 244489, "Setembro": 233181, "Outubro": 248915, "Novembro": 248972, "Dezembro": 286093 },
    "Leonardo Valadão De Souza": { "Março": 154133, "Abril": 113087, "Maio": 162349, "Junho": 78186, "Julho": 161849, "Agosto": 176280, "Setembro": 129857, "Outubro": 155994, "Novembro": 148310, "Dezembro": 158102 },
    "Carteira M.": { "Março": 16821, "Abril": 24289, "Maio": 26139, "Junho": 29973, "Julho": 29668, "Agosto": 25048, "Setembro": 29722, "Outubro": 36576, "Novembro": 22026, "Dezembro": 39278 },
    "Mariane Moura Silva": { "Março": 125181, "Abril": 95076, "Maio": 115962, "Junho": 93168, "Julho": 104972, "Agosto": 134174, "Setembro": 157341, "Outubro": 139001, "Novembro": 181173, "Dezembro": 73031 },
    "Pedro Ribeiro Miniussi": { "Março": 15000, "Abril": 15000, "Maio": 15000, "Junho": 20000, "Julho": 20000, "Agosto": 23036, "Setembro": 13384, "Outubro": 18842, "Novembro": 25842, "Dezembro": 25375 },
    "Ricardo Testa Teodoro": { "Março": 668986, "Abril": 882241, "Maio": 494287, "Junho": 521247, "Julho": 502966, "Agosto": 695538, "Setembro": 615989, "Outubro": 559387, "Novembro": 553256, "Dezembro": 718286 },
    "Talita Helena Luzio dos Reis": { "Março": 181854, "Abril": 162067, "Maio": 189171, "Junho": 171191, "Julho": 154737, "Agosto": 156469, "Setembro": 105551, "Outubro": 170374, "Novembro": 215168, "Dezembro": 207065 }
};

const metas_2026 = {
    "ALEXANDRE LEAL MARTINS": metas_planilha["Alexandre Leal Martins"]
    ,"CLAUDIA SANTOS": metas_planilha["Claudia Sueli Dos Santos"]
    ,"NIROMAR SIQUEIRA DA SILVA": metas_planilha["Niromar Siqueira da Silva"]
    ,"DANIEL ARNEZ SILVEIRA": metas_planilha["Daniel Arnez Silveira"]
    ,"ELVIA MARTINS DE FREITAS": metas_planilha["Elvia Martins De Freitas"]
    ,"ELZA EDY BUENO ANDRADE": metas_planilha["Elza Edy Bueno Andrade"]
    ,"LEONARDO VALADAO DE SOUZA": metas_planilha["Leonardo Valadão De Souza"]
    ,"MARIANE MOURA SILVA": metas_planilha["Mariane Moura Silva"]
    ,"CARTEIRA M.": metas_planilha["Carteira M."]
    ,"PEDRO RIBEIRO MINIUSSI": metas_planilha["Pedro Ribeiro Miniussi"]
    ,"RICARDO TESTA TEODORO": metas_planilha["Ricardo Testa Teodoro"]
    ,"TALITA HELENA LUZIO DOS REIS": metas_planilha["Talita Helena Luzio dos Reis"]
};

const mesRaw = (items[0].json.mes_veiculacao || '').toLowerCase().trim();
const mesesMap = { 'janeiro': 'Janeiro', 'fevereiro': 'Fevereiro', 'marco': 'Março', 'março': 'Março', '03': 'Março', '3': 'Março', 'abril': 'Abril', 'maio': 'Maio', 'junho': 'Junho', 'julho': 'Julho', 'agosto': 'Agosto', 'setembro': 'Setembro', 'outubro': 'Outubro', 'novembro': 'Novembro', 'dezembro': 'Dezembro' };
const mes = mesesMap[mesRaw] || (mesRaw.charAt(0).toUpperCase() + mesRaw.slice(1));
const ano = items[0].json.ano_veiculacao || '';

// Processamento de 2025
for (const item of items25) {
    const dados = item.json;
    const exec = (dados.executivo || '').toUpperCase().trim(); 
    const valor = parseFloat(dados.valor_total || 0);
    if (!exec) continue;
    if (!executivos25[exec]) executivos25[exec] = 0;
    executivos25[exec] += valor;
    totalGeral25 += valor;
}

// Processamento de 2026 (Atual)
for (const item of items) {
    const dados = item.json;
    const exec = (dados.executivo || '').toUpperCase().trim(); 
    const veiculo = dados.nome_veiculo;
    const valor = parseFloat(dados.valor_total || 0);
    if (!exec) continue;
    if (!executivos[exec]) executivos[exec] = { 'TV PARANAIBA RECORD': 0, 'PARANAIBA FM 1007': 0, 'EDUCADORA 909 FM': 0, 'PORTAL  DIGITAL': 0, 'OUT OF HOME': 0 };
    if (executivos[exec][veiculo] !== undefined) {
        executivos[exec][veiculo] += valor;
        if (totaisGerais[veiculo] !== undefined) totaisGerais[veiculo] += valor;
    }
}

const formatBRL = (val) => {
    if (!val || val === 0) return '<span style="color:#cbd5e1;">-</span>';
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

let linhasHTML = '';
let totalGeralMetas = 0;

// Usamos os executivos do mês atual para montar a tabela
const listaExecutivos = Object.keys(executivos).sort();

for (const exec of listaExecutivos) {
    const v = executivos[exec];
    const totalExec = v['TV PARANAIBA RECORD'] + v['PARANAIBA FM 1007'] + v['EDUCADORA 909 FM'] + v['PORTAL  DIGITAL'] + v['OUT OF HOME'];
    
    let metaExec = (metas_2026[exec] && metas_2026[exec][mes]) ? metas_2026[exec][mes] : 0;
    totalGeralMetas += metaExec;

    // Resgata o histórico do ano passado para esse executivo
    const hist25 = executivos25[exec] || 0;

    let corBg = '#f1f5f9'; let corText = '#64748b'; let percentualFormatado = '-';
    if (metaExec > 0) {
        const perc = (totalExec / metaExec) * 100;
        if (perc >= 100) { corBg = '#d1fae5'; corText = '#065f46'; } 
        else if (perc >= 90) { corBg = '#fef3c7'; corText = '#92400e'; } 
        else { corBg = '#fee2e2'; corText = '#991b1b'; }
        percentualFormatado = perc.toFixed(1) + '%';
    }

    linhasHTML += `
    <tr>
        <td style="padding:14px 12px;text-align:left;border-bottom:1px solid #f1f5f9;color:#334155;font-weight:700;font-size:13px;">${exec}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;color:#475569;font-weight:400;font-size:13px;">${formatBRL(v['TV PARANAIBA RECORD'])}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;color:#475569;font-weight:400;font-size:13px;">${formatBRL(v['PARANAIBA FM 1007'])}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;color:#475569;font-weight:400;font-size:13px;">${formatBRL(v['EDUCADORA 909 FM'])}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;color:#475569;font-weight:400;font-size:13px;">${formatBRL(v['PORTAL  DIGITAL'])}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;color:#475569;font-weight:400;font-size:13px;">${formatBRL(v['OUT OF HOME'])}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:500;font-size:13px;">${formatBRL(hist25)}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;color:#1e293b;font-weight:700;font-size:13px;">${formatBRL(totalExec)}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:500;font-size:13px;">${formatBRL(metaExec)}</td>
        <td style="padding:14px 12px;text-align:right;border-bottom:1px solid #f1f5f9;">
            <span style="background-color:${corBg}; color:${corText}; font-weight:700; font-size:12px; padding:6px 10px; border-radius:6px; display:inline-block; min-width:50px; text-align:center;">
                ${percentualFormatado}
            </span>
        </td>
    </tr>`;
}

const totalGeralFinal = Object.values(totaisGerais).reduce((a, b) => a + b, 0);
let percTotal = totalGeralMetas > 0 ? (totalGeralFinal / totalGeralMetas) * 100 : 0;
let corTotalBg = '#f1f5f9'; let corTotalText = '#64748b';
if (percTotal >= 100) { corTotalBg = '#d1fae5'; corTotalText = '#065f46'; }
else if (percTotal >= 90) { corTotalBg = '#fef3c7'; corTotalText = '#92400e'; }
else { corTotalBg = '#fee2e2'; corTotalText = '#991b1b'; }

linhasHTML += `
<tr style="background-color:#f8fafc;">
    <td style="padding:16px 12px;text-align:left;color:#334155;font-weight:700;font-size:13px;border-top:2px solid #cbd5e1;">Total Geral</td>
    <td style="padding:16px 12px;text-align:right;color:#334155;font-weight:600;font-size:13px;border-top:2px solid #cbd5e1;">${formatBRL(totaisGerais['TV PARANAIBA RECORD'])}</td>
    <td style="padding:16px 12px;text-align:right;color:#334155;font-weight:600;font-size:13px;border-top:2px solid #cbd5e1;">${formatBRL(totaisGerais['PARANAIBA FM 1007'])}</td>
    <td style="padding:16px 12px;text-align:right;color:#334155;font-weight:600;font-size:13px;border-top:2px solid #cbd5e1;">${formatBRL(totaisGerais['EDUCADORA 909 FM'])}</td>
    <td style="padding:16px 12px;text-align:right;color:#334155;font-weight:600;font-size:13px;border-top:2px solid #cbd5e1;">${formatBRL(totaisGerais['PORTAL  DIGITAL'])}</td>
    <td style="padding:16px 12px;text-align:right;color:#334155;font-weight:600;font-size:13px;border-top:2px solid #cbd5e1;">${formatBRL(totaisGerais['OUT OF HOME'])}</td>
    <td style="padding:16px 12px;text-align:right;color:#64748b;font-weight:600;font-size:13px;border-top:2px solid #cbd5e1;">${formatBRL(totalGeral25)}</td>
    <td style="padding:16px 12px;text-align:right;color:#0f172a;font-weight:800;font-size:14px;border-top:2px solid #cbd5e1;">${formatBRL(totalGeralFinal)}</td>
    <td style="padding:16px 12px;text-align:right;color:#64748b;font-weight:600;font-size:13px;border-top:2px solid #cbd5e1;">${formatBRL(totalGeralMetas)}</td>
    <td style="padding:16px 12px;text-align:right;border-top:2px solid #cbd5e1;">
        <span style="background-color:${corTotalBg}; color:${corTotalText}; font-weight:800; font-size:13px; padding:6px 10px; border-radius:6px; display:inline-block; min-width:50px; text-align:center;">
            ${percTotal.toFixed(1)}%
        </span>
    </td>
</tr>`;

return [{ json: { html_tabela: linhasHTML, total_registros: items.length, mes: mes, ano: ano } }];