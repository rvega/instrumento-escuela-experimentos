/* global EscuelaDeExperimentos */

(function(global){
   'use strict';
   
   /** 
    * Todas las clases, mixins, etc. van en este namespace.
    * @namespace EscuelaDeExperimentos
    */
   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};

   /** 
    * Constructor del objeto App que encapsula toda la aplicación.  
    * @constructor App
    */
   var App = function(params){
      var p = params || {};
      if(!p.htmlContainer){
         console.error('EscuelaDeExperimentos.App(): \
                       Necesito un elemento html donde dibujar.');
         return;
      }

      // Ancho default es el ancho "natural" del contenedor en el html.
      var width = p.width || document.getElementById(p.htmlContainer).offsetWidth;
      var height = width*0.75;

      this.audioGraph = new EscuelaDeExperimentos.AudioGraph();
      this.mainView = new EscuelaDeExperimentos.MainView({
         audioGraph: this.audioGraph,
         htmlContainer: p.htmlContainer,
         width: width,
         height: height
      });
   };
   global.EscuelaDeExperimentos.App = App;
})(this);
