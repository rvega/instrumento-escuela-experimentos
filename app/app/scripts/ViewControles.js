/* global EscuelaDeExperimentos */

(function(global){
   'use strict';

   /** 
    * @constructor ViewControles
    */
   var ViewControles = function(params){
      var p = params || {};

      /** 
       * @member superView
       * @private
       */
      this.superView = p.superView;

      /** 
       * @member audioGraph
       * @private
       */
      this.audioGraph = p.audioGraph;

      this.dibujar();
   };

   ViewControles.prototype.template = [
      '<div id="controles">',
         '<button class="boton" id="stop" type="button"><img src="{{PATH}}/styles/img/stop.png"/></button>',
         '<button class="boton" id="play" type="button"><img src="{{PATH}}/styles/img/play.png"/></button>',
         '<img id="tempo-icon" src="{{PATH}}/styles/img/tempo.png"><div id="knob-tempo"></div>',
      '</div>'
   ].join('\n');

   /** 
    * @function dibujar
    * @private
    */
   ViewControles.prototype.dibujar = function(){
      var container = document.getElementById(this.superView.htmlContainer);
      var html = this.template.replace(/{{PATH}}/g, this.audioGraph.app.path);
      $(container).prepend(html);

      this.knobTempo = new EscuelaDeExperimentos.ViewKnob({
         htmlContainer: 'knob-tempo',
         changedCallback: this.tempoChange.bind(this),
         minValue: 60*4,
         maxValue: 180*4,
         value: 120*4,
         step: 1,
         path: this.audioGraph.app.path,
         valueFormat: function(val){
            return Math.round(val/4);
         }
      });

      $('#play').on('mouseup touchdown', this.play.bind(this));
      $('#stop').on('mouseup touchdown', this.stop.bind(this));
   };

   ViewControles.prototype.play = function(){
      this.audioGraph.play();
   };

   ViewControles.prototype.stop = function(){
      this.audioGraph.stop();
   };

   ViewControles.prototype.tempoChange = function(value){
      this.audioGraph.tempo = value;
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewControles = ViewControles;
})(this);
