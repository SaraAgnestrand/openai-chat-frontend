# NextChat – Frontend

En React-baserad chattklient som kopplas till en Node.js-backend med OpenAI:s API.  
Byggd med Vite, TypeScript och vanilla-extract CSS.

# Funktioner

Skriva meddelanden till AI-chatboten

Få svar med kontext från backend

Enkel, responsiv design

Byggt med TypeScript för typkontroll

# Teknisk stack

React + TypeScript

Vite (bundler och dev-server)

vanilla-extract CSS för styling

Fetch API för kommunikation med backend

# Förkrav

Node.js
v18 eller senare

Backend-projektet igång på http://localhost:3000

# Installation

# Klona repot

git clone https://github.com/dittnamn/nextchat-frontend.git
cd nextchat-frontend

# Installera beroenden

npm install

# Starta utvecklingsserver
   npm run dev

Appen körs på http://localhost:5173
.

# Bygga för produktion
   npm run build

# Projektstruktur (kort)
   src/
   components/ # React-komponenter
   styles/ # vanilla-extract CSS
   App.tsx # Huvudkomponent
   main.tsx # Startpunkt
   index.html # Rot-html

# Miljövariabler 

Exempel om du behöver en URL till backend:

VITE_API_URL=http://localhost:3001

# Framtida förbättringar (valfritt)

Möjlighet att spara konversationer lokalt

Ljus/mörkt läge

Bättre felhantering vid nätverksproblem
