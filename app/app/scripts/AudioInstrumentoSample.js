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
   AudioInstrumentoSample.prototype.tocarNota = function(tiempo){
      var context = this.audioGraph.audioContext;
      var source = context.createBufferSource();
      source.buffer = this.buffer;
      source.connect(this.salida);
      source.start(tiempo); 
   };


   AudioInstrumentoSample.prototype.getGain = function(){
      return 0;  // ????
   };

   /** 
    * Conecta la salida de este instrumento a otro nodo en la gráfica de audio
    * @public
    * @method
    */
   AudioInstrumentoSample.prototype.conectar = function(nodo){
      this.salida = nodo;
   };
   
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioInstrumentoSample = AudioInstrumentoSample;
})(this);
