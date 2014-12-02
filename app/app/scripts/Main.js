/* global EscuelaDeExperimentos */

(function(global){
   'use strict';
   
   /** 
    * Todas las clases, mixins, etc. van en este namespace.
    * @namespace EscuelaDeExperimentos
    */
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};

   /**
    * Las funciones en este archivo constituyen la Interfaz de programación de
    * la aplicación (API) y están diseñadas para controlar el instrumento 
    * desde otros scripts. Cualquier otra interacción con la app debe usarse 
    * con mucho cuidado.
    * @class InstrumentoWeb
    */

   /** 
    * Constructor del objeto InstrumentoWeb que encapsula toda la aplicación.  
    * @constructor InstrumentoWeb
    */
   var InstrumentoWeb = function(params){
      var p = params || {};

      if(!p.htmlContainer){
         console.error('EscuelaDeExperimentos.InstrumentoWeb(): \
                       Necesito un elemento html donde dibujar.');
         return;
      }

      /** 
       * Ruta al directorio donde están los arhivos de la app 
       * (scripts, waves, etc)
       * @member path
       */
      this.path = p.path || './';

      // Ancho default es el ancho "natural" del contenedor en el html.
      var width = p.width || document.getElementById(p.htmlContainer).offsetWidth;
      var height = width*0.75;

      this.audioGraph = new EscuelaDeExperimentos.AudioGraph({
         app: this
      });

      this.mainView = new EscuelaDeExperimentos.ViewMain({
         audioGraph: this.audioGraph,
         htmlContainer: p.htmlContainer,
         width: width,
         height: height
      });
   };


   /**
    * Devuelve un objeto que describe el estado interno del 
    * instrumento
    * @function getEstado
    */
   InstrumentoWeb.prototype.getEstado = function(){
      var ret = {};

      ret.tempo = this.audioGraph.tempo;

      var instrumentos = {};
      for(var nombreInstrumento in this.audioGraph.instrumentos){
         var instrumento = this.audioGraph.instrumentos[nombreInstrumento];
         instrumentos[nombreInstrumento] = instrumento.getSecuencia();
      }
      ret.instrumentos = instrumentos;

      return ret;
   };

   /**
    * Devuelve un número entre 0 y 1 que indica que tan parecidos son
    * dos objetos que describen el estado del instrumento. Útil para
    * comparar las secuencias que entra un usuario con alguna 
    * secuencia conocida por el programador.
    * @function compararEstados
    */
   InstrumentoWeb.compararEstados = function(obj1, obj2){ 
      // TODO: mejorar esta funcion
      if(JSON.stringify(obj1)===JSON.stringify(obj2)){
         return 1;
      }
      return 0;
   };

   /**
    * Establece el estado interno del instrumento a partir de un 
    * objeto
    * @function setEstado
    */
   InstrumentoWeb.prototype.setEstado = function(obj){ 
      // jshint unused:false
      throw new Error('InstrumentoWeb.setEstado: Esta función no se ha implementado aún.');
       
   };

   /**
    * Establece el tempo en beats (corcheas) por minuto
    * @function setTempo
    */
   InstrumentoWeb.prototype.setTempo = function(tempo){
      this.audioGraph.tempo=tempo*4; 
      this.mainView.controles.knobTempo.setValue(tempo*4);
   };

   /**
    * Detiene la ejecución
    * @function stop
    */
   InstrumentoWeb.prototype.stop = function(){
      this.audioGraph.stop();
   };

   /**
    * Empieza la ejecución 
    * @function play
    */
   InstrumentoWeb.prototype.play = function(){ 
      this.audioGraph.play();
   };

   /**
    * Reinicia el tiempo del motor de audio para que la ejecución
    * vuelva a empezar desde el inicio.
    * @function resetTiempo
    */
   InstrumentoWeb.prototype.resetTiempo = function(){ 
      throw new Error('InstrumentoWeb.resetTiempo: Esta función no se ha implementado aún.');
   };

   /**
    * Borra todas las notas en todo el instrumento, queda en silencio
    * @function borrarNotas
    */
   InstrumentoWeb.prototype.borrarNotas = function(){ 
      throw new Error('InstrumentoWeb.borrarNotas: Esta función no se ha implementado aún.');
   };

   /**
    * Suscribe una función de callback para que se dispare cada vez
    * que el usuario cambia el estado del instrumento. La función de 
    * callback toma un parametro `obj` que es un objeto de 
    * descripción de estado.
    * @function onChangeState
    */
   InstrumentoWeb.prototype.onChangeState = function(callback){ 
      // jshint unused:false
      throw new Error('InstrumentoWeb.onChangeState: Esta función no se ha implementado aún.');
   };


   global.EscuelaDeExperimentos.InstrumentoWeb = InstrumentoWeb;
})(this);
