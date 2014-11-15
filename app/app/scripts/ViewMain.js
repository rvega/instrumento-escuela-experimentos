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
      this.audioGraph = p.audioGraph;
      this.htmlContainer = p.htmlContainer;
      this.width = p.width;
      this.height = p.height;

      this.stage = null;
      this.subViews = {};
      this.instrumentoActivo = null;
      this.instrumentoMiniActivo = null;

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
         fondo: '#333333',
         fondoDestacado: '#464646',
         bordes: '#e63b31',
         nota: '#e63b31',
         notaDestacada: '#932822'
      };

      var unBajo = new EscuelaDeExperimentos.ViewInstrumento({
         audioInstrumento: this.audioGraph.instrumentos.bajo,
         superView: this,
         width: this.width * 0.6,
         x: this.width/2,
         y: this.height/2 + 60,
         colores: coloresBajo,
         visible: true
      });
      this.subViews.bajo = unBajo;
      this.instrumentoActivo = unBajo;

      var unBajoMini = new EscuelaDeExperimentos.ViewInstrumentoMini({
         audioInstrumento: this.audioGraph.instrumentos.bajo,
         superView: this,
         width: widthMinis,
         y: 10,
         x: 1,
         colores: coloresBajo,
         activo: true
      });
      unBajoMini.instrumentoView = unBajo;
      this.subViews.bajoMini = unBajoMini;
      this.instrumentoMiniActivo = unBajoMini;

      // Views Seno 1
      var coloresSeno1 = {
         fondo: '#333333',
         fondoDestacado: '#464646',
         bordes: '#fa6923',
         nota: '#fa6923',
         notaDestacada: '#af410c'
      };

      var unSeno = new EscuelaDeExperimentos.ViewInstrumento({
         audioInstrumento: this.audioGraph.instrumentos.seno1,
         superView: this,
         width: this.width * 0.6,
         x: this.width/2,
         y: this.height/2 + 60,
         colores: coloresSeno1
      });
      this.subViews.seno1 = unSeno;

      var unSenoMini1 = new EscuelaDeExperimentos.ViewInstrumentoMini({
         audioInstrumento: this.audioGraph.instrumentos.seno1,
         superView: this,
         width: widthMinis,
         y: 10,
         x: 1 + widthMinis + marginMinis,
         colores: coloresSeno1
      });
      unSenoMini1.instrumentoView = unSeno;
      this.subViews.senoMini1 = unSenoMini1;

      // Views redoblante
      var coloresRedoblante = {
         fondo: '#333333',
         fondoDestacado: '#464646',
         bordes: '#e63b31',
         nota: '#e63b31',
         notaDestacada: '#932822'
      };

      var unRedoblante = new EscuelaDeExperimentos.ViewInstrumento({
         audioInstrumento: this.audioGraph.instrumentos.redoblante,
         superView: this,
         width: this.width * 0.6,
         x: this.width/2,
         y: this.height/2 + 60,
         colores: coloresRedoblante,
      });
      this.subViews.redoblante = unRedoblante;

      var unRedoblanteMini = new EscuelaDeExperimentos.ViewInstrumentoMini({
         audioInstrumento: this.audioGraph.instrumentos.redoblante,
         superView: this,
         width: widthMinis,
         y: 10,
         x: 1 + 2*(widthMinis + marginMinis),
         colores: coloresRedoblante
      });
      unRedoblanteMini.instrumentoView = unRedoblante;
      this.subViews.redoblanteMini = unRedoblanteMini;

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

   ViewMain.prototype.clickedMini = function(mini){
      if(mini !== this.instrumentoMiniActivo){
         this.instrumentoActivo.esconder();
         this.instrumentoMiniActivo.desactivar();

         this.instrumentoActivo = mini.instrumentoView;
         this.instrumentoMiniActivo = mini;

         mini.activar();
         this.instrumentoActivo.mostrar();
      }
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewMain = ViewMain;
})(this);
