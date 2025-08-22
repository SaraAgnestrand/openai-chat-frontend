1. Titel & kort beskrivning

# NextChat – Frontend

En React-baserad chattklient som kopplas till en Node.js-backend med OpenAI:s API.  
Byggd med Vite, TypeScript och vanilla-extract CSS.

2. Funktioner

Skriva meddelanden till AI-chatboten

Få svar med kontext från backend

Enkel, responsiv design

Byggt med TypeScript för typkontroll

3. Teknisk stack

React + TypeScript

Vite (bundler och dev-server)

vanilla-extract CSS för styling

Fetch API för kommunikation med backend

4. Förkrav

Node.js
v18 eller senare

Backend-projektet igång på http://localhost:3000

5. Installation

# Klona repot

git clone https://github.com/dittnamn/nextchat-frontend.git
cd nextchat-frontend

# Installera beroenden

npm install

6. Starta utvecklingsserver
   npm run dev

Appen körs på http://localhost:5173
.

7. Bygga för produktion
   npm run build

8. Projektstruktur (kort)
   src/
   components/ # React-komponenter
   styles/ # vanilla-extract CSS
   App.tsx # Huvudkomponent
   main.tsx # Startpunkt
   index.html # Rot-html

9. Miljövariabler (om några)

Exempel om du behöver en URL till backend:

VITE_API_URL=http://localhost:3000

10. Framtida förbättringar (valfritt)

Möjlighet att spara konversationer lokalt

Ljus/mörkt läge

Bättre felhantering vid nätverksproblem
