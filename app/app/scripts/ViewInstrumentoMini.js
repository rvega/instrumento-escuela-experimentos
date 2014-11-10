/* global Kinetic */

(function(global){
   'use strict';

   /** 
    * @constructor ViewInstrumentoMini
    */
   var ViewInstrumentoMini = function(params){
      var p = params || {};

      /** 
       * @member superView
       * @private
       */
      this.superView = p.superView;

      /** 
       * @member width
       * @private
       */
      this.width = p.width || this.superView.width;

      /** 
       * @member x
       * @private
       */
      this.x = p.x || 0;

      /** 
       * @member y
       * @private
       */
      this.y = p.y || 0;


      /** 
       * @member audioinstrumento
       * @private
       */
      this.audioInstrumento = p.audioInstrumento;

      this.dibujar();
   };


   /** 
    * @function dibujar
    * @private
    */
   ViewInstrumentoMini.prototype.dibujar = function(){
      var stage = this.superView.stage;
      var layer = new Kinetic.Layer();
      var w = this.width;

      var border = new Kinetic.Rect({
         width: w,
         height: w,
         x: this.x,
         y: this.y,
         strokeWidth: 2,
         stroke: '#575757',
         fill: '#464646',
         cornerRadius: 2
      });

      layer.add(border);
      stage.add(layer);



      // var b = new Kinetic.Line({
      //    fill:'white',
      //    stroke: 'red',
      //    strokeWidth: 1,
      //    closed: true,
      //    points: [p1.x, p1.y, 
      //       p2.x, p2.y, 
      //       p3.x, p3.y,  
      //       p4.x, p4.y, 
      //       p5.x, p5.y,  
      //       p6.x, p6.y, 
      //       p7.x, p7.y,  
      //       p8.x, p8.y, 
      //       p9.x, p9.y,  
      //       p10.x, p10.y]
      // });
      // layer.add(b);
      // stage.add(layer);
   };

   /** 
    * @function update
    * @public
    */
   ViewInstrumentoMini.prototype.update = function(tiempoAudio){
   
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewInstrumentoMini = ViewInstrumentoMini;
})(this);
