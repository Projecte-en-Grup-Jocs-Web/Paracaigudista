const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB', // blau cel
    parent: 'game-container',    // div on inserir el joc
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }   // sense gravetat (simulem la caiguda amb obstacles que pugen)
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;      // jugador
let cursors;     // tecles
let windGroup;   // grup d'obstacles (rafegades de vent)
let hits = 0;    // impactes acumulats
const maxHits = 3;
let hitText;     // text de la barra d'equilibri
let timerText;   // text del temporitzador
let gameTime = 0; 
const winTime = 60;  // segons per guanyar
let gameOver = false;

// Aquesta funció es crida quan es fa clic al botó "Iniciar joc"
function startGame() {
    new Phaser.Game(config);
}

function preload() {
    // Crear textures placeholders mitjançant Graphics:

    // Jugador: cercle verd
    this.graphics = this.add.graphics();
    this.graphics.fillStyle(0x00ff00, 1);
    this.graphics.fillCircle(20, 20, 20); // cercle radi 20
    this.graphics.generateTexture('player', 40, 40);
    this.graphics.clear();

    // Rafaga de vent: rectangle gris
    this.graphics.fillStyle(0x888888, 1);
    this.graphics.fillRect(0, 0, 40, 20); // rectangle 40x20
    this.graphics.generateTexture('wind', 40, 20);
    this.graphics.clear();
}

function create() {
    // Crear jugador amb física i col·lisió amb límits del món
    player = this.physics.add.sprite(config.width / 2, 100, 'player');
    player.setCollideWorldBounds(true);

    // Configurar tecles d'entrada (esquerra/dreta)
    cursors = this.input.keyboard.createCursorKeys();

    // Crear grup per a les rafegades de vent
    windGroup = this.physics.add.group();

    // Detectar col·lisions entre jugador i rafegades
    this.physics.add.overlap(player, windGroup, hitWind, null, this);

    // Texts d'interfície: Equilibri i Temps
    hitText = this.add.text(16, 16, 'Equilibri: ' + (maxHits - hits), { fontSize: '20px', fill: '#000' });
    timerText = this.add.text(600, 16, 'Temps: ' + gameTime, { fontSize: '20px', fill: '#000' });

    // Temporitzador per augmentar el comptador cada segon
    this.time.addEvent({ delay: 1000, callback: updateTimer, callbackScope: this, loop: true });

    // Temporitzador per generar una nova rafega cada segon
    this.time.addEvent({ delay: 1000, callback: spawnWind, callbackScope: this, loop: true });
}

function update() {
    if (gameOver) {
        return; // si el joc ja ha acabat, no fer res més
    }
    // Moviment horitzontal del jugador
    player.setVelocityX(0);
    if (cursors.left.isDown) {
        player.setVelocityX(-300);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);
    }

    // Eliminar rafegades que ja hagin sortit de la pantalla per la part superior
    windGroup.getChildren().forEach(function(wind) {
        if (wind.y < -wind.displayHeight) {
            wind.destroy();
        }
    });
}

function hitWind(player, wind) {
    // Quan el jugador impacta una rafega
    wind.destroy();    // eliminar rafega
    hits++;
    hitText.setText('Equilibri: ' + (maxHits - hits));
    if (hits >= maxHits) {
        endGame(false, this);  // fi del joc (has perdut)
    }
}

function spawnWind() {
    // Crear rafega al fons amb posició horitzontal aleatòria
    let x = Phaser.Math.Between(50, config.width - 50);
    let wind = windGroup.create(x, config.height + 20, 'wind');
    wind.setVelocityY(-Phaser.Math.Between(150, 250)); // moure cap amunt
}

function updateTimer() {
    gameTime++;
    timerText.setText('Temps: ' + gameTime);
    if (gameTime >= winTime) {
        endGame(true, this);   // has sobreviscut 60s, has guanyat!
    }
}

function endGame(won, scene) {
    gameOver = true;
    const message = won ? 'Has guanyat!' : 'Has perdut!';
    // Mostrar missatge al centre de la pantalla
    scene.add.text(config.width/2, config.height/2, message, 
        { fontSize: '40px', fill: '#f00' }).setOrigin(0.5);
    // Tornar al menú principal després de 3 segons
    scene.time.delayedCall(3000, () => {
        window.location.reload();
    });
}