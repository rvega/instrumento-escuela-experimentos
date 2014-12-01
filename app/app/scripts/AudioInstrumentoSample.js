/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor AudioInstrumentoSample
    */
   var AudioInstrumentoSample = function(params){
      var p = params || {};

      /** 
       * @member wave
       * @private
       */
      this.wave = null || p.wave;

      /** 
       * Buffer de audio donde se descargó y decodificó el sonido que vamos a tocar.
       * @member buffer
       */
      this.buffer = null;

      this.descargarAudio();
      this.initInstrumentoMonofonico(params);
   };
   
   // Heredar los métodos de MixinInstrumentoMonofonico
   EscuelaDeExperimentos.Utility.mixin(AudioInstrumentoSample.prototype, EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico);

   /** 
    * Descarga el archivo de audio que va a sonar
    * @private
    * @method tocarNota
    */
   AudioInstrumentoSample.prototype.descargarAudio = function(){
      var a = document.createElement('audio');
      var canPlayOgg = !!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
      var canPlayMp3 = !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
      var url;
      if(canPlayOgg){
         url = 'waves/' + this.wave + '.ogg';
      }
      else if(canPlayMp3){
         url = 'waves/' + this.wave + '.mp3';
      }
      // TODO: else ??
      
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = this.terminoDescargaAudio.bind(this);
      request.send();
   };

   AudioInstrumentoSample.prototype.terminoDescargaAudio = function(e){
      var response = e.target.response;
      var self = this;
      this.audioGraph.audioContext.decodeAudioData(response, function(buffer) {
         self.buffer = buffer;
      }, function(){
         console.log('Error al decodificar archivo de onda ' + e.target.responseURL);
      });
   };

   /** 
    * Suena una nota.
    * @private
    * @method tocarNota
    */
   AudioInstrumentoSample.prototype.tocarNota = function(tiempo, duracion, cualNota){
      if(cualNota === -1){
         return;
      }

      var context = this.audioGraph.audioContext;
      var source = context.createBufferSource();
      source.buffer = this.buffer;
      source.connect(this.nodoVolumen);
      source.start(tiempo); 
      source.stop(tiempo + 3*duracion);
      
      // source.connect(this.analizador);
   };

   AudioInstrumentoSample.prototype.conectar = function(nodo){
      var ctx = this.audioGraph.audioContext;
      this.nodoVolumen = ctx.createGain();
      this.nodoVolumen.gain.setValueAtTime(this.volumen, ctx.currentTime);
      this.nodoVolumen.connect(nodo);

      // this.analizador = ctx.createAnalyser();
      // this.analizador.fftSize = 2048;
   };

   AudioInstrumentoSample.prototype.getGain = function(tiempo){
      var on = this.secuencia[this.getPasoActual(tiempo)] !== -1;
      if(on){
         var duracionNota = 60.0/this.audioGraph.tempo;
         var t = tiempo%duracionNota;
         // Solo mostrar gain en 1 si el tiempo está cercano al inicio
         // de la nota (ataque). Es percusion! ;)
         if(t<0.2){
            return 1; 
         }
      }
      return 0;

      // Realmente el gain se puede calcular con algo como lo siguiente 
      // pero esto hace fft y está consumiendo mucha CPU y en nuestro 
      // caso no necesitamos algo preciso.
      //
      // var l = this.analizador.frequencyBinCount;
      // var data = new Float32Array(l);
      // this.analizador.getFloatTimeDomainData(data);
      //
      // var gain = 0;
      // for(var i=0; i<l; i++) {
      //    gain += (data[i]);
      // }
      // gain = gain / l;
      // return gain;
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioInstrumentoSample = AudioInstrumentoSample;
})(this);
