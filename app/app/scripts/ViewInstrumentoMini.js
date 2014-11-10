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

      /** 
       * Subview.
       * @member border
       */
      this.border = null;

      this.dibujar();

      /** 
       * @member rueda
       */
      p.colores.fondo = '#464646';
      this.rueda = new EscuelaDeExperimentos.ViewRueda({
         interactivo: false,
         audioInstrumento: this.audioInstrumento,
         superView: this,
         x: this.x + this.width/2,
         y: this.y + this.width/2,
         width: this.width*0.85,
         cuantasNotas: 5,
         cuantosTiempos: 8,
         colores: p.colores
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
         stroke: '#575757',
         fill: '#464646',
         cornerRadius: 2
      });

      layer.add(this.border);
      stage.add(layer);
   };



   /** 
    * @function update
    * @public
    */
   ViewInstrumentoMini.prototype.update = function(tiempoAudio){
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

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewInstrumentoMini = ViewInstrumentoMini;
})(this);
