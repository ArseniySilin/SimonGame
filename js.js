//push test
$(document).ready(function(){
  var git_test = 100500;
  var timerId;
  var sequence = [];
  var timerIdArr = [];
  var count = 0;
  var WINNER_COUNT = 20;
  var btnColorsO = [null,//all btn original colors
                     'ForestGreen',
                     'firebrick',
                     'DodgerBlue',
                     'Gold'];
  var btnColorsH = [null, //all btn highlithed colors
                     'SpringGreen',
                     'red',
                     'blue',
                     'yellow'];
  
  function playSequence() {
    var toggle = true; //toggling button colors
    
    function rand(min, max) {
     return Math.floor(Math.random() * (max + 1 - min)) + min;
    }
        
    var r; //random
    var i = 0; //index for butnColors arrays
    var c = 0; //counter for correct changing color
    var audio;    
//  
    //for(var j = 1; j <= 4; j++){
      //$("#q" + j).removeClass("q");
    //}
    
    timerId = setInterval(function() { 
      r = rand(1, 4);
      sequence.push(r); //saving random value in a sequence
      //play audio    
      //audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound' + r + '.mp3');
      //audio.play();
      
      if(toggle)
        $("#q" + sequence[i].toString()).css("background-color", btnColorsH[sequence[i]]);              
      else 
        $("#q" + sequence[i].toString()).css("background-color", btnColorsO[sequence[i]]);      
      toggle = !toggle;                    
      
      if(++c % 2 === 0)
        i++;
    }, 1000);
    
    setTimeout(function() {
      clearInterval(timerId);
     
      //for(var j = 1; j <= 4; j++){
      //$("#q" + j).addClass("q");
    //}
    }, 2000 * count + 200);
    
    //if() //only after succesfull sequence check
    count++;
    
  }
  
  function counter() {    
    if(++count < 10)
      count = '0' + count;    
    $("#counter").text(count);    
  }
  
  function checkBox() {
    if(document.getElementById("switch").checked){
      //on
      $("#counter").css('color','red');
    } else {
      //off
      $("#counter").css('color','#700700');
      $("#counter").text('--');
      $("#diod").css('background-color', '#420f0f');
      if(timerId){
        //clearInterval(timerId);
        clearTimeout(timerId);
        timerId = null;
      }
      count = 0;      
    }
  }
  
  function checkPlayer(){
    /*if(player succeed){
      if(count === WINNER_COUNT)
        return 'win';
      return 'next_seq';
    } else {
      return 0;  
    } */   
    /*$(document).on('click', '.clickCell', function(){
      var $this = $(this);
      var elemId = $this.data('id');    
      var e = elemId[1];
      alert(e);
    });*/
    
    
    //if(sequence[count - 1] === )
  }
  
  function start() {
    if(document.getElementById("switch").checked){
      //make next round after players win
      
      counter();
      playSequence();
      alert(checkPlayer());
      
      
      /*
      if(count > 0){
        //while(checkPlayer() !== 'win'){
          if(checkPlayer() === 0){
            //show mistake
            playSequence();
          }
          if(checkPlayer() === 'next_seq'){
            counter();
          }                              
        //}
      }*/
      
    } 
  }
  function strict() {    
    if( $("#diod").css('background-color') === 'rgb(66, 15, 15)' ){
      //should turn it on
      $("#diod").css('background-color', 'red');
    } else {
      //off
      $("#diod").css('background-color', '#420f0f');
    }     
  }
  //////////////////////////////////
  $("#switch").on('click', checkBox);
  $("#start").on('click', start);
  $("#strict").on('click', strict);
  $(document).on('click', '.q', function(){
      var $this = $(this);
      var elemId = $this.data('id');    
      var e = elemId[1];
      alert(e);
    });
});