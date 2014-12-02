/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor AudioInstrumentoArmonico
    */
   var AudioInstrumentoArmonico = function(params){
      var p = params || {};

      /** 
       * @member gain
       * @private
       */
      this.gain = null;

      /** 
       * Tiempo de ataque en segundos
       * @member ataque
       * @private
       */
      this.ataque = p.ataque || 0.2;

      /** 
       * Tiempo de descarga en segs
       * @member descarga
       * @private
       */
      this.descarga = p.descarga || 0.400;

      /** 
       * Tiempo de sustain (porcentaje de la duracion de la nota segun el tempo)
       * @member sustain
       * @private
       */
      this.sustain = p.sustain || 0.4;

      /** 
       * Array de posiblesNotas, que se pueden tocar en las secuencias.
       * El tamaño debe ser igual a this.cuantasNotas
       *
       * @member posiblesNotas
       * @private
       */
      // this.posiblesNotas = [150, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
      this.posiblesNotas = ['A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6', 'G6']; 
      params.cuantasNotas = this.posiblesNotas.length;

      this.initInstrumentoMonofonico(params);
   };
   
   // Heredar los métodos de MixinInstrumentoMonofonico
   EscuelaDeExperimentos.Utility.mixin(AudioInstrumentoArmonico.prototype, EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico);

   /** 
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   AudioInstrumentoArmonico.prototype.tocarNota = function(tiempo, duracion, cualNota){
      if(cualNota === -1){
         return;
      }

      var frecuencia = EscuelaDeExperimentos.Midi.note2freq(this.posiblesNotas[cualNota]);

      var ctx = this.audioGraph.audioContext;

      var oscilador = ctx.createOscillator();
      var oscilador2 = ctx.createOscillator();
      var gain = ctx.createGain();

      oscilador.type = 'sine';
      oscilador2.type = 'sine';
      oscilador2.detune = 2;

      oscilador.connect(gain);
      oscilador2.connect(gain);
      gain.connect(this.nodoVolumen);
      
      oscilador.frequency.setValueAtTime(frecuencia, tiempo);
      oscilador2.frequency.setValueAtTime(frecuencia, tiempo);
      oscilador.start(tiempo);
      oscilador2.start(tiempo);

      gain.gain.setValueAtTime(0, tiempo);
      gain.gain.linearRampToValueAtTime(1, tiempo+this.ataque);

      gain.gain.setValueAtTime(1, tiempo + duracion*this.sustain);
      gain.gain.linearRampToValueAtTime(0, tiempo + duracion*this.sustain + this.descarga);

      oscilador.stop(tiempo + duracion*this.sustain + this.descarga);
      oscilador2.stop(tiempo + duracion*this.sustain + this.descarga);

      this.gain = gain;
   };


   AudioInstrumentoArmonico.prototype.getGain = function(){
      if(this.gain===null){
         return 0;
      }
      return this.gain.gain.value;
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioInstrumentoArmonico = AudioInstrumentoArmonico;
})(this);
