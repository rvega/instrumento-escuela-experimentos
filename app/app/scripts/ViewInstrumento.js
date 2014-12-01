/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor ViewInstrumento
    */
   var ViewInstrumento = function(params){
      var p = params || {};

      /** 
       * @member visible
       */
      this.visible = p.visible || false;

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
       * Es posible tener varias notas activas en una columna?
       * @member polifonico
       */
      this.polifonico = p.polifonico || false;


      /** 
       * @member rueda
       */
      this.rueda = new EscuelaDeExperimentos.ViewRueda({
         interactivo: true,
         audioInstrumento: this.audioInstrumento,
         superView: this,
         x: this.x,
         y: this.y,
         width: this.width,
         colores: p.colores,
         polifonico: this.polifonico
      });

      if(this.visible){
         this.mostrar(); 
      }
      else{
         this.esconder(); 
      }
   };

   /** 
    * @function mostrar
    * @public
    */
   ViewInstrumento.prototype.mostrar = function(){
      this.visible = true;
      this.rueda.layer.show();
   };

   /** 
    * @function esconder
    * @public
    */
   ViewInstrumento.prototype.esconder = function(){
      this.visible = false;
      this.rueda.layer.hide();
   };

   /** 
    * @function update
    * @public
    */
   ViewInstrumento.prototype.update = function(tiempoAudio){
      var i = this.audioInstrumento;
      var paso = i.getPasoActual(tiempoAudio);
      if(this.visible){
         this.rueda.destacarColumna(paso);
      }
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewInstrumento = ViewInstrumento;
})(this);
