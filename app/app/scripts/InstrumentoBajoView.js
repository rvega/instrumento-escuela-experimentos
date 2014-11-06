/* global PIXI */

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

      /** 
       * Cada elemento de este array es una "columna" o "radio" de botones 
       * @member botones
       * @private
       */
      this.botones = [];

      this.dibujar();
   };

   /** 
    * @function clickBoton
    * @private
    */
   InstrumentoBajoView.prototype.clickBoton = function(e){
      // console.log(e.target.columna + ' ' + e.target.fila);
      e.target.tint = 0x333333;
   };

   /** 
    * @function hoverBoton
    * @private
    */
   InstrumentoBajoView.prototype.hoverBoton = function(e){
      // debugger;
      // e.target.tint = 0x333333;
   };

   /** 
    * Convierte coordenadas polares (con centro en la mitad de esta vista)(
    * a cartesianas.
    * @function polar2cart
    * @private
    */
   InstrumentoBajoView.prototype.polar2cart = function(angulo, radio){
      var w = this.superView.ancho;
      angulo -= 90; // cero grados al norte
      angulo *= -1; // rotación hacia la derecha
      var x = w/2 + radio*Math.cos(angulo*Math.PI/180);
      var y = w/2 - radio*Math.sin(angulo*Math.PI/180);
      return new PIXI.Point(x, y);
   };

   /** 
    * @function dibujar
    * @private
    */
   InstrumentoBajoView.prototype.dibujar = function(){
      var stage = this.superView.stage;
      var w = this.superView.ancho;

      // Magnitudes botones en radio
      var cuantosBotonesPorRadio = 10;
      var radioOffset = w/10;
      var espacioBotonRadio = (w/2-radioOffset)/cuantosBotonesPorRadio;
      console.log(espacioBotonRadio);
      var tamanoBotonRadio = 0.80*espacioBotonRadio;

      // Magnitudes botones en angulo
      var cuantosBotonesPorVuelta = 16;
      var espacioBotonAngulo = 360/cuantosBotonesPorVuelta;
      var tamanoBotonAngulo = 0.9*espacioBotonAngulo;

      // var radio=0;
      for(var radio=0; radio<cuantosBotonesPorRadio; radio++) {
         var columna = [];
         for(var angulo=0; angulo<cuantosBotonesPorVuelta; angulo++) {
            var r = radio*espacioBotonRadio;
            var a = angulo*espacioBotonAngulo;

            var p1 = this.polar2cart(a-tamanoBotonAngulo/2, 
                     radioOffset + r + tamanoBotonRadio);

            var p2 = this.polar2cart(a-tamanoBotonAngulo/4, 
                     radioOffset + r + tamanoBotonRadio);

            var p3 = this.polar2cart(a, 
                     radioOffset + r + tamanoBotonRadio);

            var p4 = this.polar2cart(a+tamanoBotonAngulo/4, 
                     radioOffset + r + tamanoBotonRadio);

            var p5 = this.polar2cart(a+tamanoBotonAngulo/2, 
                     radioOffset + r + tamanoBotonRadio);

            var p6 = this.polar2cart(a+tamanoBotonAngulo/2, 
                     radioOffset + r);

            var p7 = this.polar2cart(a+tamanoBotonAngulo/4, 
                     radioOffset + r);

            var p8 = this.polar2cart(a, 
                     radioOffset + r);

            var p9 = this.polar2cart(a-tamanoBotonAngulo/4, 
                     radioOffset + r);

            var p10 = this.polar2cart(a-tamanoBotonAngulo/2, 
                         radioOffset + r);

            var b = new PIXI.Graphics();
            b.beginFill(0xFFFFFF, 1);
            b.lineStyle(1, 0xFF0000, 1);
            b.drawPolygon([p1,p2,p3,p4,p5,p6,p7,p8,p9,p10]);
            b.endFill();
         
            b.columna = radio;
            b.fila = angulo;

            b.interactive = true;
            b.buttonMode = true;
            b.mouseup = b.touchstart = this.clickBoton.bind(this);
            b.mouseover = this.hoverBoton.bind(this);

            stage.addChild(b);

            columna.push(b);
         }
         this.botones.push(columna);
      }
   };

   InstrumentoBajoView.prototype.update = function(tiempoAudio){
      // console.debug(tiempoAudio);
      // console.debug('update bajo');
      // this.rect.position.x ++;
      // this.rect.tint = 0x333333;
      // console.log(this.rect.tint);
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.InstrumentoBajoView = InstrumentoBajoView;
})(this);
