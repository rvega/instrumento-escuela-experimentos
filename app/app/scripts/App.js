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
         console.error('EscuelaDeExperimentos.App(): Necesito un elemento html donde dibujar.');
         return;
      }

      this.audioGraph = new EscuelaDeExperimentos.AudioGraph();
      this.mainView = new EscuelaDeExperimentos.MainView({
         audioGraph: this.audioGraph,
         htmlContainer: p.htmlContainer
      });
   };
   global.EscuelaDeExperimentos.App = App;
})(this);
