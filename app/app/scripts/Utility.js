
(function(global){
   'use strict';

   var Utility = {};

   /**
    * Mezcla un mixin con un objeto.
    * @function mixin
    */
   Utility.mixin = function(elObjeto, elMixin){
      for(var key in elMixin){
         if(elMixin.hasOwnProperty(key)){
            elObjeto[key] = elMixin[key];
         }
      }
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.Utility = Utility;
})(this);
