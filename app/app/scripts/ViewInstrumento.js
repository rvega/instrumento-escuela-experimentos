/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor ViewInstrumento
    */
   var ViewInstrumento = function(params){
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
       * @member rueda
       */
      this.rueda = new EscuelaDeExperimentos.ViewRueda({
         interactivo: true,
         audioInstrumento: this.audioInstrumento,
         superView: this,
         x: this.x,
         y: this.y,
         width: this.width
      });
   };


   /** 
    * @function update
    * @public
    */
   ViewInstrumento.prototype.update = function(tiempoAudio){
      // TODO: arreglar, no puede depender de bpm.
      var i = this.audioInstrumento;
      var paso = i.getPasoActual(tiempoAudio);
      this.rueda.destacarColumna(paso);
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewInstrumento = ViewInstrumento;
})(this);
