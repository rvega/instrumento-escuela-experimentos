/* global EscuelaDeExperimentos */
/* global Kinetic */

(function(global){
   'use strict';

   /** 
    * Objeto gráfico principal, contiene las instancias de otras vistas,
    * se encarga del loop de animación, dibujar, eventos de mouse, etc.
    * @constructor MainView
    */
   var MainView = function(params){
      var p = params || {};

      /** 
       * @member audioGraph
       * @public
       */
      this.audioGraph = p.audioGraph;

      /** 
       * Superficie de dibujo
       * @member stage
       * @private
       */
      this.stage = null;

      /** 
       * Array que contiene los otros views
       * @member views
       * @private
       */
      this.subViews = {};

      /** 
       * Elemento HTML
       * @member htmlContainer
       * @private
       */
      this.htmlContainer = p.htmlContainer;

      /** 
       * Tamaño
       * @member ancho
       * @private
       */
      this.ancho = p.ancho || window.innerWidth;

      /** 
       * Tamaño
       * @member alto
       * @private
       */
      this.alto = p.alto || window.innerHeight;

      this.initStage();
      this.initSubviews();
   };

   MainView.prototype.initStage = function(){
      // Superficie de dibujo de Kinetic. http://www.kineticjs.com/
      this.stage = new Kinetic.Stage({
         container:this.htmlContainer,
         width: this.ancho,
         height: this.alto
      });
   };

   MainView.prototype.initSubviews = function(){
      // Crear instancias de los views.
      var unBajo = new EscuelaDeExperimentos.InstrumentoBajoView({
         audioInstrumento: this.audioGraph.instrumentos.bajo,
         superView: this
      });
      this.subViews.bajo = unBajo;

      // Update manualmente la primera vez
      this.update();
   };

   MainView.prototype.update = function(){
      var tiempoAudio = this.audioGraph.audioContext.currentTime;
      for(var subView in this.subViews){
         this.subViews[subView].update(tiempoAudio);
      }

      window.requestAnimationFrame(this.update.bind(this));
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.MainView = MainView;
})(this);
