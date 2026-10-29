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
  { id: "proiecte", label: "Proiecte" },
  { id: "domenii", label: "Domenii" },
  { id: "preturi", label: "Prețuri" },
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

export type ServiceVisualKind = "electric" | "protection" | "automation" | "cctv";

export const SERVICES: {
  n: string;
  title: string;
  kicker: string;
  text: string;
  points: string[];
  visual: ServiceVisualKind;
}[] = [
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
    visual: "electric",
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
    visual: "protection",
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
    visual: "automation",
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
    visual: "cctv",
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

export type ProjectArt = "substation" | "plc" | "home" | "retail" | "cctv";

/**
 * TODO: exemple provizorii, înlocuiește cu proiectele reale înainte de lansare
 * (titlu, locație, specificații și rezultat).
 */
export const PROJECTS = [
  {
    id: "hala",
    art: "substation" as ProjectArt,
    kind: "Industrial · Medie tensiune",
    title: "Alimentare nouă pentru hală de producție",
    place: "Ilfov",
    year: "2025",
    result:
      "Racord în medie tensiune, post de transformare 20/0,4 kV, tablou general de joasă tensiune și compensarea factorului de putere.",
    specs: [
      ["Putere", "630 kVA"],
      ["Durată", "14 săptămâni"],
      ["Scope", "Proiect + execuție"],
    ],
  },
  {
    id: "linie",
    art: "plc" as ProjectArt,
    kind: "Industrial · Automatizare",
    title: "Automatizarea unei linii de ambalare",
    place: "Prahova",
    year: "2025",
    result:
      "Tablou de comandă cu PLC, variatoare pentru 12 motoare și vizualizare locală. Oprirea liniei redusă la minimum.",
    specs: [
      ["Motoare", "12"],
      ["Durată", "6 săptămâni"],
      ["Scope", "Execuție + PIF"],
    ],
  },
  {
    id: "vila",
    art: "home" as ProjectArt,
    kind: "Rezidențial",
    title: "Instalație electrică completă, vilă de 280 mp",
    place: "Cluj",
    year: "2024",
    result: "Tablou cu protecții diferențiale pe circuite, iluminat scenografic și supraveghere video discretă.",
    specs: [
      ["Putere", "22 kW"],
      ["Durată", "5 săptămâni"],
    ],
  },
  {
    id: "retail",
    art: "retail" as ProjectArt,
    kind: "Comercial",
    title: "Magazin de 1.200 mp: tablouri și iluminat",
    place: "București",
    year: "2024",
    result: "Execuție în program redus, fără oprirea vânzărilor, cu documentație pentru recepție.",
    specs: [
      ["Putere", "85 kW"],
      ["Durată", "4 săptămâni"],
    ],
  },
  {
    id: "depozit",
    art: "cctv" as ProjectArt,
    kind: "CCTV · Securitate",
    title: "Supraveghere video pentru depozit logistic",
    place: "Giurgiu",
    year: "2025",
    result: "Acoperire completă a perimetrului și a rampelor, înregistrare centralizată și acces de la distanță.",
    specs: [
      ["Camere", "32"],
      ["Durată", "3 săptămâni"],
    ],
  },
];

/**
 * TODO: prețuri orientative provizorii, înlocuiește cu tarifele reale înainte de lansare.
 * `price: null` afișează „La ofertă”.
 */
export const PRICING = [
  {
    id: "electric",
    label: "Instalații electrice",
    note: "Preț orientativ pentru lucrare completă: proiect, materiale standard, manoperă și punere în funcțiune.",
    plans: [
      {
        name: "Apartament",
        price: 4500,
        unit: "lei",
        blurb: "Instalație nouă sau refăcută pentru 2–3 camere.",
        features: ["Tablou cu protecții diferențiale", "Circuite de iluminat și prize", "Verificări și documentație", "Garanție 24 de luni"],
        featured: false,
      },
      {
        name: "Casă / vilă",
        price: 12000,
        unit: "lei",
        blurb: "Instalație completă, de la tabloul general la ultimul circuit.",
        features: [
          "Proiect și scheme monofilare",
          "Tablou general și tablouri pe nivel",
          "Iluminat, forță și priză de pământ",
          "Verificări și documentație",
          "Garanție 24 de luni",
        ],
        featured: true,
      },
      {
        name: "Comercial / industrial",
        price: null,
        unit: "",
        blurb: "Spații comerciale, hale și obiective industriale, pe bază de proiect.",
        features: [
          "Releveu și calcul de sarcină",
          "Medie și joasă tensiune",
          "Tablouri de forță și comandă",
          "Punere în funcțiune și documentație",
        ],
        featured: false,
      },
    ],
  },
  {
    id: "cctv",
    label: "CCTV",
    note: "Preț orientativ cu camere, înregistrator, cablare și configurare incluse.",
    plans: [
      {
        name: "Start",
        price: 3200,
        unit: "lei",
        blurb: "Locuințe și spații mici.",
        features: ["4 camere Full HD", "Înregistrator și hard disk", "Cablare și montaj", "Acces de pe telefon"],
        featured: false,
      },
      {
        name: "Standard",
        price: 6500,
        unit: "lei",
        blurb: "Case, birouri și magazine.",
        features: ["8 camere, interior și exterior", "Vedere pe timp de noapte", "Detecție de mișcare cu alerte", "Cablare, montaj și instruire"],
        featured: true,
      },
      {
        name: "Avansat",
        price: 13000,
        unit: "lei",
        blurb: "Depozite, hale și perimetre extinse.",
        features: ["16+ camere", "Înregistrare centralizată", "Acces la distanță securizat", "Proiect și punere în funcțiune"],
        featured: false,
      },
    ],
  },
  {
    id: "mentenanta",
    label: "Mentenanță",
    note: "Preț orientativ pe an, pentru instalații existente.",
    plans: [
      {
        name: "Verificare anuală",
        price: 600,
        unit: "lei / an",
        blurb: "O vizită pe an, ca să știi în ce stare e instalația.",
        features: ["Verificarea tabloului și a protecțiilor", "Măsurători esențiale", "Raport scris", "Recomandări de remediere"],
        featured: false,
      },
      {
        name: "Standard",
        price: 250,
        unit: "lei / lună",
        blurb: "Revizii periodice și intervenții prioritare.",
        features: ["2 vizite pe an", "Intervenție prioritară", "Raport după fiecare vizită", "Reducere la remedieri"],
        featured: true,
      },
      {
        name: "Industrial",
        price: null,
        unit: "",
        blurb: "Contract adaptat instalației și programului tău.",
        features: ["Plan de mentenanță preventivă", "Timp de răspuns stabilit prin contract", "Diagnosticare și remediere", "Asistență tehnică dedicată"],
        featured: false,
      },
    ],
  },
];

export const INCLUDED = [
  "Vizită și ofertă fără costuri",
  "Proiect și documentație tehnică",
  "Garanție pentru lucrare",
  "Un singur responsabil, de la început la final",
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
