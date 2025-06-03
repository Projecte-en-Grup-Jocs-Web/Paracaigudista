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



let winTime =60;
let maxHits = 3;

let opcionsGuardades = JSON.parse(localStorage.getItem('opcions')) || { difficulty: 'normal' };

switch (opcionsGuardades.difficulty) {
  case 'easy':
    winTime = 30;
    maxHits = 4;
    break;
  case 'hard':
    winTime = 120;
    maxHits = 2;
    break;
  case 'normal':
  default:
    winTime = 60;
    maxHits = 3;
    break;
}

let player;      // jugador
let cursors;     // tecles
let windGroup;   // grup d'obstacles (rafegades de vent)
let hits = 0;    // impactes acumulats
let keys;



let hitText;     // text de la barra d'equilibri
let timerText;   // text del temporitzador
let gameTime = 0;




let gameOver = false;
let isPaused = false;
let pauseOverlay;
let resumeButton;
let exitButton;
//variables barra temps
let timeBar;         // Gràfic de la barra
let timeBarHeight = 300;  // Alçada inicial de la barra
let timeBarMaxHeight = 300;
let timeBarX = config.width - 60; // A la dreta
let timeBarY = config.height - 350;
let pauseButtonPhaser;
//variables barra equilibri
let balanceBar;
let balanceBarHeight = 150;
let balanceBarMaxHeight = 150;
let balanceBarX = config.width - 60;
let balanceBarY = config.height - 350 - balanceBarHeight - 10;

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


    //imatges
    this.load.image('equilibri', 'Resources/CaigudaLliure.png');
    this.load.image('paracaigudes', 'Resources/Paracaigudes.png');
}

function create() {
    // Crear jugador
    player = this.physics.add.sprite(config.width / 2, 100, 'player');
    player.setCollideWorldBounds(true);

    // Tecles: fletxes + A/D
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Grup d'obstacles (rafegues de vent)
    windGroup = this.physics.add.group();

    // Col·lisió entre jugador i obstacles
    this.physics.add.overlap(player, windGroup, hitWind, null, this);

    // Barres d'estat
    timeBar = this.add.graphics();
    balanceBar = this.add.graphics();
    updateTimeBar();
    updateBalanceBar();

    // Temporitzadors
    this.time.addEvent({ delay: 1000, callback: updateTimer, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 1000, callback: spawnWind, callbackScope: this, loop: true });

    // Botó de pausa (clic)
    pauseButtonPhaser = this.add.text(16, 16, '⏸️ Pausa', {
        fontSize: '20px',
        fill: '#000',
        backgroundColor: '#ffcc00',
        padding: { x: 10, y: 5 }
    }).setInteractive();
    pauseButtonPhaser.on('pointerdown', () => togglePause(this));

    // Pausa amb tecla ESC
    this.input.keyboard.on('keydown-ESC', () => togglePause(this));
}

function update() {
    if (gameOver || isPaused) {
        return;
    }

    player.setVelocityX(0);
    if (cursors.left.isDown || keys.left.isDown) {
    player.setVelocityX(-300);
    } else if (cursors.right.isDown || keys.right.isDown) {
    player.setVelocityX(300);
    }

    windGroup.getChildren().forEach(wind => {
        if (wind.y < -wind.displayHeight) wind.destroy();
    });

    this.add.image(config.width-80, config.height-380, 'equilibri').setScale(0.05);
    this.add.image(config.width-80, config.height-80, 'paracaigudes').setScale(0.025);
}

function hitWind(player, wind) {
    wind.destroy();
    hits++;
    updateBalanceBar();
    if (hits >= maxHits) {
        endGame(false, this);
    }
}

function spawnWind() {
    if (gameOver || isPaused) return; // No spawnejis si pausa o fi

    let x = Phaser.Math.Between(50, config.width - 50);
    let wind = windGroup.create(x, config.height + 20, 'wind');
    wind.setVelocityY(-Phaser.Math.Between(150, 250));
}

function updateTimer() {
    if (gameOver || isPaused) return; // No actualitzis si pausa o fi

    gameTime++;
    updateTimeBar();

    if (gameTime >= winTime) {
        endGame(true, this);
    }
}
//funcions d'actualitzacions de barres
function updateBalanceBar() {
    const remainingRatio = Math.max(0, (maxHits - hits) / maxHits);
    const currentHeight = remainingRatio * balanceBarMaxHeight;

    balanceBar.clear();
    balanceBar.fillStyle(0xff5555, 1); // Vermell clar
    balanceBar.fillRect(balanceBarX, balanceBarY + (balanceBarMaxHeight - currentHeight), 20, currentHeight);
    balanceBar.lineStyle(2, 0x000000);
    balanceBar.strokeRect(balanceBarX, balanceBarY, 20, balanceBarMaxHeight);
}

function updateTimeBar() {
    const remainingRatio = Math.max(0, (winTime - gameTime) / winTime);
    const currentHeight = remainingRatio * timeBarMaxHeight;

    timeBar.clear();
    timeBar.fillStyle(0x00aaff, 1);  // Blau clar
    timeBar.fillRect(timeBarX, timeBarY + (timeBarMaxHeight - currentHeight), 20, currentHeight);
    timeBar.lineStyle(2, 0x000000);
    timeBar.strokeRect(timeBarX, timeBarY, 20, timeBarMaxHeight);
}

function showPauseMessage(scene) {
    const pauseText = scene.add.text(config.width / 2, config.height / 2, 'Joc en pausa\nFes clic per continuar', {
        fontSize: '32px',
        fill: '#000',
        backgroundColor: '#ffffff',
        padding: { x: 20, y: 10 },
        align: 'center'
    }).setOrigin(0.5).setDepth(1).setInteractive();

    pauseText.on('pointerdown', () => {
        pauseText.destroy();
        scene.scene.resume();
        isPaused = false;
    });
}

function showPauseMenu(scene) {
    pauseOverlay = scene.add.rectangle(config.width / 2, config.height / 2, config.width, config.height, 0x000000, 0.5).setDepth(1);

    resumeButton = scene.add.text(config.width / 2, config.height / 2 - 30, '▶️ Reprendre', {
        fontSize: '32px',
        fill: '#ffffff',
        backgroundColor: '#00aa00',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(2);

    resumeButton.on('pointerdown', () => {
    // Restauro velocitat original
    windGroup.getChildren().forEach(wind => {
        if (wind.originalVelocityY !== undefined) {
            wind.setVelocityY(wind.originalVelocityY);
            delete wind.originalVelocityY; // ja no cal guardar-la
        }
    });
    destroyPauseMenu();
    isPaused = false;
    });

    exitButton = scene.add.text(config.width / 2, config.height / 2 + 30, '🔁 Sortir', {
        fontSize: '32px',
        fill: '#ffffff',
        backgroundColor: '#aa0000',
        padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive().setDepth(2);

    exitButton.on('pointerdown', () => {
        window.location.href = "index.html";
    });
}

function togglePause(scene) {
    if (gameOver) return;

    if (!isPaused) {
        isPaused = true;
        windGroup.getChildren().forEach(wind => {
            wind.originalVelocityY = wind.body.velocity.y;
            wind.setVelocityY(0);
        });
        showPauseMenu(scene);
    } else {
        windGroup.getChildren().forEach(wind => {
            if (wind.originalVelocityY !== undefined) {
                wind.setVelocityY(wind.originalVelocityY);
                delete wind.originalVelocityY;
            }
        });
        destroyPauseMenu();
        isPaused = false;
    }
}

function destroyPauseMenu() {
    pauseOverlay.destroy();
    resumeButton.destroy();
    exitButton.destroy();
}

function endGame(won, scene) {
    gameOver = true;
    const message = won ? 'Has desplegat el paracaigudes exitosament!' : 'Has perdut l\'equilibri!';
    scene.add.text(config.width / 2, config.height / 2, message, { fontSize: '40px', fill: '#f00' }).setOrigin(0.5);
    scene.time.delayedCall(3000, () => {
        window.location.reload();
    });
}