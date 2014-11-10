/* global EscuelaDeExperimentos */
/* global Kinetic */

(function(global){
   'use strict';
   
   /** 
    * Objeto gráfico principal, contiene las instancias de otras vistas,
    * se encarga del loop de animación, dibujar, eventos de mouse, etc.
    * @constructor ViewMain
    */
   var ViewMain = function(params){
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

   ViewMain.prototype.template = '<div id="stage"></div>';

   ViewMain.prototype.initStage = function(){
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

   ViewMain.prototype.initSubviews = function(){
      new EscuelaDeExperimentos.ViewControles({
         audioGraph: this.audioGraph,
         superView: this
      });

      var widthMinis = this.width/8;
      var marginMinis = 13;

      // Views bajo
      var coloresBajo = {
         bordes: '#fa6923',
         fondo: '#333333',
         fondoDestacado: '#b1b1b1',
         nota: '#fa6923',
         notaDestacada: '#af410c'
      };

      var unBajo = new EscuelaDeExperimentos.ViewInstrumento({
         audioInstrumento: this.audioGraph.instrumentos.bajo,
         superView: this,
         width: this.width * 0.6,
         x: this.width/2,
         y: this.height/2 + 60,
         colores: coloresBajo
      });
      this.subViews.bajo = unBajo;

      var unBajoMini = new EscuelaDeExperimentos.ViewInstrumentoMini({
         audioInstrumento: this.audioGraph.instrumentos.bajo,
         superView: this,
         width: widthMinis,
         y: 10,
         x: 1,
         colores: coloresBajo
      });
      this.subViews.bajoMini = unBajoMini;

      // ......
      // var w = widthMinis;
      // var m = marginMinis;
      // var opts = {         
      //    audioInstrumento: this.audioGraph.instrumentos.bajo,
      //    superView: this,
      //    width: w,
      //    y: 10,
      //    colores: coloresBajo
      // };
      // opts.x = 1 + 1*(w+m);
      // unBajoMini = new EscuelaDeExperimentos.ViewInstrumentoMini(opts);

      // opts.x = 1 + 2*(w+m);
      // unBajoMini = new EscuelaDeExperimentos.ViewInstrumentoMini(opts);

      // opts.x = 1 + 3*(w+m);
      // unBajoMini = new EscuelaDeExperimentos.ViewInstrumentoMini(opts);

      // opts.x = 1 + 4*(w+m);
      // unBajoMini = new EscuelaDeExperimentos.ViewInstrumentoMini(opts);

      // opts.x = 1 + 5*(w+m);
      // unBajoMini = new EscuelaDeExperimentos.ViewInstrumentoMini(opts);

      // opts.x = 1 + 6*(w+m);
      // unBajoMini = new EscuelaDeExperimentos.ViewInstrumentoMini(opts);


      // Update manualmente la primera vez
      this.update();
   };

   ViewMain.prototype.update = function(){
      var tiempoAudio = this.audioGraph.audioContext.currentTime;
      for(var subView in this.subViews){
         this.subViews[subView].update(tiempoAudio);
      }

      window.requestAnimationFrame(this.update.bind(this));
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewMain = ViewMain;
})(this);
