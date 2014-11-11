/* global Kinetic */

(function(global){
   'use strict';

   /** 
    * @constructor ViewRueda
    */
   var ViewRueda = function(params){
      var p = params || {};

      /** 
       * @member colores
       */
      this.colores = p.colores || this.coloresDefault;

      /** 
       * @member superView
       */
      this.superView = p.superView;

      /** 
       * Responder a eventos de mouse y touch (true) o solo dibujar (false)
       * @member interactivo
       */
      this.interactivo = p.interactivo || false;

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
       * @member cuantasNotas
       */
      this.cuantasNotas = p.cuantasNotas || this.audioInstrumento.cuantasNotas;

      /** 
       * @member cuantosTiempos
       */
      this.cuantosTiempos = p.cuantosTiempos || this.audioInstrumento.cuantosTiempos;

      /** 
       * Cada elemento de este array es una "columna" o "radio" de botones 
       * @member botones
       */
      this.botones = [];

      /** 
       * @member columnaDestacada
       */
      this.columnaDestacada = 0;

      this.layer = null;

      this.dibujar();

      if(this.interactivo){
         this.destacarColumna(0, true);
      }
   };

   ViewRueda.prototype.coloresDefault = {
      bordes: '#fa6923',
      fondo: '#333333',
      fondoDestacado: '#464646',
      notaDestacada: '#fa6923',
      nota: '#af410c'
   };

   ViewRueda.prototype.mouseover = function(e){
      var btn = e.target;
      btn.fill(this.colores.fondoDestacado);
      btn.draw();
      document.body.style.cursor = 'pointer';
   };

   ViewRueda.prototype.mouseout = function(e){
      var btn = e.target;
      if(btn.activo){
         btn.fill(this.colores.nota);
      }
      else{
         btn.fill(this.colores.fondo);
      }
      btn.draw();
      document.body.style.cursor = 'default';
   };

   /** 
    * @function clickBoton
    */
   ViewRueda.prototype.clickBoton = function(e){
      var btn = e.target;

      // Desactivar otros botones de esta columna
      var col = this.botones[btn.columna];
      for(var i=0; i<col.length; i++){
         var otroBtn = col[i]; 
         if(otroBtn !== btn && otroBtn.activo){
            otroBtn.activo = false;
            otroBtn.fill(this.colores.fondo);
            otroBtn.draw();
            break;
         }
      }

      // (des)activar este boton
      if(!btn.activo){
         btn.activo = true;
         btn.fill(this.colores.nota);
         this.audioInstrumento.secuencia[btn.columna] = btn.fila;
      }
      else{
         btn.activo = false;
         btn.fill(this.colores.fondo);
         this.audioInstrumento.secuencia[btn.columna] = -1;
      }
      btn.draw();
   };

   /** 
    * Convierte coordenadas polares (con centro en la mitad de esta vista)(
    * a cartesianas.
    * @function polar2cart
    */
   ViewRueda.prototype.polar2cart = function(angulo, radio){
      angulo -= 90; // cero grados al norte
      angulo *= -1; // rotación hacia la derecha
      var x = this.x + radio*Math.cos(angulo*Math.PI/180);
      var y = this.y - radio*Math.sin(angulo*Math.PI/180);
      return {x:x, y:y};
   };

   /** 
    * @function dibujar
    */
   ViewRueda.prototype.dibujar= function(){
      var stage = this.superView.superView.stage;
      this.layer = new Kinetic.Layer({
         listening: this.interactivo
      });
      var w = this.width;

      // Magnitudes botones en radio
      var cuantosBotonesPorRadio = this.cuantasNotas;
      var radioOffset = w/10;
      var espacioBotonRadio = (w/2-radioOffset)/cuantosBotonesPorRadio;
      var tamanoBotonRadio = 0.80*espacioBotonRadio;

      // Magnitudes botones en angulo
      var cuantosBotonesPorVuelta = this.cuantosTiempos;
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
               fill: this.colores.fondo,
               stroke: this.colores.bordes,
               strokeWidth: this.width>100 ? 2 : 1,
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
            if(this.interactivo){
               b.on('mousedown', this.clickBoton.bind(this));
               b.on('mouseover', this.mouseover.bind(this));
               b.on('mouseout', this.mouseout.bind(this));
            }
            this.layer.add(b);
            columna.push(b);
         }
         this.botones.push(columna);
      }
      stage.add(this.layer);
   };

   /** 
    * @function destacarColumna
    */
   ViewRueda.prototype.destacarColumna = function(cualColumna){
      if(cualColumna !== this.columnaDestacada){
         this._destacarColumna(this.columnaDestacada, false);
         this._destacarColumna(cualColumna, true);

         this.columnaDestacada = cualColumna;
      }
   };
                                                  
   ViewRueda.prototype._destacarColumna = function(cualColumna, bool){
      var columna = this.botones[cualColumna];
      var len = columna.length;
      for(var i=0; i<len; i++){
         var boton = columna[i];
         if(boton.activo && bool===true){
            boton.fill(this.colores.notaDestacada);
         }
         else if(!boton.activo && bool===true){
            boton.fill(this.colores.fondoDestacado);
         }
         else if(boton.activo && !bool){
            boton.fill(this.colores.nota);
         }
         else{
            boton.fill(this.colores.fondo);
         }
         boton.draw();
      }
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewRueda = ViewRueda;
})(this);
