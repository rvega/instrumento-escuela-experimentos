(function(global){
   'use strict';

   /** 
    * @mixin MixinInstrumentoMonofonico
    */
   var MixinInstrumentoMonofonico = {};

   MixinInstrumentoMonofonico.initInstrumentoMonofonico = function(params) {
      var p = params || {};

      /** 
       * Array de notas que conforman una secuencia. 0 es silencio, 
       * 1 es la primera frecuencia en el array "notas", 2 es la segunda freq en 
       * el array "notas", etc.
       *
       * @member secuencia
       * @public
       */
      this.secuencia = p.secuencia || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      /** 
       * Array de notas (frecuencias), que se pueden tocar en las secuencias,
       *
       * @member notas
       * @private
       */
      this.notas = p.notas || [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

      /** 
       * La gráfica que contiene a este instrumento
       * @member audioGraph
       * @private
       */
      this.audioGraph = p.audioGraph;

      /** 
       * Tiempo en segundos que se mira al futuro en la secuencia para
       * determinar si viene una nota nueva.
       * @member tiempoMirarFuturo
       * @private
       */
      this.tiempoMirarFuturo = 0.5;

      /** 
       * Cuando empezó a sonar la nota actual.
       * @member tiempoNotaActual
       * @private
       */
      this.tiempoNotaActual = 0;

      /** 
       * Indice del array secuencia.
       * @member notaActual
       * @private
       */
      this.notaActual = 0;

      /** 
       * Cuando debe empezar a sonar la próxima nota.
       * @member tiempoNotaProxima
       * @private
       */
      this.tiempoNotaProxima = 0;
   };

   /** 
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   MixinInstrumentoMonofonico.tocarNota = function(tiempo, duracion, frecuencia){
      // jshint unused:false
      console.error('MixinInstrumentoMonofonico: Todos los instrumentos deben implementar el método \"tocarNota\"');
   };


   /** 
    * Programa (schedule) las notas próximas a sonar. Ver explicación aqui:
    * http://www.html5rocks.com/en/tutorials/audio/scheduling/#toc-rocksolid
    * @public
    * @method programarNotas
    */
   MixinInstrumentoMonofonico.programarNotas = function(tiempo){
      var bpm = this.audioGraph.tempo;
      var duracionNota = 60.0/bpm;
      var freq;
      while(this.tiempoNotaProxima < tiempo+this.tiempoMirarFuturo){
         if(this.secuencia[this.notaActual] !== 0){
            freq = this.notas[ this.secuencia[this.notaActual] ];
            this.tocarNota(this.tiempoNotaProxima, duracionNota, freq);
         }
         
         this.tiempoNotaActual = this.tiempoNotaProxima;
         this.tiempoNotaProxima += duracionNota; 

         this.notaActual ++;
         if(this.notaActual === this.secuencia.length){
            this.notaActual = 0;
         }
      }
   };

   /** 
    * Conecta la salida de este instrumento a otro nodo en la gráfica de audio
    * @public
    * @method
    */
   MixinInstrumentoMonofonico.conectar = function(nodo){
      // jshint unused:false
      console.error('MixinInstrumentoMonofonico: Todos los instrumentos deben implementar el método \"conectar\"');
   };
   
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.MixinInstrumentoMonofonico = MixinInstrumentoMonofonico;
})(this);

