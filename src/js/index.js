
//Scene 1

var config = {
    type: Phaser.AUTO,
    width: 2560,
    height: 960,
    physics: {default: 'arcade',
    arcade: {
        gravity: { y: 700 },
        debug: true
    }},
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};

var game = new Phaser.Game(config);

function preload (){

this.load.image("platformSet","assets/Tileset.png");
//this.load.image("testPlatforms","assets/Tileset.png");

this.load.image("background","assets/background0.png");
//this.load.image('volcanoBack','assets/Vulcan-volcano.png')
this.load.tilemapTiledJSON("map", "assets/map2.json");
//this.load.image('sky', 'assets/sky.png');
//this.load.image('ground', 'assets/platform.png');
this.load.image('star', 'assets/star.png');
//this.load.image('bomb', 'assets/bomb.png');
this.load.spritesheet('dude', 
    'assets/dude.png',
    { frameWidth: 32, frameHeight: 48 }
);
/*
this.load.spritesheet('spaceman', 
    'assets/spaceman.png',
    { frameWidth: 180, frameHeight: 150 }
);
*/
}

function create (){

//map stuff
const map = this.make.tilemap({key: "map"});
const platformTileset = map.addTilesetImage("tileset1", "platformSet");
const background = map.addTilesetImage("background0","background");
//const newPlatform = map.addTilesetImage("test","testPlatforms");

const belowLayer = map.createStaticLayer("background", background, 0,0);
const worldLayer = map.createStaticLayer("platforms", platformTileset, 0,0);
//const platformLayer = map.createStaticLayer("testPlatforms",newPlatform, 0,0);
//belowLayer.setCollisionByProperty({collides:true});
worldLayer.setCollisionByProperty({collides:true});
//platformLayer.setCollisionByProperty({collides:true});

//player stuff
player = this.physics.add.sprite(100, 450, 'dude');

player.setBounce(0.4);
this.physics.world.setBounds(0,0,3392,1050);
//this.physics.world.bounds.height = belowLayer.height;

player.setCollideWorldBounds(true);


//camera stuff
const camera = this.cameras.main;
/*
controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    speed: .5
});*/
//camera constraints
this.cameras.main.setBounds(0,0, 3392, 1000);
this.cameras.main.startFollow(player, true, .16, .16);//speed of the camera
this.cameras.main.setZoom(1.5);

this.anims.create({  
key: 'left',
frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
frameRate: 10,
repeat: -1
});

this.anims.create({
key: 'turn',
frames: [ { key: 'dude', frame: 4 } ],
frameRate: 20
});

this.anims.create({
key: 'right',
frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
frameRate: 10,
repeat: -1
});

this.anims.create({  
    key: 'd',
    frames: this.anims.generateFrameNumbers('spaceman', { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1
    });



this.physics.add.collider(player, platformTileset);
this.physics.add.collider(player, worldLayer);
this.physics.add.collider(player, belowLayer);

/*
platforms = this.physics.add.staticGroup();
platforms.create(400, 600, 'ground').setScale(2).refreshBody();
platforms.create(600, 450, 'ground');
platforms.create(50, 350, 'ground');
platforms.create(380, 120, 'ground');
*/

stars = this.physics.add.group({
key: 'star',
repeat: 9,
setXY: { x: 12, y: 0, stepX: 70 }
});

stars.children.iterate(function (child) {

child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

//this.physics.add.collider(stars, platforms);

//this.physics.add.collider(player, platformTileset);
//this.physics.add.overlap(player, stars, collectStar, null, this);
function collectStar (player, star) {
    star.disableBody(true, true);
    score += 5;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0){
        stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
    });
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    }

}
cursors = this.input.keyboard.createCursorKeys();
//cursors = this.input.keyboard.createCursorKeys();

var score = 0;
var scoreText;

scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

}//create

function update (time){
    //controls.update(delta);
    if (cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown)
        player.setVelocityY(-700);
}//update

function render(){
    game.debug(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
}
