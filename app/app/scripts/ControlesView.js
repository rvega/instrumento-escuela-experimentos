
(function(global){
   'use strict';

   /** 
    * @constructor ControlesView
    */
   var ControlesView = function(params){
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

   ControlesView.prototype.template = [
      '<div id="controles">',
         '<button class="boton" id="stop" type="button"><img src="styles/img/stop.png"/></button>',
         '<button class="boton" id="play" type="button"><img src="styles/img/play.png"/></button>',
         '<img id="tempo-icon" src="styles/img/tempo.png"><div id="knob-tempo"></div>',
      '</div>'
   ].join('\n');

   /** 
    * @function dibujar
    * @private
    */
   ControlesView.prototype.dibujar = function(){
      var container = document.getElementById(this.superView.htmlContainer);
      $(container).prepend(this.template);

      var tempoKnob = new EscuelaDeExperimentos.Knob({
         htmlContainer: 'knob-tempo',
         changedCallback: this.tempoChange.bind(this),
         minValue: 60,
         maxValue: 240,
         value: 120,
         step: 1
      });
   };

   ControlesView.prototype.tempoChange = function(value, normalValue){
      this.audioGraph.tempo = value;
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ControlesView = ControlesView;
})(this);
