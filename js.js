
$(document).ready(function(){
  
  var timerId;
  var isStrict = false;
  var sequence = [];
  var sequencePlayer = [];
  var timerIdArr = [];
  var count = 0;
  var countForCheck = 0;
  var WINNER_COUNT = 20; //20
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
  var frequencies = [null, 349.23, 392, 440, 523.2];
  
  audioCtx = new(window.AudioContext || window.webkitAudioContext)();
  
  function beep(freq) {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = 0.5;
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    oscillator.start();

    setTimeout( function() {
        oscillator.stop();
    }, 300);
  }
  
  function changeBtnColor(btnNumId, type){
    if(type === 'highlight')
      $("#q" + btnNumId).css("background-color", btnColorsH[ btnNumId ]); 
    else
      $("#q" + btnNumId).css("background-color", btnColorsO[ btnNumId ]);
  }
  function resetBtnColors(){
    for(var i = 1; i <= 4; i++){
        $("#q" + i).css("background-color", btnColorsO[i]);
     }
  }
  
  function clickButton(){    
    var b = parseInt( $(this).data('id')[1] );
    
    var cn = 0;
    var TIMEOUT = 300;
    
    $("#q" + b ).css("background-color", btnColorsH[b]);
    
    beep(frequencies[b]);
    
    timerId = setTimeout(function() {
      $("#q" + b ).css("background-color", btnColorsO[b]);
    }, TIMEOUT);
    
    setTimeout(function() {
      clearTimeout(timerId);
      checkPlayer(b);
    }, TIMEOUT + 200);
    
  }
  
  function checkPlayer(e){
    var sw = false;
    var CD_TIMEOUT = 350; //count display timeout
    var CONGRATS_TIME = 3100; // how long to greet a winner
    if(sequence[countForCheck] === +e){
      if(countForCheck === sequence.length - 1){
        //alert("Yeah, Right!");
        $("#counter").text('OK');
        setTimeout(function () {
          sequencePlayer = [];
          countForCheck = 0;
          
          if(count < WINNER_COUNT){
            counter();
            playSequence('new');
          } else {
            
            //show winner congrats
            var btnCounter = 1;
            var tmpSwitch = true;
            var winToggle = true;
            
            $("#counter").text('WIN');
            var timerId2 = setInterval(function () {
              
              if(tmpSwitch)
                $("#q" + btnCounter).css("background-color", btnColorsH[btnCounter]);
              else {
                $("#q" + btnCounter).css("background-color", btnColorsO[btnCounter]);          
                btnCounter++;
              }
              
              if(btnCounter === 5) {
                btnCounter = 1;
                if(winToggle === true)
                  $("#counter").text('');
                else
                  $("#counter").text('WIN');
                winToggle = !winToggle;
              }
              
              tmpSwitch = !tmpSwitch;
            }, 50);
           
            setTimeout(function () {
              count = 0;
              sequencePlayer = [];
              countForCheck = 0;
              sequence = [];
              resetBtnColors();
              clearInterval(timerId2);
              counter();
              playSequence('new');              
            }, CONGRATS_TIME);
          }
        }, CD_TIMEOUT * 3);
      } else {
        sequencePlayer.push(e);
        countForCheck++;
      }
    } else {
      //alert("Wrong, try again!");
      $(document).off('click', '.q', clickButton);
      $("#counter").text('!!!!');
      timerId = setInterval(function () {
        if(sw) {
          $("#counter").css('color','red');
          $("#counter").text('!!!!');
        }
        else {
          $("#counter").text('');
          $("#counter").css('color','#700700');
          $("#counter").text('--');
        }
        sw = !sw;
      }, CD_TIMEOUT);
      
      setTimeout(function() {
        $("#counter").css('color','red');

        if(isStrict){
          count = 0;  
          sequencePlayer = [];
          countForCheck = 0;
          sequence = [];
          clearInterval(timerId);
          counter();
          playSequence('new');   
        } else {
          clearInterval(timerId);
          playSequence('repeat');
          count--;
          counter();
        }
      }, CD_TIMEOUT * 3 + 100);
      
      sequencePlayer = [];
      countForCheck = 0;
    }
      
  }
  
  function playSequence(mode) {
    resetBtnColors();
    //no need to check players click while still playing the sequence
    $(document).off('click', '.q', clickButton);
    //for button color change and back logic
    var toggle = true; 
    function rand(min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    }
    var r; //random
    var i = 0; //index for butnColors arrays
    var c = 0; //counter for correct changing color
    var audio;
    var tmpCount = 0;
    var SEQ_TIMEOUT = 400;//700
    
    if(mode === 'new')
      sequence = [];
    if(mode === 'repeat')
      r = 0;
    
    //console.log("mode: " + mode);
    timerId = setInterval(function() { 
      if(toggle){
        if(mode === 'new'){          
          r = rand(1, 4);
          sequence.push(r);          
          //console.log("sequence[]: " + sequence);
          changeBtnColor(r, 'highlight');
          beep(frequencies[r]);                    
        }
        if(mode === 'repeat'){
          beep(frequencies[ sequence[r] ]);
          changeBtnColor(sequence[r], 'highlight');
        }
      }
      else {        
        if(mode === 'repeat') {
          changeBtnColor(sequence[r], 'change it back');
          r++;
        }
        if(mode === 'new')
          changeBtnColor(r, 'change it back');
      }
      toggle = !toggle;
    }, SEQ_TIMEOUT);
    
    setTimeout(function() {
      clearInterval(timerId);
      $(document).on('click', '.q', clickButton);
    }, SEQ_TIMEOUT * 2 * count + 200);
  }
  
  function counter() {    
    count++;
    if(count < 10)    
      $("#counter").text('0' + count); 
    else
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
      resetBtnColors();
      if(timerId){
        clearTimeout(timerId);
        timerId = null;
      }
      count = 0;      
    }
  }
  
  
  function strict() { 
    if(document.getElementById("switch").checked){
      if($("#diod").css('background-color') === 'rgb(66, 15, 15)' ){
        //should turn it on
        $("#diod").css('background-color', 'red');
        isStrict = true;
      } else {
        //resetBtnColors();
        $("#diod").css('background-color', '#420f0f');            
        isStrict = false;      
      } 
    } 
  }
  function start() {
    if(document.getElementById("switch").checked && count === 0){
      counter();
      playSequence('new');
    } 
  }
  //////////////////////////////////
  $("#switch").on('click', checkBox);
  $("#start").on('click', start);
  $("#strict").on('click', strict);
  console.log('Started...');
});