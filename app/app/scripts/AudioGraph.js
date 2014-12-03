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
      this.periodoTick = p.periodoTick || 0.001;


      /** 
       * Array que contiene los nodos (instrumentos) de la gráfica de audio
       * @member instrumentos
       * @private
       */
      this.instrumentos = {};


      // Crear instancias de los instrumentos y conectarlos.
      var bateria = new EscuelaDeExperimentos.AudioInstrumentoBateria({
         audioGraph: this,
         cuantosTiempos: 16,
         volumen: 1.0,
      }); bateria.conectar(this.audioContext.destination); this.instrumentos.bateria = bateria;

      var unBajo = new EscuelaDeExperimentos.AudioInstrumentoBajo({
         audioGraph: this,
         cuantosTiempos: 16,
         volumen: 0.6,
      });
      unBajo.conectar(this.audioContext.destination);
      this.instrumentos.bajo = unBajo;

      var armonico = new EscuelaDeExperimentos.AudioInstrumentoArmonico({
         audioGraph: this,
         cuantosTiempos: 16,
         volumen: 0.10,
      });
      armonico.conectar(this.audioContext.destination);
      this.instrumentos.armonico1 = armonico;


      var armonico2 = new EscuelaDeExperimentos.AudioInstrumentoArmonico({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16,
         volumen: 0.1,
      });
      armonico2.conectar(this.audioContext.destination);
      this.instrumentos.armonico2 = armonico2;

      var armonico3 = new EscuelaDeExperimentos.AudioInstrumentoArmonico({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16,
         volumen: 0.1,
      });
      armonico3.conectar(this.audioContext.destination);
      this.instrumentos.armonico3 = armonico3;

      var chime = new EscuelaDeExperimentos.AudioInstrumentoChime({
         audioGraph: this,
         cuantasNotas: 10,
         cuantosTiempos: 16,
         volumen: 0.07,
      });
      chime.conectar(this.audioContext.destination);
      this.instrumentos.chime = chime;

      var unLead = new EscuelaDeExperimentos.AudioInstrumentoLead({
         audioGraph: this,
         cuantosTiempos: 16,
         volumen: 0.10,
      });
      unLead.conectar(this.audioContext.destination);
      this.instrumentos.lead = unLead;

      
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
