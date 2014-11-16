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

      var instrumentos = this.audioGraph.instrumentos;
      this.crearInstrumentoView( 0, 'bajo', instrumentos.bajo, {
         fondo: '#333333',
         fondoDestacado: '#464646',
         bordes: '#e63b31',
         nota: '#e63b31',
         notaDestacada: '#932822'
      }, true);

      this.crearInstrumentoView( 1, 'seno1', instrumentos.seno1, {
         fondo: '#333333',
         fondoDestacado: '#464646',
         bordes: '#fa6923',
         nota: '#fa6923',
         notaDestacada: '#af410c'
      });

      this.crearInstrumentoView( 2, 'bateria', instrumentos.bateria, {
         fondo: '#333333',
         fondoDestacado: '#464646',
         bordes: '#e63b31',
         nota: '#e63b31',
         notaDestacada: '#932822'
      }, false, true);

      // this.crearInstrumentoView( 2, 'redoblante', instrumentos.redoblante, {
      //    fondo: '#333333',
      //    fondoDestacado: '#464646',
      //    bordes: '#e63b31',
      //    nota: '#e63b31',
      //    notaDestacada: '#932822'
      // }, false, true);

      // this.crearInstrumentoView( 3, 'bombo', instrumentos.bombo, {
      //    fondo: '#333333',
      //    fondoDestacado: '#464646',
      //    bordes: '#e63b31',
      //    nota: '#e63b31',
      //    notaDestacada: '#932822'
      // });

      // this.crearInstrumentoView( 4, 'hhCerrado', instrumentos.hhCerrado, {
      //    fondo: '#333333',
      //    fondoDestacado: '#464646',
      //    bordes: '#e63b31',
      //    nota: '#e63b31',
      //    notaDestacada: '#932822'
      // });

      // this.crearInstrumentoView( 5, 'hhAbierto', instrumentos.hhAbierto, {
      //    fondo: '#333333',
      //    fondoDestacado: '#464646',
      //    bordes: '#e63b31',
      //    nota: '#e63b31',
      //    notaDestacada: '#932822'
      // });

      // Update manualmente la primera vez
      this.update();
   };

   ViewMain.prototype.crearInstrumentoView = function(i, nombreInstancia, audioInstrumento, colores, activo, polifonico){
      activo = !!activo;

      var unViewInstrumento = new EscuelaDeExperimentos.ViewInstrumento({
         audioInstrumento: audioInstrumento,
         superView: this,
         width: this.width * 0.6,
         x: this.width/2,
         y: this.height/2 + 60,
         colores: colores,
         visible: activo,
         polifonico: polifonico
      });
      this.subViews[nombreInstancia] = unViewInstrumento;

      var unViewInstrumentoMini = new EscuelaDeExperimentos.ViewInstrumentoMini({
         audioInstrumento: audioInstrumento,
         superView: this,
         width: this.width/8,
         y: 10,
         x: 1 + i*(this.width/8 + 13),
         colores: colores,
         activo: activo
      });
      unViewInstrumentoMini.instrumentoView = unViewInstrumento;
      this.subViews[nombreInstancia + 'Mini'] = unViewInstrumentoMini;

      if(activo===true){
         this.instrumentoMiniActivo = unViewInstrumentoMini;
         this.instrumentoActivo = unViewInstrumento;
      }
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
