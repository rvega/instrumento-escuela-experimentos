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
       */
      this.audioContext = p.audioContext || new AudioContext();

      /** 
       * @member playing
       */
      this.playing = true;

      /** 
       * @member tiempoInicial
       */
      this.tiempoInicial = this.audioContext.currentTime;

      /** 
       * Tempo en beats por minuto
       * @member tempo
       */
      this.tempo = p.tempo || 120;


      /** 
       * Periodo para correr el planificador de eventos. Segundos
       * @member periodoTick
       */
      this.periodoTick = p.periodoTick || 0.010;


      /** 
       * Array que contiene los nodos (instrumentos) de la gráfica de audio
       * @member instrumentos
       * @private
       */
      this.instrumentos = {};


      // Crear instancias de los instrumentos y conectarlos.
      var unBajo = new EscuelaDeExperimentos.InstrumentoBajo({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16
      });
      unBajo.conectar(this.audioContext.destination);
      this.instrumentos.bajo = unBajo;

      var unSeno1 = new EscuelaDeExperimentos.InstrumentoSeno({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16
      });
      unSeno1.conectar(this.audioContext.destination);
      this.instrumentos.seno1 = unSeno1;
      
      // Ejecutar el planificador de eventos cada periodo
      setInterval(this.tick.bind(this), this.periodoTick*1000);
   };

   /** 
    * Planificador de eventos de audio.
    * @private
    * @function
    */
   AudioGraph.prototype.tick = function(){
      if(this.playing === true){
         var tiempoAudio = this.audioContext.currentTime - this.tiempoInicial;
         for(var instrumento in this.instrumentos){
            this.instrumentos[instrumento].programarNotas(tiempoAudio, this.tiempoInicial);
         }
      }
   };

   /** 
    * @public
    * @function play
    */
   AudioGraph.prototype.play = function(){
      for(var instrumento in this.instrumentos){
         this.instrumentos[instrumento].resetTiempo();
      }
      this.tiempoInicial = this.audioContext.currentTime;
      this.playing = true; 
   };

   /** 
    * @public
    * @function stop
    */
   AudioGraph.prototype.stop = function(){
      this.playing = false; 
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioGraph = AudioGraph;
})(this);
