/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor InstrumentoBajoView
    */
   var InstrumentoBajoView = function(params){
      var p = params || {};

      /** 
       * @member superView
       * @private
       */
      this.superView = p.superView;


      /** 
       * @member audioinstrumento
       * @private
       */
      this.audioinstrumento = p.audioinstrumento;

      var stage = this.superView.stage;
      var d = new PIXI.Graphics();
      d.beginFill(0xFFFFFF, 1);
      d.tint = 0xDDDDDD;
      d.drawRoundedRect(10,10,50,50,6);
      d.endFill();
      stage.addChild(d);
      this.rect = d;
   };

   InstrumentoBajoView.prototype.update = function(tiempoAudio){
      // console.debug('update bajo');
      // this.rect.position.x ++;
      this.rect.tint = 0x333333;
      // console.log(this.rect.tint);
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.InstrumentoBajoView = InstrumentoBajoView;
})(this);
