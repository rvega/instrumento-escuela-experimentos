(function(global){
   'use strict';

   /** 
    * The Monkey Constructor
    * @constructor
    */
   var Monkey = function(params){
      var p = params || {};

      /** 
       * Here's a public member variable
       * @member
       * @public
       */
      this.hairColor = p.hairColor || 'brown';

      /** 
       * Here's a private one. (Don't use, access gets weird from member
       * functions, commenting out)
       * @member
       * @private
       */
      // var age = p.age || 10;


      /** 
       * A private method (Don't use either, it's too weird to use, 
       * commenting out)
       * @private
       * @method
       */
      // var think = function(){
      //    console.log('Hmm... what should I say?');
      // };
   };

   /** 
    * Monkeys do talk!
    * @public
    * @method
    */
   Monkey.prototype.talk = function(){
      // this.think();  // No access.
      // think();  // No access.

      console.log('Here\'s a talking monkey');

      console.log('My hair is ' + this.hairColor);
      
      // Accessing static variables:
      console.log('I\'m a ' + Monkey.prototype.type);
   };

   /**
    * Here's a static member variable
    * @member
    * @static
    */
   Monkey.prototype.type = 'mammal';
   
   global.Monkey = Monkey;
})(this);
