enchant();
enchant.Sound.enabledInMobileSafari = true;
//todo グローバル変数はやばい
var player_x;
var chara;
var goal;
var stage;
var startImage;
var forflag;
var ifflag;
var gameOverImage;
var gameClearImage;
var moveRightCounter = 0;
var jumpCounter = 0;
var jumpFlag = true;
var moveRightflag = true;
var clearflag = false;
var startScene;
var endScene;
var goalImg;

//後でこのディレクションを進行方向にかける
//-1にすると自動的に後ろに進むようになります
var direction = 1;
var windowWidth = window.innerWidth;
var game = new Game(320,224);

window.onload = function() {
    var Rectangle = enchant.Class.create({
        initialize: function(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        },
        right: {
            get: function() {
                return this.x + this.width;
            }
        },
        bottom: {
            get: function() {
                return this.y + this.height;
            }
        }
    });

    game.fps = 24;
    game.preload(
        '/assets/enchantImg/chara1.gif',
        '/assets/enchantImg/map2.gif',
        '/assets/enchantImg/coin.png',
        '/assets/enchantImg/start.png',
        '/assets/enchantImg/gameover.png',
        '/assets/enchantImg/clear.png',
        '/assets/enchantImg/flag.png'
        );

    game.change_scene = function(scene){
      game.replaceScene(scene); 
    }

    //startScene
    startScene = new Scene();
    startScene.backgroundColor = "#FF9999";

    //endScene
    endScene = new Scene();
    endScene.backgroundColor = "#99FF99";

    //game over Scene
    gameOverScene = new Scene();
    gameOverScene.backgroundColor = "#fff";

    game.onload = function() {
        //create startScene map
        var blocks = gon.map; 
        var startSceneMap = new Map(16, 16);
        startSceneMap.image = game.assets['/assets/enchantImg/map2.gif'];
        startSceneMap.loadData(blocks);
        startScene.addChild(startSceneMap);

        //create map
        var blocks = gon.map; 
        var map = new Map(16, 16);
        map.image = game.assets['/assets/enchantImg/map2.gif'];
        map.loadData(blocks);

        //game over image
        gameOverImage = new Sprite(189,97);
        gameOverImage.image = game.assets['/assets/enchantImg/gameover.png'];
        gameOverImage.addEventListener('touchstart', function() {
          window.location.reload();
        });

        //game clear image
        gameClearImage= new Sprite(235,43);
        gameClearImage.y = 100;
        gameClearImage.image = game.assets['/assets/enchantImg/clear.png'];
        gameClearImage.addEventListener('touchstart', function() {
          window.location.href = "/map";
        });
        endScene.addChild(gameClearImage);

        //goal image
        goalImg = new Sprite(100,100);
        goalImg.x = 320;
        goalImg.y = 75;
        goalImg.image = game.assets['/assets/enchantImg/flag.png'];


        //main character
        chara = new Sprite(32, 32);
        chara.x = 8;
        chara.y = 140;
        chara.vx = 0;
        chara.vy = 0;
        chara.ax = 0;
        chara.ay = 0;
        chara.pose = 0;
        chara.jumping = true;
        chara.jumpBoost = 0;
        chara.image = game.assets['/assets/enchantImg/chara1.gif'];
        chara.addEventListener('enterframe', function(e) {
        player_x = chara.x;


            if (this.ax != 0) {
                if (game.frame % 3 == 0) {
                    this.pose++;
                    this.pose %= 2;
                }
                this.frame = this.pose + 1;
            } else {
                this.frame = 0;
            }

            this.vy += this.ay + 2 ; //重力
            this.vy = Math.min(Math.max(this.vy, -10), 10);

            var dest = new Rectangle(
                this.x + this.vx + 5, this.y + this.vy + 2,
                this.width-10, this.height-2
            );

            if (dest.x < -stage.x) {
                dest.x = -stage.x;
                this.vx = 0;
            }

            while (true) {
                var boundary, crossing;
                var dx = dest.x - this.x - 5;
                var dy = dest.y - this.y - 2;
                if (dx > 0 && Math.floor(dest.right / 16) != Math.floor((dest.right - dx) / 16)) {
                    boundary = Math.floor(dest.right / 16) * 16;
                    crossing = (dest.right - boundary) / dx * dy + dest.y;
                    if ((map.hitTest(boundary, crossing) && !map.hitTest(boundary-16, crossing)) ||
                        (map.hitTest(boundary, crossing + dest.height) && !map.hitTest(boundary-16, crossing + dest.height))) {
                        this.vx = 0;
                        dest.x = boundary - dest.width - 0.01;
                        continue;
                    }
                } else if (dx < 0 && Math.floor(dest.x / 16) != Math.floor((dest.x - dx) / 16)) {
                    boundary = Math.floor(dest.x / 16) * 16 + 16;
                    crossing = (boundary - dest.x) / dx * dy + dest.y;
                    if ((map.hitTest(boundary-16, crossing) && !map.hitTest(boundary, crossing)) ||
                        (map.hitTest(boundary-16, crossing + dest.height) && !map.hitTest(boundary, crossing + dest.height))) {
                        this.vx = 0;
                        dest.x = boundary + 0.01;
                        continue;
                    }
                }
                if (dy > 0 && Math.floor(dest.bottom / 16) != Math.floor((dest.bottom - dy) / 16)) {
                    boundary = Math.floor(dest.bottom / 16) * 16;
                    crossing = (dest.bottom - boundary) / dy * dx + dest.x;
                    if ((map.hitTest(crossing, boundary) && !map.hitTest(crossing, boundary-16)) ||
                        (map.hitTest(crossing + dest.width, boundary) && !map.hitTest(crossing + dest.width, boundary-16))) {
                        this.jumping = false;
                        this.vy = 0;
                        dest.y = boundary - dest.height - 0.01;
                        continue;
                    }
                } else if (dy < 0 && Math.floor(dest.y / 16) != Math.floor((dest.y - dy) / 16)) {
                    boundary = Math.floor(dest.y / 16) * 16 + 16;
                    crossing = (boundary - dest.y) / dy * dx + dest.x;
                    if ((map.hitTest(crossing, boundary-16) && !map.hitTest(crossing, boundary)) ||
                        (map.hitTest(crossing + dest.width, boundary-16) && !map.hitTest(crossing + dest.width, boundary))) {
                        this.vy = 0;
                        dest.y = boundary + 0.01;
                        continue;
                    }
                }

                break;
            }
            this.x = dest.x-5;
            this.y = dest.y-2;

            if (this.y > 320) {
                var score = Math.round(chara.x);
                this.frame = 3;
                this.vy = -20;
                this.addEventListener('enterframe', function() {
                    this.vy += 2;
                    this.y += Math.min(Math.max(this.vy, -10), 10);
                    if (this.y > 320) {
                        game.end(score, score + 'mで死にました');
                    }
                });
                this.removeEventListener('enterframe', arguments.callee);
            }
        });

        stage = new Group();
        stage.addChild(map);
        stage.addChild(chara);
        stage.addChild(goalImg);
        stage.addEventListener('enterframe', function(e) {
            if (this.x > 64 - chara.x) { 
                this.x = 64 - chara.x;
            }
        });
        game.rootScene.addChild(stage);
        game.rootScene.backgroundColor = 'rgb(182, 255, 255)';

    };
    game.start();
    game.change_scene(startScene);
};

function moveForward(){
  chara.addEventListener('enterframe',function(){
    if(!clearflag){
      chara.ax = 0;

      if(moveRightCounter < 10 && moveRightflag){
        moveRightCounter++;
        this.x += 7 * direction;       
      }else if(moveRightCounter <= 10){
        moveRightflag = false; 
        moveRightCounter = 0;
        this.removeEventListener('enterframe',arguments.callee);
        finishBlockProcess();
      }
    }
  });
}

function changeDirection(){
    direction = direction * -1;
    chara.frame = 1;
    chara.scaleX *= -1;
    finishBlockProcess();
}

function jump(){
   chara.addEventListener('enterframe',function(){
     if(!clearflag){
       chara.ax = 0;
       if(jumpCounter < 10 && jumpFlag){
         jumpCounter++;
         chara.x += 3 * direction;
         chara.y -= 10;
       }else if(jumpCounter <= 10){
         jumpFlag = false; 
         jumpCounter = 0;
         this.removeEventListener('enterframe',arguments.callee);
         finishBlockProcess();
       }
     }
   });
}

function ifBlock(){
  console.log("if block");
  ifflag = true;
  finishBlockProcess();
}

function forBlock(){
  console.log("for block");
  forflag = true;
  finishBlockProcess();
}

function endForBlock(){
  console.log("end of for block");
}

function endIfBlock(){
  console.log("end of if block");
}

function receveBlockInfoWrapper(blockId){ 
    if(blockId != undefined){
        actionFlagTrue();
        switch (blockId){
            case 1: 
                moveForward();
                break;
            case 2:
                changeDirection();
                break;
            case 3:
                jump();
                break;
            case 4:
                ifBlock();
                break;
            case 5:
                forBlock();
                break;
            default:
                console.log("block no namae matigaeteruyo!!!")
                break;
        }
    }
}

function actionFlagTrue(){
    moveRightflag = true;
}

function clear(){
  gameClearImage.x = player_x - 20;
  stage.addChild(gameClearImage);
  if(!clearflag){
    $.ajax({
        url: "clear",
        type: "POST",
        data: {
           stageNum:getStageParams()
        },
        success:function(){
        },
        error:function(xml,text,error){
          alert("clear!!! demo http sippai sityattayo!!!") 
        },
            dataType: "html"
        });
    clearflag = true;
  }
}

function debugClear(){
  game.replaceScene(game.rootScene);
  clear();
}

function programEnd(){
  if(!clearflag){
    gameOverImage.x = player_x;
    gameOverImage.y = 50;
    stage.addChild(gameOverImage);
    //todo 
    //game.change_scene(gameOverScene);
  }
}

//todo railsdでクエリをパースする
function getStageParams(){
  var url   = location.href;
  var params = url.split("?");
  if(params.length > 0){
    var num = params[1].split("=");
    return num[1];
  }else{
    return 0; 
  }
}
