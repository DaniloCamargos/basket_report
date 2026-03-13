import os
import json
import requests
import dotenv

dotenv.load_dotenv()

N8N_URL = os.getenv("N8N_URL")
API_KEY = os.getenv("N8N_API_KEY")
WORKFLOW_NAME = os.getenv("WORKFLOW_NAME")

CRON_HOUR = int(os.getenv("CRON_HOUR"))
CRON_MINUTE = int(os.getenv("CRON_MINUTE"))

BQ_QUERY = os.getenv("BQ_QUERY")
BQ_CREDENTIAL_ID = os.getenv("BQ_CREDENTIAL_ID")
BQ_CREDENTIAL_NAME = os.getenv("BQ_CREDENTIAL_NAME")

EMAIL_FROM = os.getenv("EMAIL_FROM")
EMAIL_TO = os.getenv("EMAIL_TO")
EMAIL_SUBJECT = os.getenv("EMAIL_SUBJECT")

headers = {
    "X-N8N-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

workflow = {
    "name": WORKFLOW_NAME,
    "active": False,
    "nodes": [
        {
            "parameters": {
                "triggerTimes": {
                    "item": [
                        {
                            "mode": "everyMonth",
                            "hour": CRON_HOUR,
                            "minute": CRON_MINUTE
                        }
                    ]
                }
            },
            "name": "Cron",
            "type": "n8n-nodes-base.cron",
            "typeVersion": 1,
            "position": [200, 300]
        },
        {
            "parameters": {
                "operation": "executeQuery",
                "query": BQ_QUERY
            },
            "name": "BigQuery",
            "type": "n8n-nodes-base.googleBigQuery",
            "typeVersion": 1,
            "position": [450, 300],
            "credentials": {
                "googleBigQueryOAuth2Api": {
                    "id": BQ_CREDENTIAL_ID,
                    "name": BQ_CREDENTIAL_NAME
                }
            }
        },
        {
            "parameters": {
                "functionCode": """
items.forEach(item => {
item.json.valor_total = parseFloat(item.json.valor_total || 0);
});
return items;
"""
            },
            "name": "Transform",
            "type": "n8n-nodes-base.function",
            "typeVersion": 1,
            "position": [700, 300]
        },
        {
            "parameters": {
                "functionCode": """
const rows = items.map(i => `
<tr>
<td>${i.json.executivo}</td>
<td>${i.json.nome_veiculo}</td>
<td>R$ ${i.json.valor_total.toFixed(2)}</td>
</tr>
`).join('');
return [{
json:{
html:`
<h2>Relatório Basket</h2>
<table border="1" cellpadding="5">
<tr>
<th>Executivo</th>
<th>Veículo</th>
<th>Valor</th>
</tr>
${rows}
</table>
`
}
}];
"""
            },
            "name": "HTML Report",
            "type": "n8n-nodes-base.function",
            "typeVersion": 1,
            "position": [950, 300]
        },
        {
            "parameters": {
                "fromEmail": EMAIL_FROM,
                "toEmail": EMAIL_TO,
                "subject": EMAIL_SUBJECT,
                "html": "={{$json.html}}"
            },
            "name": "Send Email",
            "type": "n8n-nodes-base.emailSend",
            "typeVersion": 1,
            "position": [1200, 300]
        }
    ],
    "connections": {
        "Cron": {
            "main": [[{"node": "BigQuery", "type": "main", "index": 0}]]
        },
        "BigQuery": {
            "main": [[{"node": "Transform", "type": "main", "index": 0}]]
        },
        "Transform": {
            "main": [[{"node": "HTML Report", "type": "main", "index": 0}]]
        },
        "HTML Report": {
            "main": [[{"node": "Send Email", "type": "main", "index": 0}]]
        }
    }
}

response = requests.post(
    N8N_URL,
    headers=headers,
    data=json.dumps(workflow)
)

print(response.status_code)
print(response.text)