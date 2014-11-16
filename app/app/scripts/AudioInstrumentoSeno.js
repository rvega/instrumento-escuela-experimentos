/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor AudioInstrumentoSeno
    */
   var AudioInstrumentoSeno = function(params){
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
      this.ataque = p.ataque || 0.1;

      /** 
       * Tiempo de descarga en segs
       * @member descarga
       * @private
       */
      this.descarga = p.descarga || 0.20;

      /** 
       * Tiempo de sustain (porcentaje de la duracion de la nota segun el tempo)
       * @member sustain
       * @private
       */
      this.sustain = p.sustain || 0.50;

      /** 
       * Array de frecuencias, que se pueden tocar en las secuencias.
       * El tamaño debe ser igual a this.cuantasNotas
       *
       * @member frecuencias
       * @private
       */
      this.frecuencias = [150, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

      this.initInstrumentoMonofonico(params);
   };
   
   // Heredar los métodos de MixinInstrumentoMonofonico
   EscuelaDeExperimentos.Utility.mixin(AudioInstrumentoSeno.prototype, EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico);

   /** 
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   AudioInstrumentoSeno.prototype.tocarNota = function(tiempo, duracion, cualNota){
      var frecuencia = this.frecuencias[cualNota];
      
      var ctx = this.audioGraph.audioContext;

      var oscilador = ctx.createOscillator();
      var gain = ctx.createGain();

      oscilador.type = 'sine';

      oscilador.connect(gain);
      gain.connect(this.nodoVolumen);
      
      oscilador.frequency.setValueAtTime(frecuencia, tiempo);
      oscilador.start(tiempo);

      gain.gain.setValueAtTime(0, tiempo);
      gain.gain.linearRampToValueAtTime(1, tiempo+this.ataque);

      gain.gain.setValueAtTime(1, tiempo + duracion*this.sustain);
      gain.gain.linearRampToValueAtTime(0, tiempo + duracion*this.sustain + this.descarga);

      oscilador.stop(tiempo + duracion*0.5 + this.descarga);

      this.gain = gain;
   };


   AudioInstrumentoSeno.prototype.getGain = function(){
      if(this.gain===null){
         return 0;
      }
      return this.gain.gain.value;
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioInstrumentoSeno = AudioInstrumentoSeno;
})(this);
