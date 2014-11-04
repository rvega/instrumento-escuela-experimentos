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
    * @param htmlElementId
    * @constructor App
    */
   var App = function(params){
      var p = params || {};
      if(!p.htmlElementId){
         console.error('EscuelaDeExperimentos.App(): Necesito un elemento html donde dibujar.');
         return;
      }
      this.htmlElementId = p.htmlElementId;

      this.audioGraph = new EscuelaDeExperimentos.AudioGraph();
   };
   global.EscuelaDeExperimentos.App = App;
   

   /**
    * Para mezclar un mixin con un objeto.
    * @function mixin
    */
   var mixin = function(elObjeto, elMixin){
      for(var key in elMixin){
         if(elMixin.hasOwnProperty(key) && !elObjeto[key]){
            elObjeto[key] = elMixin[key];
         }
      }
   }
   global.EscuelaDeExperimentos.mixin = mixin;
   

})(this);
