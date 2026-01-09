# Workflow n8n — Sincronização de Execuções BigQuery com Envio de E-mail

## Visão Geral

Este projeto contém um **workflow no n8n** cujo objetivo é **executar múltiplas consultas no BigQuery e somente avançar para a próxima etapa (envio de e-mail) quando todas as consultas forem concluídas com sucesso**.

A solução foi desenhada para evitar:

* Execuções duplicadas
* Envio incorreto ou prematuro de e-mails
* Erros de dependência entre fluxos paralelos

O workflow utiliza um **único gatilho (Schedule Trigger)** e uma **barreira de sincronização (Merge — Wait for Both)**, garantindo consistência e previsibilidade.

---

## Problema Resolvido

No n8n, cada **Trigger inicia uma execução independente**. Quando múltiplos gatilhos são conectados a um mesmo node final, ocorrem problemas como:

* Execuções incompletas
* Erros do tipo “faltou a execução de outro node”
* Duplicidade de processamento

Este projeto resolve esse problema garantindo que:

> **A próxima etapa só é executada quando TODAS as consultas BigQuery forem executadas na mesma execução do workflow.**

---

## Arquitetura do Workflow

### Fluxo lógico

```text
Schedule Trigger
 ├─ BigQuery — Consulta A
 ├─ BigQuery — Consulta B
 └─ Merge (Wait for Both)
       ↓
   Code (opcional — consolidação/validação)
       ↓
   Send Email
```

### Componentes

* **Schedule Trigger**
  Responsável por iniciar a execução em horário definido.

* **BigQuery (A e B)**
  Executam consultas independentes no BigQuery.

* **Merge (Wait for Both)**
  Atua como uma barreira de sincronização (AND lógico), liberando o fluxo apenas quando ambos os BigQuery finalizam.

* **Code (JavaScript)** *(opcional)*
  Usado para consolidar resultados, validar dados ou preparar o payload do e-mail.

* **Send Email**
  Envia a notificação apenas após todas as dependências serem satisfeitas.

---

## Configuração do Merge

Parâmetros recomendados:

* **Mode**: `Wait`
* **Combine By**: `Position` ou `All` (dependendo da estrutura dos dados)
* **Inputs**:

  * Input 1 → BigQuery A
  * Input 2 → BigQuery B

Esse node garante que:

* Se um BigQuery falhar, o fluxo não avança
* Se apenas um executar, o fluxo não avança

---

## Boas Práticas Aplicadas

* ✅ Um único Trigger por execução
* ✅ Separação clara de responsabilidades
* ✅ Sincronização explícita de fluxos paralelos
* ✅ Evita duplicidade de e-mails
* ✅ Arquitetura previsível e fácil de manter

---

## Limitações Conhecidas

* Este modelo **exige que todas as consultas sejam executadas no mesmo horário**.
* Caso seja necessário coordenar execuções em horários diferentes, é recomendado:

  * Uso de **estado externo** (Data Store, banco de dados, Redis, etc.)
  * Um workflow orquestrador separado

---

## Quando Usar Este Padrão

Este workflow é ideal para:

* Alertas consolidados
* Relatórios periódicos
* Validações dependentes de múltiplas fontes
* Rotinas de fechamento diário/mensal

---

## Manutenção e Evolução

Sugestões para evolução do projeto:

* Adicionar logs de auditoria
* Implementar controle de idempotência
* Versionar consultas BigQuery
* Separar ingestão, processamento e notificação em workflows distintos

---

## Autor

Projeto mantido para fins de automação, confiabilidade e boas práticas em orquestração com n8n.
