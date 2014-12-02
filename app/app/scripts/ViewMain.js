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
      this.controles = new EscuelaDeExperimentos.ViewControles({
         audioGraph: this.audioGraph,
         superView: this
      });

      var instrumentos = this.audioGraph.instrumentos;
      this.crearInstrumentoView({
         i:0, 
         nombreInstancia: 'bateria', 
         audioInstrumento: instrumentos.bateria, 
         activo:true,
         polifonico: true,
         cuantasNotasMini: 5,
         colores:{
            fondo: '#333333',
            fondoCardinal: '#262626',
            fondoDestacado: '#464646',
            bordes: '#e6aa1c',
            nota: '#e6aa1c',
            notaDestacada: '#9e7513'
         }
      });
      this.crearInstrumentoView({
         i:1, 
         nombreInstancia: 'bajo', 
         audioInstrumento: instrumentos.bajo, 
         cuantasNotasMini: 3,
         colores:{
            fondo: '#333333',
            fondoCardinal: '#262626',
            fondoDestacado: '#464646',
            bordes: '#e63b31',
            nota: '#e63b31',
            notaDestacada: '#932822'
         }
      });

      this.crearInstrumentoView({
         i:2, 
         nombreInstancia: 'armonico1', 
         audioInstrumento: instrumentos.armonico1, 
         cuantasNotasMini: 3,
         colores:{
            fondo: '#333333',
            fondoCardinal: '#262626',
            fondoDestacado: '#464646',
            bordes: '#fa6923',
            nota: '#fa6923',
            notaDestacada: '#af410c'
         }
      });


      this.crearInstrumentoView({
         i:3, 
         nombreInstancia: 'armonico2', 
         audioInstrumento: instrumentos.armonico2, 
         cuantasNotasMini: 3,
         colores:{
            fondo: '#333333',
            fondoCardinal: '#262626',
            fondoDestacado: '#464646',
            bordes: '#7fa51e',
            nota: '#7fa51e',
            notaDestacada: '#577115'
         }
      });

      this.crearInstrumentoView({
         i:4, 
         nombreInstancia: 'armonico3', 
         audioInstrumento: instrumentos.armonico3, 
         cuantasNotasMini: 3,
         colores:{
            fondo: '#333333',
            fondoCardinal: '#262626',
            fondoDestacado: '#464646',
            bordes: '#08b3a0',
            nota: '#08b3a0',
            notaDestacada: '#057b63'
         }
      });

      this.crearInstrumentoView({
         i:5, 
         nombreInstancia: 'chime', 
         audioInstrumento: instrumentos.chime, 
         cuantasNotasMini: 3,
         colores:{
            fondo: '#333333',
            fondoCardinal: '#262626',
            fondoDestacado: '#464646',
            bordes: '#0ba6e6',
            nota: '#08a6e6',
            notaDestacada: '#08729e'
         }
      });

      this.crearInstrumentoView({
         i:6, 
         nombreInstancia: 'lead', 
         audioInstrumento: instrumentos.lead, 
         cuantasNotasMini: 3,
         colores:{
            fondo: '#333333',
            fondoCardinal: '#262626',
            fondoDestacado: '#464646',
            bordes: '#cc89fd',
            nota: '#cc89fd',
            notaDestacada: '#0c5eae'
         }
      });

      // Update manualmente la primera vez
      this.update();
   };

   ViewMain.prototype.crearInstrumentoView = function(p){
      var i = p.i;
      var nombreInstancia = p.nombreInstancia;
      var audioInstrumento = p.audioInstrumento;
      var colores = p.colores;
      var activo = p.activo;
      var polifonico = p.polifonico;
      var cuantasNotasMini = p.cuantasNotasMini;

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
         activo: activo,
         cuantasNotas: cuantasNotasMini
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
