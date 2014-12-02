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
       * La aplicación que contiene esto objeto
       */
      this.app = p.app;

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
      this.tempo = p.tempo*4 || 120*4;


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
      var unBajo = new EscuelaDeExperimentos.AudioInstrumentoBajo({
         audioGraph: this,
         cuantosTiempos: 16,
         volumen: 0.4,
      });
      unBajo.conectar(this.audioContext.destination);
      this.instrumentos.bajo = unBajo;

      var unLead = new EscuelaDeExperimentos.AudioInstrumentoLead({
         audioGraph: this,
         cuantosTiempos: 16,
         volumen: 0.10,
      });
      unLead.conectar(this.audioContext.destination);
      this.instrumentos.lead = unLead;

      var bateria = new EscuelaDeExperimentos.AudioInstrumentoBateria({
         audioGraph: this,
         cuantosTiempos: 16,
         volumen: 1.0,
      });
      bateria.conectar(this.audioContext.destination);
      this.instrumentos.bateria = bateria;

      var unSeno3 = new EscuelaDeExperimentos.AudioInstrumentoSeno({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16,
         volumen: 0.1,
      });
      unSeno3.conectar(this.audioContext.destination);
      this.instrumentos.seno3 = unSeno3;

      var unSeno4 = new EscuelaDeExperimentos.AudioInstrumentoSeno({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16,
         volumen: 0.1,
      });
      unSeno4.conectar(this.audioContext.destination);
      this.instrumentos.seno4 = unSeno4;

      var unSeno5 = new EscuelaDeExperimentos.AudioInstrumentoSeno({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16,
         volumen: 0.1,
      });
      unSeno5.conectar(this.audioContext.destination);
      this.instrumentos.seno5 = unSeno5;

      var unSeno6 = new EscuelaDeExperimentos.AudioInstrumentoSeno({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16,
         volumen: 0.1,
      });
      unSeno6.conectar(this.audioContext.destination);
      this.instrumentos.seno6 = unSeno6;
      
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
      for(var instrumento in this.instrumentos){
         this.instrumentos[instrumento].stop();
      }
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioGraph = AudioGraph;
})(this);
