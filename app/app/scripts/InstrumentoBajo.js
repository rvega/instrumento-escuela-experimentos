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
      this.oscilador = null;

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
   
   // Heredar los métodos y propiedades de MixinInstrumentoMonofonico
   EscuelaDeExperimentos.Utility.mixin(InstrumentoBajo.prototype, EscuelaDeExperimentos.MixinInstrumentoMonofonico);

   /** 
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   InstrumentoBajo.prototype.tocarNota = function(tiempo, duracion, frecuencia){
      this.oscilador.frequency.setValueAtTime(frecuencia, tiempo);

      this.gain.gain.setValueAtTime(0, tiempo);
      this.gain.gain.linearRampToValueAtTime(1, tiempo+this.ataque);

      this.gain.gain.linearRampToValueAtTime(0, tiempo + duracion*0.5 + this.descarga);
   };


   /** 
    * Conecta la salida de este instrumento a otro nodo en la gráfica de audio
    * @public
    * @method
    */
   InstrumentoBajo.prototype.conectar = function(nodo){
      var ctx = this.audioGraph.audioContext;

      this.oscilador = ctx.createOscillator();
      this.oscilador.type = 'saw';
      this.oscilador.frequency.value = 220;
      this.oscilador.start();

      this.gain = ctx.createGain();
      this.gain.gain.value = 0;

      this.oscilador.connect(this.gain);
      this.gain.connect(nodo);
   };
   
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.InstrumentoBajo = InstrumentoBajo;
})(this);
