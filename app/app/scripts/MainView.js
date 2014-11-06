/* global EscuelaDeExperimentos */
/* global PIXI */

(function(global){
   'use strict';

   /** 
    * Objeto gráfico principal, contiene las instancias de otras vistas,
    * se encarga del loop de animación, dibujar, etc.
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
      // Superficie de dibujo de PIXI. http://www.pixijs.com/
      this.stage = new PIXI.Stage(0x222222);
      // this.renderer = new PIXI.autoDetectRecommendedRenderer(
      this.renderer = new PIXI.WebGLRenderer(
      // this.renderer = new PIXI.CanvasRenderer(
         this.ancho,
         this.alto,
         { antialias:true }
      );
      var container = document.getElementById(this.htmlContainer);
      container.appendChild(this.renderer.view);
   };

   MainView.prototype.initSubviews = function(){
      // Crear instancias de los views.
      var unBajo = new EscuelaDeExperimentos.InstrumentoBajoView({
         audioInstrumento: this.audioGraph.instrumentos.bajo,
         superView: this
      });
      this.subViews.bajo = unBajo;

      // Render manualmente la primera vez
      this.render();
   };

   MainView.prototype.render = function(){
      this.renderer.render(this.stage);

      var tiempoAudio = this.audioGraph.audioContext.currentTime;
      for(var subView in this.subViews){
         this.subViews[subView].update(tiempoAudio);
      }

      window.requestAnimationFrame(this.render.bind(this));
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.MainView = MainView;
})(this);
