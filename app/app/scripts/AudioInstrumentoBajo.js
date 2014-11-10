/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor InstrumentoBajo
    */
   var InstrumentoBajo = function(params){
      var p = params || {};

      /** 
       * @member oscilador
       * @private
       */
      // this.oscilador = null;

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
      this.ataque = p.ataque || 0.002;

      /** 
       * Tiempo de descarga en segs
       * @member descarga
       * @private
       */
      this.descarga = p.descarga || 0.20;

      this.initInstrumentoMonofonico(params);
   };
   
   // Heredar los métodos de MixinInstrumentoMonofonico
   EscuelaDeExperimentos.Utility.mixin(InstrumentoBajo.prototype, EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico);

   /** 
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   InstrumentoBajo.prototype.tocarNota = function(tiempo, duracion, frecuencia){
      var ctx = this.audioGraph.audioContext;

      var oscilador = ctx.createOscillator();
      var gain = ctx.createGain();

      oscilador.type = 'sawtooth';

      oscilador.connect(gain);
      gain.connect(this.salida);
      
      oscilador.frequency.setValueAtTime(frecuencia, tiempo);
      oscilador.start(tiempo);

      gain.gain.setValueAtTime(0, tiempo);
      gain.gain.linearRampToValueAtTime(1, tiempo+this.ataque);

      // gain.gain.setValueAtTime(1, tiempo + duracion*0.5);  //<-- Le gusta?
      gain.gain.linearRampToValueAtTime(0, tiempo + duracion*0.5 + this.descarga);
      oscilador.stop(tiempo + duracion*0.5 + this.descarga);

      this.gain = gain;
   };


   InstrumentoBajo.prototype.getGain = function(){
      if(this.gain===null){
         return 0;
      }
      return this.gain.gain.value;
   };

   /** 
    * Conecta la salida de este instrumento a otro nodo en la gráfica de audio
    * @public
    * @method
    */
   InstrumentoBajo.prototype.conectar = function(nodo){
      this.salida = nodo;
   };
   
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.InstrumentoBajo = InstrumentoBajo;
})(this);
