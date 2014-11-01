/** 
 * This file defines a constructor (class) for AppController. 
 * It "requires" the Monkey class so we use the global directive
 * to let jsHint know it's defined elewhere.
 */

/* global Monkey */

(function(global){
   'use strict';
   
   var AppController = function(params){
      var p = params || {};

      this.someParam = p.someParam || 'defaultValue';

      this.monkey = new Monkey();
      this.monkeyBlonde = new Monkey({hairColor:'Yellow'});
   };

   AppController.prototype.init = function(){
      this.monkey.talk();
      this.monkeyBlonde.talk();
   };

   global.AppController = AppController;
})(this);
