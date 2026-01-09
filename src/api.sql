WITH parametros AS (
    SELECT
        CAST(EXTRACT(YEAR FROM CURRENT_DATE()) AS STRING) AS ano_atual,
        EXTRACT(MONTH FROM CURRENT_DATE()) AS mes_num_atual
),

mapa_meses AS (
    SELECT 1 AS mes_num, 'janeiro'   AS mes_nome UNION ALL
    SELECT 2, 'fevereiro' UNION ALL
    SELECT 3, 'março'     UNION ALL
    SELECT 4, 'abril'     UNION ALL
    SELECT 5, 'maio'      UNION ALL
    SELECT 6, 'junho'     UNION ALL
    SELECT 7, 'julho'     UNION ALL
    SELECT 8, 'agosto'    UNION ALL
    SELECT 9, 'setembro'  UNION ALL
    SELECT 10,'outubro'   UNION ALL
    SELECT 11,'novembro'  UNION ALL
    SELECT 12,'dezembro'
)

SELECT
    m.executivo,
    m.nome_veiculo,
    m.ano_veiculacao,
    m.mes_veiculacao,
    ROUND(SUM(m.val_liquido)) AS valor_total,
    COUNT(*) AS qnt_vendas
FROM `service-desk-472314.silver.midiamais` m
JOIN parametros p
    ON m.ano_veiculacao = p.ano_atual
JOIN mapa_meses mm
    ON mm.mes_nome = LOWER(m.mes_veiculacao)
   AND mm.mes_num  = p.mes_num_atual
WHERE m.executivo IN (
    'Daniel Arnez Silveira',
    'Elvia Martins de Freitas',
    'Elza Edy Bueno Andrade',
    'Ricardo Testa Teodoro',
    'Janete de Oliveira Marques',
    'Lucilia Freitas',
    'Talita Helena Luzio dos Reis',
    'Alexandre Leal Martins',
    'Pedro Ribeiro Miniussi',
    'Leonardo Valadão de Souza',
    'Niromar Siqueira da Silva',
    'Claúdia Santos',
    'Mariane Moura Silva'
)
GROUP BY
    m.executivo,
    m.nome_veiculo,
    m.ano_veiculacao,
    m.mes_veiculacao
ORDER BY
    m.executivo;
