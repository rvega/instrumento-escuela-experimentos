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
       * @member width
       * @private
       */
      this.width = p.width;

      /** 
       * Tamaño
       * @member height
       * @private
       */
      this.height = p.height;

      this.initStage();
      this.initSubviews();
   };

   MainView.prototype.template = '<div id="stage"></div>';

   MainView.prototype.initStage = function(){
      var container = document.getElementById(this.htmlContainer);
      container.innerHTML += this.template;
      container.style.background = '#333';

      // Superficie de dibujo de Kinetic. http://www.kineticjs.com/
      this.stage = new Kinetic.Stage({
         container: 'stage',
         width: this.width,
         height: this.height
      });
   };

   MainView.prototype.initSubviews = function(){
      new EscuelaDeExperimentos.ControlesView({
         audioGraph: this.audioGraph,
         superView: this
      });

      var unBajo = new EscuelaDeExperimentos.InstrumentoBajoView({
         audioInstrumento: this.audioGraph.instrumentos.bajo,
         superView: this,
         width: this.width * 0.6,
         x: this.width/2,
         y: this.height/2 + 60
      });
      this.subViews.bajo = unBajo;

      this.subViews.bajoMini = unBajo;

      var w = this.width/8;
      var m = 13;
      var opts = {         
         audioInstrumento: this.audioGraph.instrumentos.bajo,
         superView: this,
         width: w,
         y: 10
      };

      opts.x = 1 + 0*(w+m);
      var unBajoMini = new EscuelaDeExperimentos.InstrumentoMiniView(opts);

      opts.x = 1 + 1*(w+m);
      unBajoMini = new EscuelaDeExperimentos.InstrumentoMiniView(opts);

      opts.x = 1 + 2*(w+m);
      unBajoMini = new EscuelaDeExperimentos.InstrumentoMiniView(opts);

      opts.x = 1 + 3*(w+m);
      unBajoMini = new EscuelaDeExperimentos.InstrumentoMiniView(opts);

      opts.x = 1 + 4*(w+m);
      unBajoMini = new EscuelaDeExperimentos.InstrumentoMiniView(opts);

      opts.x = 1 + 5*(w+m);
      unBajoMini = new EscuelaDeExperimentos.InstrumentoMiniView(opts);

      opts.x = 1 + 6*(w+m);
      unBajoMini = new EscuelaDeExperimentos.InstrumentoMiniView(opts);

      // opts.x = 1 + 7*(w+m);
      // unBajoMini = new EscuelaDeExperimentos.InstrumentoMiniView(opts);

      // this.subViews.bajo = unBajo;

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
