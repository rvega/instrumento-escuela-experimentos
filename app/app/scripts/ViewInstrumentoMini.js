/* global Kinetic */
/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor ViewInstrumentoMini
    */
   var ViewInstrumentoMini = function(params){
      var p = params || {};

      /** 
       * @member superView
       */
      this.superView = p.superView;

      /** 
       * @member width
       */
      this.width = p.width || this.superView.width;

      /** 
       * Posicion x del centro del circulo en coordenadas cartesianas
       * relativo al stage
       * @member x
       */
      this.x = p.x || this.width/2;

      /** 
       * Posicion y del centro del circulo en coordenadas cartesianas
       * relativo al stage
       * @member y
       */
      this.y = p.y || this.width/2;

      /** 
       * @member audioinstrumento
       */
      this.audioInstrumento = p.audioInstrumento;

      /** 
       * @member colores
       */
      this.colores = p.colores || this.superView.coloresDefault;

      this.activo = p.activo || false;

      /** 
       * Subview.
       * @member border
       */
      this.border = null;

      this.mouseEstaEncima = false;

      this.dibujar();

      /** 
       * @member rueda
       */

      var colores = {
         fondo: '#333333',
         fondoDestacado: p.colores.fondoDestacado,
         bordes: p.colores.bordes,
         nota: p.colores.nota,
         notaDestacada: p.colores.notaDestacada
      };

      this.rueda = new EscuelaDeExperimentos.ViewRueda({
         interactivo: false,
         audioInstrumento: this.audioInstrumento,
         superView: this,
         x: this.x + this.width/2,
         y: this.y + this.width/2,
         width: this.width*0.85,
         cuantasNotas: 5,
         cuantosTiempos: 8,
         colores: colores
      });
   };
   


   /** 
    * @function dibujar
    * @private
    */
   ViewInstrumentoMini.prototype.dibujar = function(){
      var stage = this.superView.stage;
      var layer = new Kinetic.Layer();
      var w = this.width;

      this.border = new Kinetic.Rect({
         width: w,
         height: w,
         x: this.x,
         y: this.y,
         strokeWidth: 2,
         stroke: this.activo ? this.colores.bordes : '#575757',
         fill: this.colores.fondo,
         cornerRadius: 4
      });
      this.border.on('mouseover', this.mouseover.bind(this));
      this.border.on('mouseout', this.mouseout.bind(this));
      this.border.on('mousedown', this.click.bind(this));

      layer.add(this.border);
      stage.add(layer);
   };



   /** 
    * @function update
    * @public
    */
   ViewInstrumentoMini.prototype.update = function(tiempoAudio){
      if(this.mouseEstaEncima){
         return;
      }

      var g = this.audioInstrumento.getGain(tiempoAudio);
      var color;
      if(g>0.01){
         color = EscuelaDeExperimentos.Utility.interpolarColores(
            this.colores.fondo, 
            this.colores.bordes, 
            g
         );
      }
      else{
         color = this.colores.fondo;
      }
      this.border.fill(color);
      this.border.draw();
   };

   ViewInstrumentoMini.prototype.activar = function(){
      this.border.stroke(this.colores.bordes);
      this.border.draw();
   };

   ViewInstrumentoMini.prototype.desactivar = function(){
      this.border.stroke('#575757');
      this.border.draw();
   };

   ViewInstrumentoMini.prototype.mouseover = function(){
      this.mouseEstaEncima = true;
      document.body.style.cursor = 'pointer';
      this.border.fill('#575757');
      this.border.draw();
   };

   ViewInstrumentoMini.prototype.mouseout= function(){
      this.mouseEstaEncima = false;
      document.body.style.cursor = 'default';
      this.border.fill('#333333');
      this.border.draw();
   };

   ViewInstrumentoMini.prototype.click= function(){
      this.superView.clickedMini(this);
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewInstrumentoMini = ViewInstrumentoMini;
})(this);
