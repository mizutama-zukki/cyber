enchant();
var codeBlocks = [];

$(document).ready(function(){
  /*実行したい処理*/
  $( '#sort-drop-area' ).sortable( {
     revert: true,
     change: function(event, ui) {
       console.log("hello");
      }
  });

  $( '#dragArea' ).find('li').draggable( {
     connectToSortable: '#sort-drop-area',
     helper: 'clone',
     revert: 'invalid'
  });

  //配列の中身->ブロックのデータ（ブロックの名前、ブロックの処理が終わったかどうか）
  $("button").click(function(){
    //ブロックががあった時
    if($('li', '#drop-check').length > 0){
      //ehcnant側でゲームシーンをよぶ
      game.change_scene(game.rootScene);
      //if文ブロック、もしくはfor文のブロックのとき
      $('li', '#drop-check').each(function() {
        checkBlockNeedEndBlcok(this);
        codeBlocks.push(this.value); 
      })              
      blockAction();
    }else{
      //ブロックがなかったとき 
      alert("ブロック入れてね");
    }
  });

  $( '#dragArea' ).disableSelection();
});

$("#sort-drop-area").change(console.log("hoge"));

function blockAction(){
  if(chara.x > 320){
    ///game.change_scene(endScene); 
    clear();
  }
  if(codeBlocks.length == 0){
    programEnd();
  }else{
    receveBlockInfoWrapper(codeBlocks[0]);
  }
}

//enchantからブロック処理の合図を受け取る
function finishBlockProcess(){
  if(codeBlocks.shift() != undefined){
    blockAction();
  }
}

function checkBlockNeedEndBlcok(block){
  console.log("block value =>" + block.value);
  if(block.value == 4 || block.value == 5){
    console.log("push end block");
    var endBlock = $('<li>').text("end").attr("class","panel panel-info");
    endBlock.appendTo("#sort-drop-area");
  }
}
