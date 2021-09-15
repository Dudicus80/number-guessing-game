//sound files that will randomize during gameplay
let soundBits = ['media/audio/fart.m4a', 'media/audio/boil.m4a','media/audio/hamster.m4a','media/audio/kniggits.m4a','media/audio/pigdog.m4a','media/audio/raz.m4a'];
//sound files that are only used in certain places
let staticSoundBits = ['media/audio/lavache.m4a','media/audio/nomore.m4a','media/audio/taunt.m4a','media/audio/runaway.m4a','media/audio/chant.m4a','media/audio/victory.m4a'];
//variables
let audio1 = new Audio();
let playPromise = audio1.play();
const body = document.getElementById('body');
let soundbite;
let french; 
let grenadeCount = 0;
let lossCount = 0;
const grenade = $('#handGrenade');
//start button to start the game
$('#startButton').click(() => {
    $('#startDiv').addClass('toggle');
    $('.mainCont').removeClass('toggle');
    $('#body').removeClass('wait');
})
//instruction button to display instructions
$('#rulesButton').click(() => {
    $('#instructions').css('opacity') === '1' ? $('#instructions').css('opacity','0') : $('#instructions').css('opacity','1');
})
//function to randomly chose which file is chosen out of the sound files array
function audioFileShuffle(array) {
    soundbite = Math.floor(Math.random() * array.length);
}
//catch statement function for .play() in audio
function audioPromise() {
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            audio1.play();
        }).catch(_error => {
            audio1.play();
        });
    }; 
}
//function to make the french guy pop up over the wall of the castle. Movement changes depending on browser width. Timeout of 5 seconds until frenchdown fires, which makes him move back behind the wall plays sounds when he moves also
const frenchMan = function(callBack) {
    if(!$('#body').hasClass('fwait')){
        french.animate({
            top: '-90%'
        },'slow','linear',callBack);
        audioPlay();
        $('#body').addClass('fwait');
    }
}
//Plays the random sound file when the french guy moves, except on turns 5 and 10, when set sound files play. Has a catch statement for audio play in chrome
function audioPlay() {
    if((lossCount >= 0 && lossCount <=4) || (lossCount >=6 && lossCount <= 9)) {
        audioFileShuffle(soundBits);
        audio1.setAttribute('src',soundBits[soundbite]);
    } else if(lossCount === 5) {
        audio1.setAttribute('src',staticSoundBits[0]);
    }else if(lossCount === 10) {
        audio1.setAttribute('src',staticSoundBits[3]);
    }
    audioPromise();
}
//function to make the french guy go back behind the castle wall. exact opposite of the function to make him go up. 
function frenchDown() {
        french.animate({
            top: '0%'
        },'slow','linear');
        $('#body').removeClass('fwait');
}
//When the user gets three correct answers (function choiceCompare on gamelogic.js) then the holy hand grenade comes down from top of screen so they can break down the wall. 
function handGrenadeDown() {
    /*var percentage = body.clientHeight * .90;*/
    $('#handGrenade').animate({
        top: '+85%'
    },3000,'linear');
    $('#body').addClass('finalWait')
    audio1.setAttribute('src',staticSoundBits[4]);
    audioPromise();
    body.clientWidth > 575 ? $('.letterchoice2').css('font-size','1.2vw').css('padding','0 26% 0 26%').text("It's the Holy Hand Grenade of Antioch! Click it quick!") : 
    body.clientWidth < 575 && body.clientWidth > 320 ? $('.letterchoice2').css('font-size','1.6vh').css('padding','10% 5% 0 5%').text("It's the Holy Hand Grenade of Antioch! Click it quick!") 
    : 
    $('.letterchoice2').css('font-size','1.2vh').css('padding','0% 5% 0 5%').text("It's the Holy Hand Grenade of Antioch! Click it quick!")
    $('#leftspeech').css('opacity','1');
}
//function to set animate requirements for holy hand grenade to be thrown. 
function callAnimationGrenade(t,l,side) {
    if(side === 'left') {
        grenade.animate({
            left: '+=' + l,
            top: '-=' + t,
        },23,'linear')
    }else if(side === 'right') {
        grenade.animate({
            left: '+=' + l,
            top: '+=' + t
        },23,'linear')
    }
}
//function using for loops to have a function repeat a set amount of times so that when the holy hand grenade is thrown, it will travel in an arc. 
function animateGrenade() {
    let l = 'left';
    let r = 'right';
    let i;
    for(i=0;i<4;i++){
        callAnimationGrenade('3%','1%',l);
    }
    for(i=0;i<7;i++){
        callAnimationGrenade('1.875%','1%',l);
    }
    for(i=0;i<10;i++) {
        callAnimationGrenade('1%','1%',l);
    }
    for(i=0;i<10;i++) {
        callAnimationGrenade('.615%','1%',l);
    }
    for(i=0;i<5;i++) {
        callAnimationGrenade('.321%','1%',l);
    }
    for(i=0;i<5;i++) {
        callAnimationGrenade('.321%','1%',r);
    }
    for(i=0;i<10;i++) {
        callAnimationGrenade('.615%','1%',r);
    }
    for(i=0;i<10;i++) {
        callAnimationGrenade('1%','1%',r);
    }
    for(i=0;i<7;i++){
        callAnimationGrenade('1.875%','1%',r);
    }
    for(i=0;i<4;i++){
        callAnimationGrenade('3%','1%',r);
    }
    setTimeout(function(){
     $('#handGrenade').addClass('toggle');   
    },2600);
    setTimeout(explosion, 2600);
    setTimeout(function() {
        audio1.setAttribute('src',staticSoundBits[1]);
    audioPromise();
    },3000);
}
//click on the hand grenade to throw it. 
$('#handGrenade').click(() => {
    animateGrenade();
    $('#leftspeech').css('opacity','0');
})
//collapse the castle walls into rubble and display the explosion
function explosion() {
    $('.wrongChoice').append('<p>YOU WIN!</p>').css({
        'background': "url(media/pictures/grail.png)",
        'background-position': 'center',
        'background-repeat': 'no-repeat', 
        'background-size': 'auto 100%'
    });
    $('.french').addClass('toggle');
    $('#castleBottom').attr('src','media/pictures/collapsedwall.png');
    $('#castleTop').css('visibility','hidden')
    $('#explosion').removeClass('toggle').animate({
        width: '+=90%',
        left: '-=10%'
    },200,'linear').animate({
        opacity: '0'
    },1500,'linear');
}
//Next three functions animate the knights in a running away motion if they lose. 
function knightsRunAway1(skew,callback) {//move left and skew
    $('.arthur').css('transform',skew).animate({
       left: '-=10px'
    },50,'linear',callback);
}
function knightsRunAwayMaster() {//function to put the movement together and play a sound
    $('#body').addClass('wait');
    $('#leftspeech').text(" ").css('opacity','0');
    setTimeout(function() {
        french=$('#french1');
        frenchMan()
    },3000);
    audio1.setAttribute('src',staticSoundBits[3]);
    audioPromise();
    for(let i = 0; i < 20; i++) {
        knightsRunAway1('skew(+16deg)', knightsRunAway1);
        knightsRunAway1('skew(-16deg)');
    }
    setTimeout(function(){    
    audio1.setAttribute('src',staticSoundBits[2])
    audioPromise();},3000)
    $('.wrongChoice').append('<p>You have lost to the French! Run away!</p>');
}
//function to show gif and close it back out after it is done playing
function showGif(gif,time1,time2) {
    setTimeout(function() {
    $('.mainCont').addClass('toggle');
    $('.gifDiv').removeClass('toggle');
    $('#loseGif').attr('src',gif);
    },time1)
    setTimeout(function() {
        $('.mainCont').removeClass('toggle');
        $('.gifDiv').addClass('toggle');
        $('#loseGif').attr('src','');
    }, time2);
}
//function to display the count of how many the computer has gotten right. displays above his head
function animalCatapult(count1, count2, count3, count4, count5,gif,time1,time2) {
    if(count1.hasClass('toggle')) {
        count1.removeClass('toggle')
    } else if(count2.hasClass('toggle')) {
        count2.removeClass('toggle')
    } else if(count3.hasClass('toggle')) {
        count3.removeClass('toggle')
    } else if(count4.hasClass('toggle')) {
        count4.removeClass('toggle')
    } else if(count5.hasClass('toggle')) {
        count5.removeClass('toggle')
        showGif(gif,time1,time2);
    }
};