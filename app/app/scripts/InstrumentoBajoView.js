/* global Kinetic */

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
      this.audioInstrumento = p.audioInstrumento;

      /** 
       * Cada elemento de este array es una "columna" o "radio" de botones 
       * @member botones
       * @private
       */
      this.botones = [];

      /** 
       * @member columnaDestacada
       * @private
       */
      this.columnaDestacada = 0;

      this.dibujar();
      this.destacarColumna(0, true);
   };

   /** 
    * @function clickBoton
    * @private
    */
   InstrumentoBajoView.prototype.clickBoton = function(e){
      var btn = e.target;

      // Desactivar otros botones de esta columna
      var col = this.botones[btn.columna];
      for(var i=0; i<col.length; i++){
         var otroBtn = col[i]; 
         if(otroBtn !== btn && otroBtn.activo){
            otroBtn.activo = false;
            otroBtn.fill('#FFFFFF');
            otroBtn.draw();
            break;
         }
      }

      // (des)activar este boton
      if(!btn.activo){
         btn.fill('#333333');
         btn.activo = true;
         this.audioInstrumento.secuencia[btn.columna] = btn.fila;
      }
      else{
         btn.fill('#FFFFFF');
         btn.activo = false;
         this.audioInstrumento.secuencia[btn.columna] = -1;
      }
      btn.draw();
   };

   /** 
    * Convierte coordenadas polares (con centro en la mitad de esta vista)(
    * a cartesianas.
    * @function polar2cart
    * @private
    */
   InstrumentoBajoView.prototype.polar2cart = function(angulo, radio){
      var w = this.superView.width;
      angulo -= 90; // cero grados al norte
      angulo *= -1; // rotación hacia la derecha
      var x = w/2 + radio*Math.cos(angulo*Math.PI/180);
      var y = w/2 - radio*Math.sin(angulo*Math.PI/180);
      return {x:x, y:y};
   };

   /** 
    * @function dibujar
    * @private
    */
   InstrumentoBajoView.prototype.dibujar = function(){
      var stage = this.superView.stage;
      var layer = new Kinetic.Layer();
      var w = this.superView.width;

      // Magnitudes botones en radio
      var cuantosBotonesPorRadio = this.audioInstrumento.notas.length;
      var radioOffset = w/10;
      var espacioBotonRadio = (w/2-radioOffset)/cuantosBotonesPorRadio;
      var tamanoBotonRadio = 0.80*espacioBotonRadio;

      // Magnitudes botones en angulo
      var cuantosBotonesPorVuelta = this.audioInstrumento.secuencia.length;
      var espacioBotonAngulo = 360/cuantosBotonesPorVuelta;
      var tamanoBotonAngulo = 0.9*espacioBotonAngulo;

      for(var angulo=0; angulo<cuantosBotonesPorVuelta; angulo++) {
         var columna = [];
         for(var radio=0; radio<cuantosBotonesPorRadio; radio++) {
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

            var b = new Kinetic.Line({
               fill:'white',
               stroke: 'red',
               strokeWidth: 1,
               closed: true,
               points: [p1.x, p1.y, 
                  p2.x, p2.y, 
                  p3.x, p3.y,  
                  p4.x, p4.y, 
                  p5.x, p5.y,  
                  p6.x, p6.y, 
                  p7.x, p7.y,  
                  p8.x, p8.y, 
                  p9.x, p9.y,  
                  p10.x, p10.y]
            });
         
            b.columna = angulo;
            b.fila = radio;
            b.activo = false;
            b.on('mousedown', this.clickBoton.bind(this));
            layer.add(b);
            columna.push(b);
         }
         this.botones.push(columna);
      }
      stage.add(layer);
   };

   /** 
    * @function destacarColumna
    * @private
    */
   InstrumentoBajoView.prototype.destacarColumna = function(cualColumna, bool){
      var columna = this.botones[cualColumna];
      var len = columna.length;
      for(var i=0; i<len; i++){
         var boton = columna[i];
         if(boton.activo && bool===true){
            boton.fill('#553333');
         }
         else if(!boton.activo && bool===true){
            boton.fill('#FF0000');
         }
         else if(boton.activo && !bool){
            boton.fill('#333333');
         }
         else{
            boton.fill('#FFFFFF');
         }
         boton.draw();
      }
   };

   /** 
    * @function update
    * @public
    */
   InstrumentoBajoView.prototype.update = function(tiempoAudio){
      var i = this.audioInstrumento;
      var duracionNota = 60/i.audioGraph.tempo;
      var duracionLoop = duracionNota * i.secuencia.length;
      var tiempo = tiempoAudio % duracionLoop;
      var cualColumna = Math.floor(tiempo/duracionNota);
      if(cualColumna !== this.columnaDestacada){
         this.destacarColumna(this.columnaDestacada, false);
         this.destacarColumna(cualColumna, true);

         this.columnaDestacada = cualColumna;
      }
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.InstrumentoBajoView = InstrumentoBajoView;
})(this);
