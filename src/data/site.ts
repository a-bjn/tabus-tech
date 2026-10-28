export const SITE = {
  name: "Tabus Tech",
  // TODO: înlocuiește cu datele reale de contact înainte de lansare.
  email: "contact@tabus-tech.ro",
  phone: "+40 700 000 000",
  phoneHref: "tel:+40700000000",
  area: "România",
};

/** Ofertă lansare — actualizează sau dezactivează când nu mai e valabilă. */
export const PROMO = {
  enabled: true,
  message:
    "Primii 100 de clienți: reducere 20% și mentenanță gratuită timp de 1 an.",
  ctaLabel: "Profită acum",
  ctaHref: "#contact",
};

export const NAV = [
  { id: "proces", label: "Proces" },
  { id: "servicii", label: "Servicii" },
  { id: "tablou", label: "Tablou live" },
  { id: "cctv", label: "CCTV" },
  { id: "domenii", label: "Domenii" },
];

export const MARQUEE = [
  "Joasă tensiune",
  "Medie tensiune",
  "Tablouri electrice",
  "Circuite de forță",
  "Circuite de comandă",
  "Automatizări industriale",
  "PLC",
  "CCTV",
  "Mentenanță",
  "Diagnosticare",
];

export const STEPS = [
  {
    n: "01",
    title: "Proiectare",
    lead: "Începem pe hârtie, ca să nu improvizăm pe șantier.",
    text: "Releveu, calculul sarcinilor, scheme monofilare, dimensionarea cablurilor și a protecțiilor. Documentație tehnică pentru clădiri rezidențiale, spații comerciale și obiective industriale.",
    tags: ["Scheme monofilare", "Calcul de sarcină", "Documentație"],
  },
  {
    n: "02",
    title: "Execuție",
    lead: "Montaj curat, trasee ordonate, fiecare circuit etichetat.",
    text: "Instalații electrice de joasă și medie tensiune, circuite de forță și comandă, tablouri de distribuție și automatizare, executate după proiect și normativele aplicabile.",
    tags: ["Joasă / medie tensiune", "Tablouri", "Forță & comandă"],
  },
  {
    n: "03",
    title: "Punere în funcțiune",
    lead: "Nimic nu se predă până nu e verificat.",
    text: "Verificarea aparatelor de protecție, teste și măsurători, parametrizarea echipamentelor și a PLC-urilor, instruirea beneficiarului și predarea documentației.",
    tags: ["Verificări", "Parametrizare", "Predare"],
  },
  {
    n: "04",
    title: "Mentenanță",
    lead: "Un sistem bun rămâne bun doar dacă e întreținut.",
    text: "Revizii periodice ale instalațiilor, tablourilor și automatizărilor, înlocuiri preventive și optimizarea sistemelor existente, astfel încât oprirea neplanificată să fie excepția.",
    tags: ["Revizii", "Preventiv", "Optimizare"],
  },
  {
    n: "05",
    title: "Diagnosticare & remediere",
    lead: "Găsim cauza, nu doar simptomul.",
    text: "Identificarea defectelor din instalații, comenzi și protecții, intervenții de remediere și recomandări pentru ca problema să nu se repete.",
    tags: ["Depanare", "Cauza reală", "Intervenții"],
  },
];

export const SERVICES = [
  {
    n: "01",
    title: "Instalații electrice",
    kicker: "Proiectare · Execuție · Mentenanță",
    text: "Instalații electrice de joasă și medie tensiune pentru clădiri rezidențiale, spații comerciale și obiective industriale, de la proiect până la întreținere.",
    points: [
      "Proiecte electrice pentru toate tipurile de clădiri",
      "Execuția și întreținerea instalațiilor",
      "Verificare și diagnosticare",
      "Remedierea defecțiunilor",
    ],
    icon: "bolt",
  },
  {
    n: "02",
    title: "Forță, comandă & protecție",
    kicker: "Circuite · Tablouri · Aparataj",
    text: "Circuite de forță și comandă pentru echipamente și utilaje, tablouri de distribuție și automatizare, cu protecții dimensionate corect.",
    points: [
      "Proiectarea și realizarea circuitelor de forță",
      "Circuite de comandă pentru utilaje",
      "Tablouri de distribuție, comandă, automatizare",
      "Protecție la suprasarcină și scurtcircuit",
    ],
    icon: "panel",
  },
  {
    n: "03",
    title: "Automatizări industriale",
    kicker: "Control · Monitorizare · PLC",
    text: "Automatizarea proceselor și echipamentelor: comandă motoare, integrare senzori, relee, contactoare și controlere programabile, după caz.",
    points: [
      "Comandă pentru motoare electrice și utilaje",
      "Sisteme de control și monitorizare",
      "Integrare senzori, relee, contactoare, PLC",
      "Mentenanță și optimizare",
    ],
    icon: "gear",
  },
  {
    n: "04",
    title: "CCTV & securitate video",
    kicker: "Camere · Stocare · Acces remote",
    text: "Sisteme de supraveghere video proiectate pentru obiectivul tău: camere, înregistrare, stocare locală sau în rețea și acces de la distanță.",
    points: [
      "Proiectare și instalare sisteme CCTV",
      "Camere și echipamente de înregistrare",
      "Stocare locală sau în rețea",
      "Acces la distanță și mentenanță",
    ],
    icon: "eye",
  },
];

export const SECTORS = [
  {
    id: "rezidential",
    label: "Rezidențial",
    headline: "Casa ta, instalată ca la carte.",
    text: "Pentru persoane fizice: instalații sigure, tablouri ordonate, iluminat și prize bine gândite, plus supraveghere video discretă și fiabilă.",
    items: [
      "Case și apartamente",
      "Tablouri electrice de distribuție",
      "Iluminat, prize, circuite dedicate",
      "Supraveghere video și acces remote",
    ],
  },
  {
    id: "comercial",
    label: "Comercial",
    headline: "Spații care funcționează fără întreruperi.",
    text: "Magazine, birouri și spații comerciale: instalații dimensionate pentru consum real, protecții corecte și sisteme CCTV care acoperă ce contează.",
    items: [
      "Magazine, birouri, spații de servicii",
      "Distribuție și protecții",
      "Iluminat tehnic și de siguranță",
      "CCTV cu stocare locală sau în rețea",
    ],
  },
  {
    id: "industrial",
    label: "Industrial",
    headline: "Utilaje care pornesc, procese care nu se opresc.",
    text: "Fabrici și ateliere: tablouri de forță și comandă, automatizări, motoare și utilaje, control și monitorizare, cu mentenanță pe termen lung.",
    items: [
      "Fabrici, ateliere, hale",
      "Tablouri de forță, comandă, automatizare",
      "Comandă motoare și utilaje",
      "PLC, senzori, monitorizare",
    ],
  },
];

export const LOADS = [
  { id: "light", label: "Iluminat", amps: 3, rating: "B6" },
  { id: "sockets", label: "Prize", amps: 8, rating: "B16" },
  { id: "oven", label: "Cuptor / plită", amps: 14, rating: "C20" },
  { id: "motor", label: "Pompă / motor", amps: 12, rating: "C16" },
  { id: "cctv", label: "CCTV + rețea", amps: 1, rating: "B2" },
] as const;

export const MAIN_BREAKER_AMPS = 32;

export const CAMERAS = [
  { id: "01", name: "Intrare principală", scene: "gate" },
  { id: "02", name: "Hală producție", scene: "hall" },
  { id: "03", name: "Parcare", scene: "lot" },
  { id: "04", name: "Depozit", scene: "rack" },
] as const;

export const CONTACT_TOPICS = [
  "Instalații electrice",
  "Tablouri / forță & comandă",
  "Automatizări",
  "CCTV",
  "Mentenanță / depanare",
];
