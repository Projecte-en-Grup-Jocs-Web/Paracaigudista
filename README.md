# Paracaigudista
I . Introducció

Free Fall és un joc de supervivència en 2D desenvolupat amb el motor de jocs web Phaser, on el jugador controla un paracaigudista en caiguda lliure. L'objectiu és mantenir l'equilibri evitant les ràfagues de vent (que empenyen els núvols),durant un temps determinat fins a desplegar exitosament el paracaigudes.
El joc presenta mecàniques simples però addictives, amb un sistema de progressió temporal i gestió de l'equilibri que requereix reflexos ràpids i concentració.
Desenvolupadors: Marti Ferrer, Alex Cantos, David Clavaguera

II . Descripció del disseny del joc

Mecànica principal

Objectiu: Sobreviure durant un temps determinat (30-120 segons segons la dificultat) evitant perdre l'equilibri
Control: Moviment horitzontal del paracaigudista amb tecles de fletxa(fletxa esquerra o fletxa dreta) o A/D
Obstacles: Núvols que representen ràfagues de vent que pujen des de baix
Sistema de vida: Barra d'equilibri que es redueix amb cada impacte (màxim 2-4 hits segons la dificultat)

Elements visuals

Escenari: Fons blau cel (#87CEEB) simulant l'altura
Jugador: Sprite del paracaigudista escalat al 10% de la mida original
Obstacles: Núvols escalats al 10%, es mouen verticalment
Interfície: Dues barres verticals a la dreta (temps restant i equilibri) amb icones representatives

Nivells de dificultat

Principiant: 30s, 4 vides, velocitat reduïda (0.7x), més temps entre obstacles
Professional: 60s, 3 vides, velocitat normal, spawn normal
Expert: 120s, 2 vides, velocitat augmentada (1.5x), menys temps entre obstacles

III . Descripció de les parts més rellevants de la implementació iv.

Esquema del projecte
├── index.html          # Pàgina principal amb menú(al clicar el menu es juga al joc dins el propi index.html)
├── html/opcions.html   # Pàgina de configuració
├── js/
│   ├── game.js         # Lògica principal del joc
│   ├── menu.js         # Gestió del menú principal
│   └── opcions.js      # Gestió de la configuració
├── styles/
│   ├── menu.css        # Estils del menú
│   └── opcions.css     # Estils de la pàgina d'opcions
└── Resources/          # Assets gràfics

Gestió de l'estat del joc

Variables globals: Control de hits, temps transcorregut, estat de pausa
Bucle principal: Funció update() que gestiona moviment del jugador i neteja d'obstacles
Sistema d'events: Temporitzadors per spawn d'obstacles i actualització de temps

Persistència de configuració
Utilitza localStorage per guardar les preferències de dificultat:
javascriptlet opcionsGuardades = JSON.parse(localStorage.getItem('opcions')) || { difficulty: 'normal' };

Sistema de barres d'estat visual

Barra de temps: Representa l'altitud restant (blau)
Barra d'equilibri: Mostra els hits restants (vermell)
Actualització dinàmica amb Graphics de Phaser

IV. Conclusions i problemes trobats

Què funciona bé

Els controls són fàcils d'utilitzar i responen bé
El joc té 3 nivells de dificultat diferents
Les barres de temps i equilibri s'entenen fàcilment
Es pot pausar i reprendre el joc sense problemes

Problemes trobats

El joc només funciona en mida 800x600 píxels
Algunes imatges es carreguen massa vegades
No hi ha so ni música
Falta sistema de puntuació

Millores possibles

Afegir sons i música
Fer-lo adaptable a diferents pantalles
Crear un sistema de punts
Optimitzar la càrrega d'imatges

V. Manual d’usuari

Requisits del sistema:

Navegador web modern amb suport per HTML5 i JavaScript
Resolució mínima recomanada: 800x600 píxels

Instal·lació:

Descarregar tots els fitxers del projecte
Assegurar-se que la estructura de carpetes es manté intacta
Obrir index.html amb un navegador web
No requereix instal·lació de software addicional

Com jugar?

Menú principal:

Iniciar joc: Comença una nova partida amb la configuració actual
Opcions: Accedeix a la configuració de dificultat

Controls del joc:

Moviment: Fletxes esquerra/dreta o tecles A/D
Pausa: Tecla ESC o botó "Pausa"; Dins de pausa per tornar el joc s'ha de tornar a prèmer la Tecla ESC o clicar el botó: CONTINUAR
Sortir: Des del menú de pausa, clicant el botó: SORTIR

Objectiu:

Controla el paracaigudista movent-lo horitzontalment
Evita xocar amb els núvols (ràfagues de vent)
Manté l'equilibri durant el temps requerit
La barra vermella mostra l'equilibri restant
La barra blava mostra el temps/altitud restant

Configuració de dificultat:

Principiant: Ideal per a nous jugadors (30 segons, 4 vides)
Professional: Dificultat equilibrada (60 segons, 3 vides)
Expert: Repte màxim (120 segons, 2 vides)

Condicions de victòria/derrota:

Victòria: Sobreviu el temps requerit sense perdre l'equilibri
Derrota: Acumula el màxim d'impactes permesos per la dificultat

Resolució de problemes:

El joc no carrega: Verificar que tots els fitxers estan presents i la consola del navegador per errors
Controls no responen: Assegurar-se que la finestra del joc té el focus
Configuració no es guarda: Verificar que el navegador permet localStorage



