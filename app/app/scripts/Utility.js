
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

   /**
    * Devuelve una copia poco profunda (shallow) de un objeto
    * @function clone
    */
   Utility.clone = function(objeto){
      var clon = {};
      for(var propiedad in objeto){
         if(objeto.hasOwnProperty(propiedad)){
            clon[propiedad] = objeto[propiedad];
         }
      }

      return clon;
   };

   /**
    * Interpola dos colores con un indice entre 0 y 1
    * @function interpolarColores
    */
   Utility.interpolarColores = function(minColor,maxColor,indice){
      function d2h(d) {return d.toString(16);}
      function h2d(h) {return parseInt(h,16);}

      if(indice === 0){
         return minColor;
      }
      if(indice === 1){
         return maxColor;
      }

      var color = '#';

      for(var i=1; i <= 6; i+=2){
         var minVal = Number(h2d(minColor.substr(i,2)));
         var maxVal = Number(h2d(maxColor.substr(i,2)));
         var nVal = minVal + (maxVal-minVal) * indice;
         var val = d2h(Math.floor(nVal));
         while(val.length < 2){
            val = '0'+val;
         }
         color += val;
      }
      return color;
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.Utility = Utility;
})(this);
