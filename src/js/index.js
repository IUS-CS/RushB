
//Scene 1

var config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 1100,
    physics: {default: 'arcade',
    arcade: {
        gravity: { y: 700 },
        debug: false
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
this.load.image("background","assets/background0.png");
this.load.tilemapTiledJSON("map", "assets/map2.json");
this.load.image('star', 'assets/star.png');
this.load.spritesheet('dude', 
    'assets/dude.png',
    { frameWidth: 32, frameHeight: 48 }
);
}

function create (){

//map stuff
const map = this.make.tilemap({key: "map"});
const platformTileset = map.addTilesetImage("tileset1", "platformSet");
const background = map.addTilesetImage("background0","background");
const belowLayer = map.createStaticLayer("background", background, 0,0);
const worldLayer = map.createStaticLayer("platforms", platformTileset, 0,0);

belowLayer.setCollisionByProperty({collides:true});
worldLayer.setCollisionByProperty({collides:true});

//player stuff
player = this.physics.add.sprite(100, 450, 'dude');

player.setBounce(.4);
this.cameras.main.setBounds(0, 0, 2600, 1500);
this.physics.world.setBounds(0,0,2700,1500);

player.setCollideWorldBounds(true);

//camera stuff
const camera = this.cameras.main;

//camera constraints

this.cameras.main.startFollow(player, true, .16, .16);
//speed of the camera
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

stars = this.physics.add.group({
key: 'star',
repeat: 9,
setXY: { x: 15, y: 100, stepX: 185 }
});

stars.children.iterate(function (child) {

child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

this.physics.add.collider(stars, worldLayer);
this.physics.add.collider(stars, belowLayer);
this.physics.add.overlap(player, stars, collectStar, null, this);
function collectStar (player, star) {
    star.disableBody(true, true);

    if (stars.countActive(true) === 0){
        stars.children.iterate(function (child) {
        child.enableBody(true, child.x, 0, true, true);
    });
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    }

}
cursors = this.input.keyboard.createCursorKeys();

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

    if (cursors.space.isDown && player.body.blocked.down){
        player.setVelocityY(-500);
    }
    }//update

function render(){
    game.debug(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
}
