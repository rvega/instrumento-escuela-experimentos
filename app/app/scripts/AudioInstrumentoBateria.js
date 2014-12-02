/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor AudioInstrumentoBateria
    */
   var AudioInstrumentoBateria = function(params){
      var p = params || {};

      /**
       * "Registro" del instrumento
       * @member cuantasNotas
       */
      this.cuantasNotas = p.cuantasNotas || 12;

      /**
       * Longitud de la secuencia 
       * @member cuantosTiempos
       */
      this.cuantosTiempos = p.cuantosTiempos || 16;

      /** 
       * La gráfica que contiene a este instrumento
       * @member audioGraph
       * @private
       */
      this.audioGraph = p.audioGraph;

      /** 
       * Cada voz es un instrumento monofonico
       * @member voces
       * @private
       */
      this.voces = [];

      /**
       * @member volumen
       */
      this.volumen = p.volumen || 1.0;

      var voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'kick',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'snare',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'hh-closed',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'hh-open',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'crash',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'tom1',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'tom2',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'tom3',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'clap',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'guiro',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'shaker',
         volumen: p.volumen
      });
      this.voces.push(voz);

      voz = new EscuelaDeExperimentos.AudioInstrumentoSample({
         audioGraph: this.audioGraph,
         cuantasNotas: 1,
         cuantosTiempos: 16,
         wave: 'tambourine',
         volumen: p.volumen
      });
      this.voces.push(voz);


   };
   
   /** 
    * Cambia una nota de la secuencia
    * @public
    * @method setNotaSecuencia
    */
   AudioInstrumentoBateria.prototype.setNotaSecuencia = function(columna, fila, nota){
      // En realidad no guardamos el estado de la secuencia sino que establecemos
      // la secuencia de cada voz.
      this.voces[fila].setNotaSecuencia(columna, nota);
   };

   /** 
    * Programa (schedule) las notas próximas a sonar. Ver explicación aqui:
    * http://www.html5rocks.com/en/tutorials/audio/scheduling/#toc-rocksolid
    * @public
    * @method programarNotas
    */
   AudioInstrumentoBateria.prototype.programarNotas = function(tiempoAudio, tiempoInicial){
      for(var i in this.voces){
         var voz = this.voces[i];
         voz.programarNotas(tiempoAudio, tiempoInicial);
      }
   };

   /** 
    * Devuelve el paso que está sonando (o en silencio) en este momento 
    * @public
    * @method getPasoActual
    */
   AudioInstrumentoBateria.prototype.getPasoActual = function(tiempo){
      var paso;
      for(var i in this.voces){
         paso = this.voces[i].getPasoActual(tiempo);
      }
      return paso;
   };

   /** 
    * Devuelve el gain actual del instrumento. Para que los views dibujen
    * cosas 
    * @public
    * @method getGain
    */
   AudioInstrumentoBateria.prototype.getGain = function(tiempo){
      var suma = 0;
      for(var i in this.voces){
         var voz = this.voces[i];
         suma += 2*voz.getGain(tiempo);
      }

      suma = suma/this.voces.length;
      return suma>1 ? 1 : suma;
   };

   AudioInstrumentoBateria.prototype.getSecuencia = function(){
      var sec = [];
      for(var i in this.voces){
         var voz = this.voces[i];
         sec.push(voz.getSecuencia());
      }
      return sec;
   };

   /** 
    * Conecta la salida de este instrumento a otro nodo en la gráfica de audio
    * @public
    * @method
    */
   AudioInstrumentoBateria.prototype.conectar = function(nodo){
      for(var i in this.voces){
         var voz = this.voces[i];
         voz.conectar(nodo);
      }
   };

   /** 
    * stopla salida de este instrumento a otro nodo en la gráfica de audio
    * @public
    * @method stop
    */
   AudioInstrumentoBateria.prototype.stop = function(){
      // nada
   };

   /** 
    * @public
    * @method
    */
   AudioInstrumentoBateria.prototype.resetTiempo = function(){
      for(var i in this.voces){
         var voz = this.voces[i];
         voz.resetTiempo();
      }
   };
   
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.AudioInstrumentoBateria = AudioInstrumentoBateria;
})(this);
