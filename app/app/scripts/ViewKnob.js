(function(global){
   'use strict';

   // Angles are measured as:
   //      180
   //       |
   //  90  --- 270
   //       |
   //       0

   /**
    * A knob
    * @constructor ViewKnob
    */
   var ViewKnob = function(params){
      var p = params || {};

      if(!p.htmlContainer){
         throw new Error('ViewKnob: You must provide the id of a DOM element.');
      }
      this.element = $('#'+p.htmlContainer);

      this.changingCallback = p.changingCallback;
      this.changedCallback = p.changedCallback;

      this.minValue = p.minValue || 0;
      this.maxValue = p.maxValue || 1;
      this.pow = p.pow || 1;

      this.step = p.step || null;
      this.speed = p.speed || 2;
      this.width = p.width || '30px';
      this.height = p.height || '30px';
      this.minAngle = p.minAngle || 40;
      this.maxAngle = p.maxAngle || 320;
      this.label = p.label || '';
      this.customFormatValue = p.valueFormat || null;

      this.sprite = p.sprite || 'styles/img/knob.png';
      this.spriteCount =  p.spriteCount || 120;
      this.spriteInitialAngle =  p.spriteInitialAngle || 0;
      this.spriteWidth =  p.spriteWidth || 100;
      this.spriteSeparation =  p.spriteSeparation || 0;
      this.spriteDirection =  p.spriteDirection || 'clockwise';

      this.draw();
      this.initDrag();

      this.setValue(p.value || 0);
   };

   ViewKnob.prototype.destroy = function(){
      this.destroyDrag(); 
      this.element.remove();
   };

   ViewKnob.prototype.draw = function(){
      var html = this.template;
      this.element.html(html);
      this.element.css('width', this.width);
      this.element.css('height', this.width);

      var container = this.element.find('.knob-container');
      container.css('width', this.width);
      container.css('height', this.height);
      container.css('background', 'url("' + this.sprite + '")' );

      this.spriteScale = this.element.width()/this.spriteWidth;
      var bgWidth = (this.spriteWidth + this.spriteSeparation) * this.spriteScale * this.spriteCount;
      container.css('background-size', bgWidth+'px 100%' );

      var lbl = this.element.find('.label');
      if(this.label!==''){
         lbl.html(this.label);
         lbl.show();
      }
      else{
         lbl.hide();
         // this.element.find('.value').css('top', 85);
      }
      
      // debug:
      // this.element.css('border', '1px solid black');
   };

   ViewKnob.prototype.redraw = function(angle){
      var separationAngle = 360 / this.spriteCount;
      var ticks = Math.floor((angle-this.spriteInitialAngle) / separationAngle);
      var pos = ticks * (this.spriteWidth + this.spriteSeparation) * this.spriteScale;
      this.element.find('.knob-container').css('background-position', (-1*pos) + 'px 50%');

      var val = this.formatValue(this.value);
      this.element.find('.value').html(val);
   };

   ViewKnob.prototype.formatValue = function(val){
      if(this.customFormatValue){
         val = this.customFormatValue(val);
      }
      else{
         if(this.step === null){
            val = val.toFixed(2);
         }
      }
      return val;
   };

   ViewKnob.prototype.template = [
      '<div class="knob-container">',
         '<div class="label"></div>',
         '<div class="value"></div>',
      '</div>',
   ].join('\n');

   ////////////////////////////////////////////////////////////////////////
   // Drag

   ViewKnob.prototype.initDrag = function(){
      this.element.on('mousedown', this.mousedown.bind(this));

      this.element.on('touchstart', this.mousedown.bind(this));
      this.element.on('touchmove', this.mousemove.bind(this));
      this.element.on('touchend', this.mouseup.bind(this));
   };

   ViewKnob.prototype.destroyDrag = function(){
      $(document).off('mousemove.knob');
      $(document).off('mouseup.knob');
   };

   ViewKnob.prototype.mousedown = function(e){
      this.lastY = e.screenY;
      if(typeof(this.lastY) === 'undefined'){
         this.lastY = e.originalEvent.changedTouches[0].screenY; 
      }

      $(document).on('mousemove.knob', this.mousemove.bind(this));
      $(document).on('mouseup.knob', this.mouseup.bind(this));

      e.preventDefault();
   };

   ViewKnob.prototype.mousemove = function(e){
      var screenY = e.screenY;
      if(typeof(screenY) === 'undefined'){
         screenY = e.originalEvent.changedTouches[0].screenY; 
      }

      // calculate angle from pixels
      var delta = this.lastY - screenY; 
      this.lastY = screenY; 
      this.angle += delta * this.speed;
      this.angle = Math.min(this.maxAngle, this.angle);
      this.angle = Math.max(this.minAngle, this.angle);
      
      // convert angle to value, snap to step.
      this.internalValue = this.angle2InternalValue(this.angle);
      this.value = this.internalValue2Value(this.internalValue);
      this.value = this.snapValueToStep(this.value);
      this.normalValue = this.value2Normal(this.value);

      // callback
      if(typeof(this.changingCallback)==='function'){
         if(this.value!==this.previousValue){
            this.previousValue = this.value;
            this.changingCallback(this.value, this.normalValue);
         }
      }

      // convert value to back to internal value and angle
      // so the effect of snapping to step applies to them as well
      this.internalValue = this.value2InternalValue(this.value);
      var tempAngle = this.internalValue2angle(this.internalValue);
      this.redraw(tempAngle);

      e.preventDefault();
   };

   ViewKnob.prototype.mouseup = function(){
      if(typeof(this.changedCallback)==='function'){
         this.changedCallback(this.value, this.normalValue);
      }

      $(document).off('mousemove.knob');
      $(document).off('mouseup.knob');
   };

   ////////////////////////////////////////////////////////////////////////
   // Values

   ViewKnob.prototype.setValue = function(newValue){
      this.value = newValue;

      this.internalValue = this.value2InternalValue(this.value);
      this.normalValue = this.value2Normal(this.value);
      this.angle = this.internalValue2angle(this.internalValue);

      this.redraw(this.angle);
   };

   ViewKnob.prototype.mapRange = function(from, to, value) {
      return to[0] + (value - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
   };

   ViewKnob.prototype.snapValueToStep = function(value){
      if(this.step === null){
         return value;
      }

      var numDigits = String(this.step).split('.');
      if(numDigits.length === 2){
         numDigits = numDigits[1].length; 
      }
      else{
         numDigits = 0;
      }
      return (Math.round(value/this.step)*this.step).toFixed(numDigits);
   };

   ViewKnob.prototype.internalValue2Value = function(internalValue){
      internalValue = Math.pow(internalValue, this.pow);
      return this.mapRange([0,1], [this.minValue, this.maxValue], internalValue);
   };

   ViewKnob.prototype.value2InternalValue = function(value){
      var intVal = this.mapRange([this.minValue, this.maxValue], [0, 1], value);
      return Math.pow(intVal, 1/this.pow);
   };

   ViewKnob.prototype.angle2InternalValue = function(angle){
      return this.mapRange([this.minAngle, this.maxAngle], [0,1], angle);
   };

   ViewKnob.prototype.internalValue2angle = function(intval){
      return this.mapRange([0,1], [this.minAngle, this.maxAngle], intval);
   };

   ViewKnob.prototype.value2Normal = function(value){
      return this.mapRange([this.minValue, this.maxValue], [0, 1], value);
   };

   global.EscuelaDeExperimentos = global.EscuelaDeExperimentos || {};
   global.EscuelaDeExperimentos.ViewKnob = ViewKnob;

})(this);

