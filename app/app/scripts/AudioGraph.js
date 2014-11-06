/* global EscuelaDeExperimentos */
/* global AudioContext */

(function(global){
   'use strict';

   /** 
    * Objeto de audio principal, contiene las instancias de los instrumentos,
    * se encarga de programar el tiempo de los eventos de audio, etc.
    * @constructor AudioGraph
    */
   var AudioGraph = function(params){
      var p = params || {};

      /** 
       * Ver https://developer.mozilla.org/en-US/docs/Web/API/AudioContext
       * @member audioContext
       * @memberof AudioGraph
       * @instance
       * @public
       */
      this.audioContext = p.audioContext || new AudioContext();


      /** 
       * Tempo en beats por minuto
       * @member tempo
       * @memberof AudioGraph
       * @instance
       * @public
       */
      this.tempo = p.tempo || 120;


      /** 
       * Periodo para correr el planificador de eventos. Segundos
       * @member periodoTick
       * @private
       */
      this.periodoTick = p.periodoTick || 0.050;


      /** 
       * Array que contiene los nodos (instrumentos) de la gráfica de audio
       * @member instrumentos
       * @private
       */
      this.instrumentos = {};


      // Crear instancias de los instrumentos y conectarlos.
      var unBajo = new EscuelaDeExperimentos.InstrumentoBajo({
         audioGraph: this
      });
      unBajo.conectar(this.audioContext.destination);
      this.instrumentos.bajo = unBajo;

      
      // Ejecutar el planificador de eventos cada periodo
      setInterval(this.tick.bind(this), this.periodoTick*1000);
   };

   /** 
    * Planificador de eventos de audio.
    * @private
    * @function
    */
   AudioGraph.prototype.tick = function(){
      var tiempoAudio = this.audioContext.currentTime;
      for(var instrumento in this.instrumentos){
         this.instrumentos[instrumento].programarNotas(tiempoAudio);
      }
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioGraph = AudioGraph;
})(this);
