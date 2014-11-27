/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor AudioInstrumentoLead
    */
   var AudioInstrumentoLead = function(params){
      var p = params || {};

      /** 
       * @member gain
       * @private
       */
      this.gain = null;

      // TODO: doc
      this.trianguloVolumen = 1;
      this.cuadrado1Volumen = 0.6;
      this.cuadrado2Volumen = 0.6;
      this.silencioPrevio = true; 

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
      this.descarga = p.descarga || 0.050;

      /** 
       * Tiempo de glide en segundos
       * @member glide
       * @private
       */
      this.glide = p.glide || 0.100;

      /** 
       * Proporcion de desafinado. Numeros cercanos a uno funcionan bien.
       * @member detune
       * @private
       */
      this.detune = p.detune || 1.0114;

      /** 
       * Frecuencia anterior, para poder hacer glide
       * @member frecuenciaAnterior;
       * @private
       */
      this.frecuenciaAnterior = -2;


      /** 
       * Array de posiblesNotas, que se pueden tocar en las secuencias.
       * El tamaño debe ser igual a this.cuantasNotas
       *
       * @member posiblesNotas
       * @private
       */
      // this.posiblesNotas = [150, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
      // this.posiblesNotas = ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5']; 
      this.posiblesNotas = ['A4', 'C5', 'D5', 'E5', 'G5', 'A5', 'C6', 'D6', 'E6', 'G6', 'A6']; 
      params.cuantasNotas = this.posiblesNotas.length;


      this.initInstrumentoMonofonico(params);
   };
   
   // Heredar los métodos de MixinInstrumentoMonofonico
   EscuelaDeExperimentos.Utility.mixin(
      AudioInstrumentoLead.prototype, 
      EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico
   );

   /**
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   AudioInstrumentoLead.prototype.tocarNota = function(tiempo, duracion, cualNota){
      ///////////////////////////////////////////
      // Descarga
      //
      if(cualNota===-1){
         // Si esta nota es un silencio y la anterior no lo fué, 
         // programamos (schedule) la descarga de la nota anterior
         if(!this.silencioPrevio){
            this.envelope.gain.setValueAtTime(1, tiempo);
            this.envelope.gain.linearRampToValueAtTime(0, tiempo + this.descarga);
         }
         this.silencioPrevio = true;
         return;
      }

      ///////////////////////////////////////////
      // Ataque
      //
      if(this.silencioPrevio){
         // Si la nota anterior fué silencio, programamos el ataque
         this.envelope.gain.setValueAtTime(0, tiempo);
         this.envelope.gain.linearRampToValueAtTime(1, tiempo+this.ataque);
      }

      this.silencioPrevio = false;

      ///////////////////////////////////////////
      // Glide
      // 
      var frecuencia = EscuelaDeExperimentos.Midi.note2freq(this.posiblesNotas[cualNota]);
      if(this.frecuenciaAnterior===-2){
         // El valor -2 solo se le dá al inicializar esta clase, lo usamos
         // para que no haya glide con la primera nota
         this.frecuenciaAnterior = frecuencia; 
      }
      this.triangulo.frequency.setValueAtTime(this.frecuenciaAnterior, tiempo);
      this.triangulo.frequency.exponentialRampToValueAtTime(frecuencia, tiempo+this.glide);

      var fda = this.frecuenciaAnterior * this.detune;
      var fd = frecuencia * this.detune;
      this.cuadrado1.frequency.setValueAtTime(fda, tiempo);
      this.cuadrado1.frequency.exponentialRampToValueAtTime(fd, tiempo+this.glide);

      fda = this.frecuenciaAnterior / this.detune;
      fd = frecuencia / this.detune;
      this.cuadrado2.frequency.setValueAtTime(fda, tiempo);
      this.cuadrado2.frequency.exponentialRampToValueAtTime(fd, tiempo+this.glide);

      this.frecuenciaAnterior = frecuencia;
   };

   /** 
    * Conecta la salida de este instrumento a otro nodo en la gráfica de audio
    * @public
    * @method
    */ 
   AudioInstrumentoLead.prototype.conectar = function(nodo){
      var ctx = this.audioGraph.audioContext;
      this.nodoVolumen = ctx.createGain();
      this.nodoVolumen.gain.setValueAtTime(this.volumen, ctx.currentTime);
      this.nodoVolumen.connect(nodo);

      this.triangulo = ctx.createOscillator();
      this.cuadrado1 = ctx.createOscillator();
      this.cuadrado2 = ctx.createOscillator();
      this.gainTriangulo = ctx.createGain();
      this.gainCuadrado1 = ctx.createGain();
      this.gainCuadrado2 = ctx.createGain();
      this.envelope = ctx.createGain();

      this.triangulo.type = 'sawtooth';
      this.cuadrado1.type = 'square';
      this.cuadrado2.type = 'square';

      this.gainTriangulo.gain.setValueAtTime(this.trianguloVolumen, ctx.currentTime);
      this.gainCuadrado1.gain.setValueAtTime(this.cuadrado1Volumen, ctx.currentTime);
      this.gainCuadrado2.gain.setValueAtTime(this.cuadrado2Volumen, ctx.currentTime);
      this.envelope.gain.setValueAtTime(0, ctx.currentTime);

      this.triangulo.connect(this.gainTriangulo);
      this.cuadrado1.connect(this.gainCuadrado1);
      this.cuadrado2.connect(this.gainCuadrado2);
      this.gainTriangulo.connect(this.envelope);
      this.gainCuadrado1.connect(this.envelope);
      this.gainCuadrado2.connect(this.envelope);
      this.envelope.connect(this.nodoVolumen);

      this.triangulo.start(ctx.currentTime);
      this.cuadrado1.start(ctx.currentTime);
      this.cuadrado2.start(ctx.currentTime);
   };

   AudioInstrumentoLead.prototype.getGain = function(){
      return 0;
      // if(this.gain===null){
      //    return 0;
      // }
      // return this.envelope.gain.value;
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioInstrumentoLead = AudioInstrumentoLead;
})(this);
