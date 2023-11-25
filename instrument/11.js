"use strict";

// Turn theremin on
function thereminOn(oscillator) {
    oscillator.play();
}

// Control the theremin
function thereminControl(e, oscillator, theremin) {
    
    let x = e.offsetX;
    let y = e.offsetY;
    console.log(x, y);

    let minFrequency = 220.0;
    let maxFrequency = 880.0;

    let freqRange = maxFrequency - minFrequency;
    let thereminFreq = minFrequency + (x / theremin.clientWidth) * freqRange;
    let thereminVolume = 1.0 - (y / theremin.clientHeight);
    if (document.getElementById("perfectFifth").checked){
        thereminVolume = thereminVolume/2;
    }
    let roundedFreq = midiToFrequency(Math.round(frequencyToMidi(thereminFreq)));

    if (document.getElementById("auto-tune").checked){
        thereminFreq = roundedFreq;
    }

    //Get displayed frequency to 2 decimals
    let dispFreq = Math.round(thereminFreq*100)/100;
    let noteName = noteFromFrequency(thereminFreq);

    console.log("Frequency: ", thereminFreq);
    oscillator.frequency = thereminFreq;
    console.log("Volume: ", thereminVolume);
    oscillator.volume = thereminVolume;
    document.getElementById("dispFreq").innerHTML = `Frequency: ${dispFreq}`;
    document.getElementById("noteName").innerHTML = `Note name: ${noteName}`;
}

// Control the perfect fifth
function thereminControl2(e, oscillator, theremin) {
    
    let x = e.offsetX;
    let y = e.offsetY;
    console.log(x, y);

    let minFrequency = 220.0;
    let maxFrequency = 880.0;

    let freqRange = maxFrequency - minFrequency;
    let thereminFreq = minFrequency + (x / theremin.clientWidth) * freqRange;
    thereminFreq = interval(thereminFreq, 7);
    let thereminVolume = (1.0 - (y / theremin.clientHeight))/2;
    let roundedFreq = midiToFrequency(Math.round(frequencyToMidi(thereminFreq)));

    if (document.getElementById("auto-tune").checked){
        thereminFreq = roundedFreq;
    }

    //Get displayed frequency to 2 decimals
    console.log("Frequency fifth: ", thereminFreq);
    oscillator.frequency = thereminFreq;
    console.log("Volume fifth: ", thereminVolume);
    oscillator.volume = thereminVolume;
}

// Turn theremin off
function thereminOff(oscillator) {
    oscillator.stop();
}



function runAfterLoadingPage() {


    // Instantiate a sine wave with pizzicato.js
    let waveform = "sine";
    let urlParameters = (new URL(document.location)).searchParams;
    if (urlParameters.has('waveform')){
        waveform = urlParameters.get('waveform');
    }

    document.getElementById(waveform).checked = true;
    const oscillator = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: waveform,
            frequency: 220
        }
    });

    //Oscillator for perfect fifth
    const oscillator2 = new Pizzicato.Sound({
        source: 'wave',
        options: {
            type: waveform,
            frequency: 220
        }
    });


    // Get the theremin div from the html
    const theremin = document.getElementById("thereminZone");

    // Theremin plays when the mouse enters the theremin div
    theremin.addEventListener("mouseenter", function () {
        thereminOn(oscillator);
        if (document.getElementById("perfectFifth").checked){
            thereminOn(oscillator2);
        }
        console.log("FIRST IS ON");
    });

    // Theremin is controlled while the mouse is inside the theremin div
    theremin.addEventListener("mousemove", function (e) {
        thereminControl(e, oscillator, theremin);
    });
    theremin.addEventListener("mousemove", function (e) {
        thereminControl2(e, oscillator2, theremin);
    });


    // Theremin stops when the mouse leaves the theremin div
    theremin.addEventListener("mouseleave", function () {
        thereminOff(oscillator);
    });
    theremin.addEventListener("mouseleave", function () {
        thereminOff(oscillator2);
    });
}

//Auxiliary functions
let notenames = {
    0: "C",
    1: "C#",
    2: "D",
    3: "Eb",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "Ab",
    9: "A",
    10: "Bb",
    11: "B"
}

function interval(frequency, semitones) {
    // Assuming equal temperament
    return frequency * Math.pow(2, semitones / 12);
}

function midiToFrequency(midinumber, concertA = 440) {
    // converts a MIDI note number into its equivalent frequency.
    const A4 = 69
    if (midinumber === A4) {
        return concertA;
    }
    let semitones = midinumber - A4;
    return interval(440, semitones);
}

function frequencyToMidi(frequency){
    // converts a frequency into its equivalent MIDI note number.
    let midinumber = (( 12 * Math.log(frequency / 220.0) / Math.log(2.0)) + 57.001 );
    return midinumber
}

function noteFromFrequency(frequency, withOctave=false) {
    // converts a frequency into its closest human-readable note name.
    const midinumber = frequencyToMidi(frequency);
    const pitchclass = midinumber % 12;
    let octave = (midinumber - pitchclass) / 12;
    let notename = notenames[Math.round(pitchclass)];
    if (withOctave) {
        octave--;
        notename += octave;
    }
    return notename;
}

window.onload = runAfterLoadingPage;