// canvas settings
var CANVAS_Width = 1280
var CANVAS_Height = 720
// canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = CANVAS_Width
canvas.height = CANVAS_Height
// objects
var OBJECT_SPIKES = []
var NPCs = []
var OBJECT_Chunks = []
var SPAWNEDONEOFAKINDS = []
// sounds
var SOUND_BACKGROUND = new Audio()
// game settings
var FLOOR_Y = 450
var FLOOR_WALKABLEAREA_Y = 100
var GAME_STATUS = "menu"
var SCORE = 0
var CHUNK_POS_X = 0
var NEXT_NPC_SPAWN = Math.floor(SCORE) + Math.floor((Math.random() * 4)) + 1
var NEXT_SPIKE_SPAWN = Math.floor(SCORE) + Math.floor((Math.random() * 4)) + 1
console.log(NEXT_SPIKE_SPAWN)
var GRAVITY = 1.5
var PLAYER_WALKSPEED = 10
var PLAYER_DIED = false
var JUMP_POWER = 2
var JUMP_COOLDOWN = 50 // in ms
var AIRBORNE_TIME = 100 // how long should we stay in the air for?
var VALUE_FUN = Math.floor(Math.random() * 100)
// functions
function Draw(Path){
    let newArrow = new Image
    newArrow.src = Path
    return newArrow
}
// SPRITES
var TEXTURE_WALL = Draw("./images/Wall.png")
var SPRITE_IDLE = Draw("./sprites/GraveRobber_idle.png")
var SPRITE_RUN = Draw("./sprites/GraveRobber_run.png")
var SPRITE_DEATH = Draw("./sprites/GraveRobber_death.png")
var NPC_FROGGIT = Draw("./sprites/froggit.webp")
var NPC_WHIMSUN = Draw("./sprites/whimsun.png")
var NPC_Human = Draw("./sprites/Frisk_The_Human.webp")
var NPC_Undyne = Draw("./sprites/Undyne.webp")
var NPC_Sans = Draw("./sprites/sans.png")
var NPC_HIM = Draw("./sprites/HIM.webp")
var OBJECT_SPIKE = Draw("./sprites/Spike.png")
function GENERATE_CHUNK(FirstChunk){
    var NewChunk = {
        BasePos: CHUNK_POS_X,
    }
    if(!FirstChunk){
        NewChunk.BasePos+=CANVAS_Width
    }
    NewChunk.Textures = [
        {X: NewChunk.BasePos, Y: 0},
        {X: NewChunk.BasePos+(CANVAS_Width/4), Y: 0},
        {X: NewChunk.BasePos+((CANVAS_Width/4)*2), Y: 0},
        {X: NewChunk.BasePos+((CANVAS_Width/4)*3), Y: 0},
        {X: NewChunk.BasePos+0, Y: FLOOR_Y/2},
        {X: NewChunk.BasePos+(CANVAS_Width/4), Y: FLOOR_Y/2},
        {X: NewChunk.BasePos+((CANVAS_Width/4)*2), Y: FLOOR_Y/2},
        {X: NewChunk.BasePos+((CANVAS_Width/4)*3), Y: FLOOR_Y/2},
    ]
    OBJECT_Chunks.push(NewChunk)
}
function GENERATE_SPIKE(){
    var Position = CANVAS_Width
    OBJECT_SPIKES.push({Position})
}
// updating canvas
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
var CHARACTERS = {
    OneOfAKindSpawnChance: 1,
    OneOfAKind: [
        NPC_Human,
        NPC_Undyne,
    ],
    NormalNPC: [
        NPC_FROGGIT,
        NPC_WHIMSUN,
    ]
}
var CHAR_RUN = {
    sprite: SPRITE_RUN,
    cols: 6,
    rows: 1,
    spriteWidth: SPRITE_RUN.width / 6,
    spriteHeight: SPRITE_RUN.height / 1,
    totalFrames: 6,
    currentFrame: 0,
    srcX: 0,
    srcY: 0,
    framesDrawn: 0,
}
var CHAR_DEATH = {
    sprite: SPRITE_DEATH,
    cols: 6,
    rows: 1,
    spriteWidth: SPRITE_RUN.width / 6,
    spriteHeight: SPRITE_RUN.height / 1,
    totalFrames: 6,
    currentFrame: 0,
    srcX: 0,
    srcY: 0,
    framesDrawn: 0,
    play_ONCE: true,
    played: false,
}
var CHAR_IDLE = {
    sprite: SPRITE_IDLE,
    cols: 4,
    rows: 1,
    spriteWidth: SPRITE_IDLE.width / 4,
    spriteHeight: SPRITE_IDLE.height / 1,
    totalFrames: 4,
    currentFrame: 0,
    srcX: 0,
    srcY: 0,
    framesDrawn: 0,
}
var PlayerWalkPOS = FLOOR_Y+((CANVAS_Height-FLOOR_Y)/2)
var CurrentSprite = CHAR_IDLE
function resizeImage() {
    let scaleFactor = 4;
    let midXPos = innerWidth / 2 - (CurrentSprite.spriteWidth * scaleFactor) / 2;
    let midYPos = innerHeight / 2 - (CurrentSprite.spriteHeight * scaleFactor) / 2;
    ctx.translate(midXPos, midYPos);
    ctx.scale(scaleFactor, scaleFactor);
}
var POS_Y = 30
var POS_X = -125
var PLAYER_JUMPING = false
var PLAYER_FALLINGDOWN = false
var PLAYER_AVAILABLETOJUMP = true
// KEYCODE
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 13) {
        if(GAME_STATUS == "menu"){
            GAME_STATUS = "in game"
            VALUE_FUN = Math.floor(Math.random() * 100)
            CHUNK_POS_X = 0
            NPCs = []
            OBJECT_Chunks = []
            OBJECT_SPIKES = []
            SPAWNEDONEOFAKINDS = []
            SCORE = 0
            PLAYER_WALKSPEED = 10
            PLAYER_DIED = false
            NEXT_NPC_SPAWN = Math.floor(SCORE) + Math.floor((Math.random() * 4)) + 1
            console.log(VALUE_FUN)
            GENERATE_CHUNK(true);
            GENERATE_CHUNK();
            GENERATE_SPIKE();
        } else {
            if(PLAYER_DIED == true){
                GAME_STATUS = "menu"
            }
        }
    } else if(event.keyCode == 38 || event.keyCode == 39) {
        if (GAME_STATUS == "in game" && POS_Y == 30 && PLAYER_AVAILABLETOJUMP == true){
            PLAYER_JUMPING = true
            PLAYER_AVAILABLETOJUMP = false
        }
    }
});
function DrawNPC(Sprite){
    var toPush = {
        Sprite: Sprite,
        X: 0,
        Y: 0,
        SizeX: Sprite.width,
        SizeY: Sprite.height,
    }
    if (Sprite == NPC_FROGGIT){
        toPush.SizeX = 100
        toPush.SizeY = 100
    } else if (Sprite == NPC_Human){
        toPush.SizeX = 100
        toPush.SizeY = 130
    } else if (Sprite == NPC_Sans){
        toPush.SizeX = 100
        toPush.SizeY = 130
    } else if (Sprite == NPC_WHIMSUN){
        toPush.SizeX = 100
        toPush.SizeY = 100
    } else if (Sprite == NPC_Undyne){
        toPush.SizeX = 100
        toPush.SizeY = 180
    }
    toPush.X = CANVAS_Width
    var RandomY = Math.floor(Math.random()*20)
    var IsNegative = Math.floor(Math.random()*100)
    if(IsNegative < 50){
        RandomY = -RandomY
    }
    toPush.Y = FLOOR_Y+(FLOOR_WALKABLEAREA_Y/2)+RandomY
    NPCs.push(toPush)
}
var Hitbox = {
    X: 155,
    Y: 450,
    SizeX: 60,
    SizeY: 130,
}
GENERATE_CHUNK(true);
GENERATE_CHUNK();
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    requestAnimationFrame(update)
    ctx.fillStyle = 'rgb(152, 78, 160)';
    ctx.fillRect(0, FLOOR_Y, CANVAS_Width, CANVAS_Height);
    ctx.fillStyle = 'rgb(174, 102, 180)';
    ctx.fillRect(0, PlayerWalkPOS-(FLOOR_WALKABLEAREA_Y/2), CANVAS_Width, FLOOR_WALKABLEAREA_Y);
    OBJECT_Chunks.forEach(el => {
        el.Textures.forEach(Wall => {
            ctx.drawImage(TEXTURE_WALL,Wall.X,Wall.Y,CANVAS_Width/4, FLOOR_Y/2)
        })
    })
    NPCs.forEach(el => {
        el.X -= PLAYER_WALKSPEED;
        ctx.drawImage(el.Sprite,el.X,el.Y - el.SizeY,el.SizeX,el.SizeY)
    })
    OBJECT_SPIKES.forEach(el => {
        ctx.drawImage(OBJECT_SPIKE,el.Position,PlayerWalkPOS-(FLOOR_WALKABLEAREA_Y/2)-25,100,130)
        ctx.fillStyle = 'rgb(105, 0, 180,0)';
        ctx.fillRect(el.Position+25, PlayerWalkPOS-(FLOOR_WALKABLEAREA_Y/2)-25, 50, 125);
    })
    CurrentSprite.currentFrame = CurrentSprite.currentFrame % CurrentSprite.totalFrames;
    CurrentSprite.srcX = CurrentSprite.currentFrame * CurrentSprite.spriteWidth;
    ctx.save();
    resizeImage();
    ctx.drawImage(CurrentSprite.sprite, CurrentSprite.srcX, CurrentSprite.srcY, CurrentSprite.spriteWidth, CurrentSprite.spriteHeight, POS_X, POS_Y, CurrentSprite.spriteWidth, CurrentSprite.spriteHeight);
    ctx.restore();
    if(CurrentSprite.play_ONCE){
        if(CurrentSprite.played == false){
            CurrentSprite.framesDrawn++;
            if(CurrentSprite.framesDrawn >= 60/CurrentSprite.totalFrames){
                CurrentSprite.currentFrame++;
                CurrentSprite.framesDrawn = 0;
            }
            if(Math.floor(CurrentSprite.currentFrame) === Math.floor(CurrentSprite.totalFrames) - 1){
                CurrentSprite.played = true;
            }
        }
    } else {
        CurrentSprite.framesDrawn++;
        if(CurrentSprite.framesDrawn >= 60/CurrentSprite.totalFrames){
            CurrentSprite.currentFrame++;
            CurrentSprite.framesDrawn = 0;
        }
    }
    //HITBOX
    ctx.fillStyle = 'rgb(0, 102, 180,0)';
    ctx.fillRect(Hitbox.X, Hitbox.Y, Hitbox.SizeX, Hitbox.SizeY);
    if(GAME_STATUS == "menu"){
        CurrentSprite = CHAR_IDLE;
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.font = "bold 75px Helvetica, Arial, sans-serif"
        ctx.fillText("RUINS RUNNER", CANVAS_Width/2, 100);
        ctx.font = "bold 32px Helvetica, Arial, sans-serif"
        ctx.fillText("Press ENTER to play.", (CANVAS_Width/2)+250, 500);
        ctx.font = "bold 24px Helvetica, Arial, sans-serif"
        ctx.fillText("INSTRUCTION: Press SPACE or UP ARROW to jump. バカだ。",10, 680);
    } else {
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.font = "bold 32px Helvetica, Arial, sans-serif"
        ctx.fillText("SCORE: " + Math.floor(SCORE), 50, 50);
        if(PLAYER_DIED == true){
            CurrentSprite = CHAR_DEATH;
            ctx.fillText("YOU DIED" , 50, 100);
            ctx.fillText("PRESS ENTER TO GO BACK TO THE MENU!" , 50, 500);
        } else {
            CurrentSprite = CHAR_RUN;
        }
        if(PLAYER_DIED == false){
            SCORE+= 0.1;
        }
        CHUNK_POS_X += PLAYER_WALKSPEED;
        OBJECT_Chunks.forEach(el => {
            el.Textures.forEach(Wall => {
                Wall.X-=PLAYER_WALKSPEED
            })
            if (el.BasePos == CHUNK_POS_X){
                GENERATE_CHUNK()
                GENERATE_CHUNK(true)
            }
        })
        OBJECT_SPIKES.forEach(el => {
            el.Position -= PLAYER_WALKSPEED;
            if(Hitbox.X + Hitbox.SizeX >= el.Position + 25 && Hitbox.X <= el.Position + 75 && Hitbox.Y + Hitbox.SizeY >= PlayerWalkPOS-(FLOOR_WALKABLEAREA_Y/2)-25){
                if(PLAYER_DIED == false){
                    PLAYER_WALKSPEED = 0
                    PLAYER_DIED = true
                    CHAR_DEATH.played = false
                }
            }
        })
        if (Math.floor(SCORE) == Math.floor(NEXT_SPIKE_SPAWN)){
            GENERATE_SPIKE()
            NEXT_SPIKE_SPAWN = Math.floor(SCORE) + Math.floor((Math.random() * 15))
        }
        if (PLAYER_JUMPING == true){
            if (PLAYER_FALLINGDOWN == true){
                POS_Y += GRAVITY
                Hitbox.Y += GRAVITY*4
                if(Math.floor(POS_Y) == 30){
                    PLAYER_FALLINGDOWN = false
                    PLAYER_JUMPING = false
                    POS_Y = 30
                    setTimeout(function(){
                        PLAYER_AVAILABLETOJUMP = true
                    }, JUMP_COOLDOWN)
                }
            } else {
                if(Math.floor(POS_Y) == -10){
                    setTimeout(function(){
                        PLAYER_FALLINGDOWN = true
                    }, AIRBORNE_TIME)
                } else {
                    POS_Y -= JUMP_POWER
                    Hitbox.Y -= JUMP_POWER*4
                }
            }
        }
        if(Math.floor(SCORE) == NEXT_NPC_SPAWN){
            var RolledChance1 = Math.floor(Math.random() * 66)
            NEXT_NPC_SPAWN = Math.floor(SCORE) + Math.floor((Math.random() * 30))
            if(RolledChance1 == 1){
                DrawNPC(NPC_Sans)
            } else {
                var RolledChance = Math.floor(Math.random() * 10)
                if(RolledChance <= CHARACTERS.OneOfAKindSpawnChance){
                    DrawNPC(CHARACTERS.OneOfAKind[Math.floor(Math.random() * CHARACTERS.OneOfAKind.length)])
                } else {
                    DrawNPC(CHARACTERS.NormalNPC[Math.floor(Math.random() * CHARACTERS.OneOfAKind.length)])
                }
            }
        }
    }
}
update()