/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor AudioInstrumentoBajo
    */
   var AudioInstrumentoBajo = function(params){
      var p = params || {};

      /** 
       * Nodo de audio que controla el volúmen/envelope de este instrumento.
       * @member gain
       * @private
       */
      this.gain = null;

      /** 
       * Tiempo de ataque en segundos
       * @member ataque
       * @private
       */
      this.ataque = p.ataque || 0.005;

      /** 
       * Tiempo de descarga en segs
       * @member descarga
       * @private
       */
      this.descarga = p.descarga || 0.20;

      /** 
       * Tiempo de sustain (porcentaje de la duracion de la nota respecto a el tempo)
       * @member sustain
       * @private
       */
      this.sustain = p.sustain || 0.30;

      /** 
       * Array de notas midi, que se pueden tocar en las secuencias.
       * El tamaño debe ser igual a this.cuantasNotas
       *
       * @member posiblesNotas
       * @private
       */
      // this.posiblesNotas = [150, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
      // this.posiblesNotas = ['A1', 'C2', 'D2', 'E2', 'G2', 'A2', 'C3', 'D3', 'E3', 'G3'];
      this.posiblesNotas = ['A1', 'C2', 'D2', 'E2', 'G2', 'A2', 'C3', 'D3', 'E3', 'G3', 'A3'];
      params.cuantasNotas = this.posiblesNotas.length;

      this.initInstrumentoMonofonico(params);
   };
   
   // Heredar los métodos de MixinInstrumentoMonofonico
   EscuelaDeExperimentos.Utility.mixin(AudioInstrumentoBajo.prototype, EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico);

   /** 
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   AudioInstrumentoBajo.prototype.tocarNota = function(tiempo, duracion, cualNota){
      if(cualNota === -1){
         return;
      }

      var frecuencia = EscuelaDeExperimentos.Midi.note2freq(this.posiblesNotas[cualNota]);

      var ctx = this.audioGraph.audioContext;

      var oscilador = ctx.createOscillator();
      var oscilador2 = ctx.createOscillator();
      var gain = ctx.createGain();

      // oscilador.type = 'square';
      // oscilador2.type = 'square';
      // oscilador.type = 'sawtooth';
      // oscilador2.type = 'sawtooth';
      oscilador.type = 'triangle';
      oscilador2.type = 'triangle';
      oscilador2.detune.setValueAtTime(2,tiempo);

      oscilador.connect(gain);
      oscilador2.connect(gain);
      gain.connect(this.nodoVolumen);
      
      oscilador.frequency.setValueAtTime(frecuencia, tiempo);
      oscilador2.frequency.setValueAtTime(frecuencia/2, tiempo);
      oscilador.start(tiempo);
      oscilador2.start(tiempo);

      gain.gain.setValueAtTime(0, tiempo);
      gain.gain.linearRampToValueAtTime(1, tiempo+this.ataque);

      gain.gain.setValueAtTime(1, tiempo + duracion*this.sustain);
      gain.gain.linearRampToValueAtTime(0, tiempo + duracion*this.sustain + this.descarga);

      oscilador.stop(tiempo + duracion*0.5 + this.descarga);
      oscilador2.stop(tiempo + duracion*0.5 + this.descarga);

      this.gain = gain;
   };


   AudioInstrumentoBajo.prototype.getGain = function(){
      if(this.gain===null){
         return 0;
      }
      return this.gain.gain.value;
   };
   
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioInstrumentoBajo = AudioInstrumentoBajo;
})(this);
