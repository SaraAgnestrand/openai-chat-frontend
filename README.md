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

Vite (bundler och dev-server)

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

git clone https://github.com/SaraAgnestrand/openai-chat-frontend.git 
cd openai-chat-frontend

# Installera beroenden

npm install

# Starta utvecklingsserver
   npm run dev

Appen körs på http://localhost:5173 <br>
Dev-proxy: anrop till /api/* proxas till http://localhost:3001/* (se vite.config.ts)

# Bygga för produktion
   npm run build

# Projektstruktur 
   src/ <br>
   components/ # React-komponenter<br>
   lib/ # appConfig, helpers<br>
   appConfig.ts # config (useRag, ragTopK, m.m.)<br>
   styles/ # vanilla-extract CSS<br>
   config.ts # API_BASE
   App.tsx # Huvudkomponent<br>
   main.tsx # Startpunkt<br>
   index.html # Rot-html<br>
   vite.config.ts # dev-port 5173 + proxy till 3001<br>

# Miljövariabler 

Exempel om du behöver en URL till backend:

VITE_API_URL=http://localhost:3001

# Framtida förbättringar 

Ljus/mörkt läge

Bättre felhantering vid nätverksproblem
