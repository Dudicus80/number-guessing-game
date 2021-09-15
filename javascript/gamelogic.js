//letter arrays
const letterArray1 = ["a","b","c","d","e","f","g","h","i","j","k","l","m"];
const letterArray2 = ["n","o","p","q","r","s","t","u","v","w","x","y","z"]
//variables
let letterArray;
let randomLetter;
let randomNumber;
let pattern;
let userChoiceArray = [];

//reset button
$('#reset').click(() => {
    document.location.reload();
})
//computer chooses a random letter from the letterArray
function randomLetterComputer() {
    //choose array based on losscount
    if(lossCount >= 0 && lossCount <= 4) {
        letterArray = letterArray1;
    }else if(lossCount >= 5 && lossCount <=9){
        letterArray = letterArray2
    }
    //make a random number between 0 and 13
    randomNumber = Math.floor(Math.random() * letterArray.length);
    //apply random number to letterArray
    randomLetter = letterArray[randomNumber];
    console.log(randomLetter)
}
randomLetterComputer();
//call functions on keyup in window, Place user's choice into variable
//name variable
let userChoice;
//use keyup to fire functions.
document.addEventListener('keyup', function(e) {
    if(!$('#body').hasClass('wait') && !$('#body').hasClass('finalWait') && !$('#body').hasClass('fWait') ) {
        let letter = e.which || e.keyCode;//grabs user input from keyboard
        userChoice = String.fromCharCode(letter).toLowerCase();//changes that input to a letter
        $('.letterchoice2').text(userChoice.toUpperCase());
        $('#leftspeech').css('opacity','1');
        $('#body').addClass('wait');
        setTimeout(function(){
            $('#leftspeech').css('opacity','0');
            $('#body').removeClass('wait');
        },4000)
        function noSameLetterTwice(element) {//function to compare user array with user letter to ensure same letter is not used twice
            return element === userChoice
        }
        if(userChoiceArray.some(noSameLetterTwice)) {//if statement utilizing noSameLetterTwice function
            $('.wrongChoice').append('<p>You have already used that letter. Try again.</p>');
            setTimeout(function(){$('.wrongChoice > p').remove();}, 3000);  
        }else {//push user choice into array for comparison
            if(!$('#body').hasClass('wait') && !$('#body').hasClass('finalWait') && !$('#body').hasClass('fWait')){
            userChoiceArray.push(userChoice);
            console.log(userChoice,userChoiceArray)
            }
            if(grenadeCount < 3) {
                if(lossCount <= 9) {
                    matchOrNoMatch();
                } 
            } 
        }    
    }
})

//function to ensure that userchoice is a letter
function matchOrNoMatch() {
    //check to see if userchoice is a letter using regex patterns
    if(lossCount >= 0 && lossCount <= 4) {
        pattern = /[a-m]/;
        french = $('#french1');
    }else if(lossCount >= 5 && lossCount <=9){
        pattern = /[n-z]/;
        french = $('#french2');
    }
    if(pattern.test(userChoice)) {
        choiceCompare();
    }else {
        $('.wrongChoice').append('<p>That is not a valid letter. Please choose a letter</p>');
        setTimeout(function(){$('.wrongChoice > p').remove();}, 3000);
    }
}

//function to compare computer choice against user choice
function choiceCompare() {
    if(userChoice === randomLetter) { //if user gets right choice
        userChoiceArray=[];
        grenadeCount++
        audio1.setAttribute('src',staticSoundBits[5]);
        audioPromise();
        if(grenadeCount === 3) {
            handGrenadeDown();
        }
        randomLetterComputer();
        
        //show count of how many the player has gotten correct
        if($('#holyHandGrenade1').hasClass('toggle')) {
            $('#holyHandGrenade1').removeClass('toggle');
        }else if($('#holyHandGrenade2').hasClass('toggle')) {
            $('#holyHandGrenade2').removeClass('toggle');
        }else if($('#holyHandGrenade3').hasClass('toggle')) {
            $('#holyHandGrenade3').removeClass('toggle');
        }
    } else { //if user gets wrong choice frenchman pops up, taunts him, and then adds to his own counter
        lossCount++
        console.log(lossCount)
        if(lossCount === 5) {
            frenchMan(setTimeout(frenchDown,5000));
            randomLetterComputer();
            userChoiceArray=[];
            animalCatapult($('#cow1'),$('#cow2'),$('#cow3'),$('#cow4'),$('#cow5'),'media/gifs/cow.gif',3000,8860);
        }
        if(lossCount < 5) {
            frenchMan(setTimeout(frenchDown,5000));
            animalCatapult($('#cow1'),$('#cow2'),$('#cow3'),$('#cow4'),$('#cow5'),'media/gifs/cow.gif',3000,8860);
        }else if(lossCount > 5){
            if(lossCount === 10) {//Frenchman Wins
                animalCatapult($('#rabbit1'),$('#rabbit2'),$('#rabbit3'),$('#rabbit4'),$('#rabbit5'),'media/gifs/bunny-catapult.gif',0,2840);
                frenchMan(setTimeout(frenchDown,3000));
                setTimeout(knightsRunAwayMaster,3000);
            }else {
                $('#cow1,#cow2,#cow3,#cow4,#cow5').addClass('toggle');
                animalCatapult($('#rabbit1'),$('#rabbit2'),$('#rabbit3'),$('#rabbit4'),$('#rabbit5'),'media/gifs/bunny-catapult.gif',0,2840);
                frenchMan(setTimeout(frenchDown,5500));
            }
        }
    }
}