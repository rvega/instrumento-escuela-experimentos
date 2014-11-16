(function(global){
   'use strict';

   /** 
    * @mixin AudioMixinInstrumentoMonofonico
    */
   var AudioMixinInstrumentoMonofonico = {};

   AudioMixinInstrumentoMonofonico.initInstrumentoMonofonico = function(params) {
      var p = params || {};

      /**
       * "Registro" del instrumento
       * @member cuantasNotas
       */
      this.cuantasNotas = p.cuantasNotas || 10;

      /**
       * Longitud de la secuencia 
       * @member cuantosTiempos
       */
      this.cuantosTiempos = p.cuantosTiempos || 16;

      /** 
       * Array de notas que conforman una secuencia. -1 es silencio, 
       * 0 es la primera frecuencia en el array "frecuencias", 1 es la segunda freq en 
       * el array "frecuencias", etc.
       *
       * @member secuencia
       * @public
       */
      if(typeof(p.secuencia)==='undefined'){
         var secuenciaSilencio = [];
         for(var i=0; i<this.cuantosTiempos; i++){
            secuenciaSilencio.push(-1);
         }
         this.secuencia = secuenciaSilencio;
      }
      else{
         this.secuencia = p.secuencia;
      }


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
      this.tiempoMirarFuturo = 0.050;

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

      /**
       * Notas en fila, contiene las notas que han sido programadas 
       * para que suenen en el futuro. Lo usamos para sincronizar mas
       * facilmente con el view.
       * @member notasEnFila
       */
      this.notasEnFila = [];

      /**
       * Cual paso de la secuencia se está tocando en este instante. 
       * Diferente de notaActual porque ese es el que se está programando
       * (scheduling) en este momento.
       * @member pasoActual
       */
      this.pasoActual = 0;

      /** 
       * Nodo de audio al que este instrumento envía su sonido
       * @member salida
       * @private
       */
      this.salida = null;
   };

   /** 
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   AudioMixinInstrumentoMonofonico.tocarNota = function(tiempo, duracion, frecuencia){
      // jshint unused:false
      throw new Error('AudioMixinInstrumentoMonofonico: Todos los instrumentos deben implementar el método \"tocarNota\"');
   };

   /** 
    * Devuelve el gain actual del instrumento. Para que los views dibujen
    * cosas 
    * @public
    * @method getGain
    */
   AudioMixinInstrumentoMonofonico.getGain = function(){
      throw new Error('AudioMixinInstrumentoMonofonico: Todos los instrumentos deben implementar el método \"getGain\"');
   };

   /** 
    * Devuelve el paso que está sonando (o en silencio) en este momento 
    * @public
    * @method getPasoActual
    */
   AudioMixinInstrumentoMonofonico.getPasoActual = function(tiempo){
      while(this.notasEnFila.length && this.notasEnFila[0].tiempo<tiempo) {
         this.pasoActual = this.notasEnFila[0].paso;
         this.notasEnFila.splice(0,1);   
      }
      return this.pasoActual;
   };

   /** 
    * @method resetTiempo
    * @public
    */
   AudioMixinInstrumentoMonofonico.resetTiempo = function(){
      this.pasoActual = 0;
      this.notaActual = 0;
      this.tiempoNotaActual = 0;
      this.tiempoNotaProxima = 0;
      this.notasEnFila = [];
   };

   /** 
    * Programa (schedule) las notas próximas a sonar. Ver explicación aqui:
    * http://www.html5rocks.com/en/tutorials/audio/scheduling/#toc-rocksolid
    * @public
    * @method programarNotas
    */
   AudioMixinInstrumentoMonofonico.programarNotas = function(tiempoAudio, tiempoInicial){

      // tiempo inicial se reinicia cuando el usuario le da play. El
      // tiempo del audio context no se puede resetear entonces hacemos
      // calclulos con tiempoAudio y para hacer schedule de las notas,
      // le sumamos el tiempo inicial.

      var bpm = this.audioGraph.tempo;
      var duracionNota = 60.0/bpm;
      var cualNota;
      while(this.tiempoNotaProxima < tiempoAudio+this.tiempoMirarFuturo){
         if(this.secuencia[this.notaActual] !== -1){
            cualNota = this.secuencia[this.notaActual];
            this.tocarNota(this.tiempoNotaProxima+tiempoInicial, duracionNota, cualNota);
         }

         // tambien pongo "silencios" en el queue para que la ruedita siempre
         // gire en el view (no solamente cuando hay notas)
         this.notasEnFila.push({
            paso: this.notaActual,
            tiempo: this.tiempoNotaProxima
         });
         
         this.tiempoNotaActual = this.tiempoNotaProxima;
         this.tiempoNotaProxima += duracionNota; 

         this.notaActual ++;
         if(this.notaActual === this.cuantosTiempos){
            this.notaActual = 0;
         }
      }
   };


   /** 
    * Cambia una nota de la secuencia
    * @public
    * @method setNotaSecuencia
    */
   AudioMixinInstrumentoMonofonico.setNotaSecuencia = function(columna, nota){
      this.secuencia[columna] = nota;
   };

   /** 
    * Conecta la salida de este instrumento a otro nodo en la gráfica de audio
    * @public
    * @method
    */
   AudioMixinInstrumentoMonofonico.conectar = function(nodo){
      // jshint unused:false
      throw new Error('AudioMixinInstrumentoMonofonico: Todos los instrumentos deben implementar el método \"conectar\"');
   };
   
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico = AudioMixinInstrumentoMonofonico;
})(this);

