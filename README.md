# NextChat – Frontend

En React/TypeScript-baserad chattklient som kopplas till en Node.js-backend med OpenAI:s API.  
Byggd med Vite, TypeScript och vanilla-extract CSS.

# Funktioner

- Chatta med LLM via `/api/chat`
- RAG (auto-läge): hämtar träffar från backend och **injicerar kontext endast när likheten är hög**. 
  Om träffen är svag skickas frågan som vanlig chat **utan** RAG. **Källor** visas bara när RAG använts.
- Konversationer sparas och hittas på historik
- Kopiera-knapp på svar
- Enkel konfiguration via `localStorage`

# Teknisk stack

React + TypeScript

Vite (dev-server och proxy)

vanilla-extract CSS för styling

Fetch API för kommunikation med backend

# Förkrav

Node.js
v18 eller senare

Backend-projektet igång på http://localhost:3001 <br>
Se backend-repo för installation, miljövariabler och indexering: openai-chat-backend <br>
Utan RAG (dvs. useRag: false) funkar UI:t som en vanlig chat och kräver bara att backend är uppe.

# Installation

# Klona repot

```bash
git clone https://github.com/SaraAgnestrand/openai-chat-frontend.git 
cd openai-chat-frontend
```

# Installera beroenden

```bash
npm install
```

# Starta utvecklingsserver
   
```bash
npm run dev
```

Appen körs på http://localhost:5173 <br>
Dev-proxy: anrop till /api/* proxas till http://localhost:3001/* (se vite.config.ts)

# Bygga för produktion

```bash
npm run build
```

# Projektstruktur 
   src/ <br>
   components/ # React-komponenter (Chat m.fl.)<br>
   lib/ <br>
   appConfig.ts # config (useRag, ragTopK, m.m.)<br>
   styles/ # vanilla-extract CSS<br>
   config.ts # API_BASE
   App.tsx # Huvudkomponent<br>
   main.tsx # Startpunkt<br>
   index.html # Rot-html<br>
   vite.config.ts # dev-port 5173 + proxy till 3001<br>

# Konfiguration

Frontenden läser en config från localStorage (nyckel nextchat:config). Exempel:
```json
{
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "personality": "vänlig",
  "customSystem": "",
  "theme": "light",

  "useRag": true,
  "ragTopK": 4,
  "ragSimThreshold": 0.6  
}
```
Alternativt kan du sätta backend-URL via env:<br>
VITE_API_URL=http://localhost:3001 (om inte satt används Vite-proxyn i dev).

# Miljövariabler 

Exempel om du behöver en URL till backend:

VITE_API_URL=http://localhost:3001 (valfritt annars används Vites proxy)

# Framtida förbättringar 

Ljus/mörkt läge

Bättre felhantering vid nätverksproblem
