
(function(global){
   'use strict';

   var Midi = {};

   /**
    * Cache para solo calcular las frecuencias una sola vez.
    * @static
    * @function cacheNote2Freq
    */
   Midi.cacheNote2Freq = {};

   /**
    * Devuelve la frecuencia de una nota MIDI
    * @function note2freq
    */
   Midi.note2freq = function(nota){
      var freq;
      if(typeof(Midi.cacheNote2Freq[nota]) === 'undefined'){
         var num = Midi.note2number(nota);
         freq = 440 * Math.pow(2,(num-69)/12);
         Midi.cacheNote2Freq[nota] = freq;
      }
      else{
         freq = Midi.cacheNote2Freq[nota];
      }
      return freq;
   };

   /**
    * Devuelve el numero midi de un nombre de nota
    * @function number2freq
    */
   Midi.note2number = function(note){
      // C0 es 12, de ahí para arriba hasta 127
      var octava = Number(note.substr(-1));
      var num;
      switch(note.substr(0,1).toLowerCase()){
         case 'c':
            num = 0;
            break;
         case 'd':
            num = 2;
            break;
         case 'e':
            num = 4;
            break;
         case 'f':
            num = 5;
            break;
         case 'g':
            num = 7;
            break;
         case 'a':
            num = 9;
            break;
         case 'b':
            num = 11;
            break;
      }
      if(note.substr(1, 2)==='#'){
         num ++; 
      }
      num += 12;
      return octava*12 + num;
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.Midi = Midi;
})(this);
