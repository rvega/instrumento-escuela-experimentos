/* global EscuelaDeExperimentos */

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


      // Superficie de dibujo de PIXI. http://www.pixijs.com/
      var w = window.innerWidth;
      var h = window.innerHeight;
      this.stage = new PIXI.Stage(0x222222);
      this.renderer = new PIXI.autoDetectRecommendedRenderer(w,h,{
         antialias:true 
      });
      var container = document.getElementById(p.htmlElementId);
      container.appendChild(this.renderer.view);

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
      var tiempoAudio = this.audioGraph.audioContext.currentTime;
      for(var subView in this.subViews){
         this.subViews[subView].update(tiempoAudio);
      }

      this.renderer.render(this.stage);

      // window.requestAnimationFrame(this.render.bind(this));
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.MainView = MainView;
})(this);
