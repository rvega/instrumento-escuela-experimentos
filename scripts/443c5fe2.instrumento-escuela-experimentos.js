!function(a){"use strict";var b={};b.mixin=function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])},b.interpolarColores=function(a,b,c){function d(a){return a.toString(16)}function e(a){return parseInt(a,16)}if(0===c)return a;if(1===c)return b;for(var f="#",g=1;6>=g;g+=2){for(var h=Number(e(a.substr(g,2))),i=Number(e(b.substr(g,2))),j=h+(i-h)*c,k=d(Math.floor(j));k.length<2;)k="0"+k;f+=k}return f},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.Utility=b}(this),function(a){"use strict";var b={};b.initInstrumentoMonofonico=function(a){var b=a||{};this.cuantasNotas=b.cuantasNotas||10,this.cuantosTiempos=b.cuantosTiempos||16;for(var c=[],d=0;d<this.cuantosTiempos;d++)c.push(-1);this.secuencia=b.secuencia||c,this.notas=b.notas||[150,200,300,400,500,600,700,800,900,1e3],this.audioGraph=b.audioGraph,this.tiempoMirarFuturo=.05,this.tiempoNotaActual=0,this.notaActual=0,this.tiempoNotaProxima=0,this.notasEnFila=[],this.pasoActual=0},b.tocarNota=function(){throw new Error('AudioMixinInstrumentoMonofonico: Todos los instrumentos deben implementar el método "tocarNota"')},b.getGain=function(){throw new Error('AudioMixinInstrumentoMonofonico: Todos los instrumentos deben implementar el método "getGain"')},b.getPasoActual=function(a){for(;this.notasEnFila.length&&this.notasEnFila[0].tiempo<a;)this.pasoActual=this.notasEnFila[0].paso,this.notasEnFila.splice(0,1);return this.pasoActual},b.resetTiempo=function(){this.pasoActual=0,this.notaActual=0,this.tiempoNotaActual=0,this.tiempoNotaProxima=0,this.notasEnFila=[]},b.programarNotas=function(a,b){for(var c,d=this.audioGraph.tempo,e=60/d;this.tiempoNotaProxima<a+this.tiempoMirarFuturo;)-1!==this.secuencia[this.notaActual]&&(c=this.notas[this.secuencia[this.notaActual]],this.tocarNota(this.tiempoNotaProxima+b,e,c)),this.notasEnFila.push({paso:this.notaActual,tiempo:this.tiempoNotaProxima}),this.tiempoNotaActual=this.tiempoNotaProxima,this.tiempoNotaProxima+=e,this.notaActual++,this.notaActual===this.cuantosTiempos&&(this.notaActual=0)},b.conectar=function(){throw new Error('AudioMixinInstrumentoMonofonico: Todos los instrumentos deben implementar el método "conectar"')},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico=b}(this),function(a){"use strict";var b=function(a){var b=a||{};this.gain=null,this.ataque=b.ataque||.002,this.descarga=b.descarga||.2,this.sustain=b.sustain||.3,this.initInstrumentoMonofonico(a)};EscuelaDeExperimentos.Utility.mixin(b.prototype,EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico),b.prototype.tocarNota=function(a,b,c){var d=this.audioGraph.audioContext,e=d.createOscillator(),f=d.createGain();e.type="sawtooth",e.connect(f),f.connect(this.salida),e.frequency.setValueAtTime(c,a),e.start(a),f.gain.setValueAtTime(0,a),f.gain.linearRampToValueAtTime(1,a+this.ataque),f.gain.setValueAtTime(1,a+b*this.sustain),f.gain.linearRampToValueAtTime(0,a+b*this.sustain+this.descarga),e.stop(a+.5*b+this.descarga),this.gain=f},b.prototype.getGain=function(){return null===this.gain?0:this.gain.gain.value},b.prototype.conectar=function(a){this.salida=a},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.InstrumentoBajo=b}(this),function(a){"use strict";var b=function(a){var b=a||{};this.gain=null,this.ataque=b.ataque||.1,this.descarga=b.descarga||.2,this.sustain=b.sustain||.5,this.initInstrumentoMonofonico(a)};EscuelaDeExperimentos.Utility.mixin(b.prototype,EscuelaDeExperimentos.AudioMixinInstrumentoMonofonico),b.prototype.tocarNota=function(a,b,c){var d=this.audioGraph.audioContext,e=d.createOscillator(),f=d.createGain();e.type="sine",e.connect(f),f.connect(this.salida),e.frequency.setValueAtTime(c,a),e.start(a),f.gain.setValueAtTime(0,a),f.gain.linearRampToValueAtTime(1,a+this.ataque),f.gain.setValueAtTime(1,a+b*this.sustain),f.gain.linearRampToValueAtTime(0,a+b*this.sustain+this.descarga),e.stop(a+.5*b+this.descarga),this.gain=f},b.prototype.getGain=function(){return null===this.gain?0:this.gain.gain.value},b.prototype.conectar=function(a){this.salida=a},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.InstrumentoSeno=b}(this),function(a){"use strict";var b=function(a){var b=a||{};this.audioContext=b.audioContext||new AudioContext,this.playing=!0,this.tiempoInicial=this.audioContext.currentTime,this.tempo=b.tempo||120,this.periodoTick=b.periodoTick||.01,this.instrumentos={};var c=new EscuelaDeExperimentos.InstrumentoBajo({audioGraph:this,cuantasNotas:10,cuantosTiempos:16});c.conectar(this.audioContext.destination),this.instrumentos.bajo=c;var d=new EscuelaDeExperimentos.InstrumentoSeno({audioGraph:this,cuantasNotas:10,cuantosTiempos:16});d.conectar(this.audioContext.destination),this.instrumentos.seno1=d,setInterval(this.tick.bind(this),1e3*this.periodoTick)};b.prototype.tick=function(){if(this.playing===!0){var a=this.audioContext.currentTime-this.tiempoInicial;for(var b in this.instrumentos)this.instrumentos[b].programarNotas(a,this.tiempoInicial)}},b.prototype.play=function(){for(var a in this.instrumentos)this.instrumentos[a].resetTiempo();this.tiempoInicial=this.audioContext.currentTime,this.playing=!0},b.prototype.stop=function(){this.playing=!1},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.AudioGraph=b}(this),function(a){"use strict";var b=function(a){var b=a||{};if(!b.htmlContainer)throw new Error("ViewKnob: You must provide the id of a DOM element.");this.element=$("#"+b.htmlContainer),this.changingCallback=b.changingCallback,this.changedCallback=b.changedCallback,this.minValue=b.minValue||0,this.maxValue=b.maxValue||1,this.pow=b.pow||1,this.step=b.step||null,this.speed=b.speed||2,this.width=b.width||"30px",this.height=b.height||"30px",this.minAngle=b.minAngle||40,this.maxAngle=b.maxAngle||320,this.label=b.label||"",this.customFormatValue=b.valueFormat||null,this.sprite=b.sprite||"styles/img/knob.png",this.spriteCount=b.spriteCount||120,this.spriteInitialAngle=b.spriteInitialAngle||0,this.spriteWidth=b.spriteWidth||100,this.spriteSeparation=b.spriteSeparation||0,this.spriteDirection=b.spriteDirection||"clockwise",this.draw(),this.initDrag(),this.setValue(b.value||0)};b.prototype.destroy=function(){this.destroyDrag(),this.element.remove()},b.prototype.draw=function(){var a=this.template;this.element.html(a),this.element.css("width",this.width),this.element.css("height",this.width);var b=this.element.find(".knob-container");b.css("width",this.width),b.css("height",this.height),b.css("background",'url("'+this.sprite+'")'),this.spriteScale=this.element.width()/this.spriteWidth;var c=(this.spriteWidth+this.spriteSeparation)*this.spriteScale*this.spriteCount;b.css("background-size",c+"px 100%");var d=this.element.find(".label");""!==this.label?(d.html(this.label),d.show()):d.hide()},b.prototype.redraw=function(a){var b=360/this.spriteCount,c=Math.floor((a-this.spriteInitialAngle)/b),d=c*(this.spriteWidth+this.spriteSeparation)*this.spriteScale;this.element.find(".knob-container").css("background-position",-1*d+"px 50%");var e=this.formatValue(this.value);this.element.find(".value").html(e)},b.prototype.formatValue=function(a){return this.customFormatValue?a=this.customFormatValue(a):null===this.step&&(a=a.toFixed(2)),a},b.prototype.template=['<div class="knob-container">','<div class="label"></div>','<div class="value"></div>',"</div>"].join("\n"),b.prototype.initDrag=function(){this.element.on("mousedown",this.mousedown.bind(this)),this.element.on("touchstart",this.mousedown.bind(this)),this.element.on("touchmove",this.mousemove.bind(this)),this.element.on("touchend",this.mouseup.bind(this))},b.prototype.destroyDrag=function(){$(document).off("mousemove.knob"),$(document).off("mouseup.knob")},b.prototype.mousedown=function(a){this.lastY=a.screenY,"undefined"==typeof this.lastY&&(this.lastY=a.originalEvent.changedTouches[0].screenY),$(document).on("mousemove.knob",this.mousemove.bind(this)),$(document).on("mouseup.knob",this.mouseup.bind(this)),a.preventDefault()},b.prototype.mousemove=function(a){var b=a.screenY;"undefined"==typeof b&&(b=a.originalEvent.changedTouches[0].screenY);var c=this.lastY-b;this.lastY=b,this.angle+=c*this.speed,this.angle=Math.min(this.maxAngle,this.angle),this.angle=Math.max(this.minAngle,this.angle),this.internalValue=this.angle2InternalValue(this.angle),this.value=this.internalValue2Value(this.internalValue),this.value=this.snapValueToStep(this.value),this.normalValue=this.value2Normal(this.value),"function"==typeof this.changingCallback&&this.value!==this.previousValue&&(this.previousValue=this.value,this.changingCallback(this.value,this.normalValue)),this.internalValue=this.value2InternalValue(this.value);var d=this.internalValue2angle(this.internalValue);this.redraw(d),a.preventDefault()},b.prototype.mouseup=function(){"function"==typeof this.changedCallback&&this.changedCallback(this.value,this.normalValue),$(document).off("mousemove.knob"),$(document).off("mouseup.knob")},b.prototype.setValue=function(a){this.value=a,this.internalValue=this.value2InternalValue(this.value),this.normalValue=this.value2Normal(this.value),this.angle=this.internalValue2angle(this.internalValue),this.redraw(this.angle)},b.prototype.mapRange=function(a,b,c){return b[0]+(c-a[0])*(b[1]-b[0])/(a[1]-a[0])},b.prototype.snapValueToStep=function(a){if(null===this.step)return a;var b=String(this.step).split(".");return b=2===b.length?b[1].length:0,(Math.round(a/this.step)*this.step).toFixed(b)},b.prototype.internalValue2Value=function(a){return a=Math.pow(a,this.pow),this.mapRange([0,1],[this.minValue,this.maxValue],a)},b.prototype.value2InternalValue=function(a){var b=this.mapRange([this.minValue,this.maxValue],[0,1],a);return Math.pow(b,1/this.pow)},b.prototype.angle2InternalValue=function(a){return this.mapRange([this.minAngle,this.maxAngle],[0,1],a)},b.prototype.internalValue2angle=function(a){return this.mapRange([0,1],[this.minAngle,this.maxAngle],a)},b.prototype.value2Normal=function(a){return this.mapRange([this.minValue,this.maxValue],[0,1],a)},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.ViewKnob=b}(this),function(a){"use strict";var b=function(a){var b=a||{};this.superView=b.superView,this.audioGraph=b.audioGraph,this.dibujar()};b.prototype.template=['<div id="controles">','<button class="boton" id="stop" type="button"><img src="styles/img/stop.png"/></button>','<button class="boton" id="play" type="button"><img src="styles/img/play.png"/></button>','<img id="tempo-icon" src="styles/img/tempo.png"><div id="knob-tempo"></div>',"</div>"].join("\n"),b.prototype.dibujar=function(){var a=document.getElementById(this.superView.htmlContainer);$(a).prepend(this.template),new EscuelaDeExperimentos.ViewKnob({htmlContainer:"knob-tempo",changedCallback:this.tempoChange.bind(this),minValue:60,maxValue:240,value:120,step:1}),$("#play").on("mouseup touchdown",this.play.bind(this)),$("#stop").on("mouseup touchdown",this.stop.bind(this))},b.prototype.play=function(){this.audioGraph.play()},b.prototype.stop=function(){this.audioGraph.stop()},b.prototype.tempoChange=function(a){this.audioGraph.tempo=a},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.ViewControles=b}(this),function(a){"use strict";var b=function(a){var b=a||{};this.colores=b.colores||this.coloresDefault,this.superView=b.superView,this.interactivo=b.interactivo||!1,this.width=b.width||this.superView.width,this.x=b.x||this.width/2,this.y=b.y||this.width/2,this.audioInstrumento=b.audioInstrumento,this.cuantasNotas=b.cuantasNotas||this.audioInstrumento.cuantasNotas,this.cuantosTiempos=b.cuantosTiempos||this.audioInstrumento.cuantosTiempos,this.botones=[],this.columnaDestacada=0,this.layer=null,this.dibujar(),this.interactivo&&this.destacarColumna(0,!0)};b.prototype.coloresDefault={bordes:"#fa6923",fondo:"#333333",fondoDestacado:"#464646",notaDestacada:"#fa6923",nota:"#af410c"},b.prototype.mouseover=function(a){var b=a.target;b.fill(this.colores.fondoDestacado),b.draw(),document.body.style.cursor="pointer"},b.prototype.mouseout=function(a){var b=a.target;b.fill(b.activo?this.colores.nota:this.colores.fondo),b.draw(),document.body.style.cursor="default"},b.prototype.clickBoton=function(a){for(var b=a.target,c=this.botones[b.columna],d=0;d<c.length;d++){var e=c[d];if(e!==b&&e.activo){e.activo=!1,e.fill(this.colores.fondo),e.draw();break}}b.activo?(b.activo=!1,b.fill(this.colores.fondo),this.audioInstrumento.secuencia[b.columna]=-1):(b.activo=!0,b.fill(this.colores.nota),this.audioInstrumento.secuencia[b.columna]=b.fila),b.draw()},b.prototype.polar2cart=function(a,b){a-=90,a*=-1;var c=this.x+b*Math.cos(a*Math.PI/180),d=this.y-b*Math.sin(a*Math.PI/180);return{x:c,y:d}},b.prototype.dibujar=function(){var a=this.superView.superView.stage;this.layer=new Kinetic.Layer({listening:this.interactivo});for(var b=this.width,c=this.cuantasNotas,d=b/10,e=(b/2-d)/c,f=.8*e,g=this.cuantosTiempos,h=360/g,i=.9*h,j=0;g>j;j++){for(var k=[],l=0;c>l;l++){var m=l*e,n=j*h,o=this.polar2cart(n-i/2,d+m+f),p=this.polar2cart(n-i/4,d+m+f),q=this.polar2cart(n,d+m+f),r=this.polar2cart(n+i/4,d+m+f),s=this.polar2cart(n+i/2,d+m+f),t=this.polar2cart(n+i/2,d+m),u=this.polar2cart(n+i/4,d+m),v=this.polar2cart(n,d+m),w=this.polar2cart(n-i/4,d+m),x=this.polar2cart(n-i/2,d+m),y=new Kinetic.Line({fill:this.colores.fondo,stroke:this.colores.bordes,strokeWidth:this.width>100?2:1,closed:!0,points:[o.x,o.y,p.x,p.y,q.x,q.y,r.x,r.y,s.x,s.y,t.x,t.y,u.x,u.y,v.x,v.y,w.x,w.y,x.x,x.y]});y.columna=j,y.fila=l,y.activo=!1,this.interactivo&&(y.on("mousedown",this.clickBoton.bind(this)),y.on("mouseover",this.mouseover.bind(this)),y.on("mouseout",this.mouseout.bind(this))),this.layer.add(y),k.push(y)}this.botones.push(k)}a.add(this.layer)},b.prototype.destacarColumna=function(a){a!==this.columnaDestacada&&(this._destacarColumna(this.columnaDestacada,!1),this._destacarColumna(a,!0),this.columnaDestacada=a)},b.prototype._destacarColumna=function(a,b){for(var c=this.botones[a],d=c.length,e=0;d>e;e++){var f=c[e];f.fill(f.activo&&b===!0?this.colores.notaDestacada:f.activo||b!==!0?f.activo&&!b?this.colores.nota:this.colores.fondo:this.colores.fondoDestacado),f.draw()}},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.ViewRueda=b}(this),function(a){"use strict";var b=function(a){var b=a||{};this.superView=b.superView,this.width=b.width||this.superView.width,this.x=b.x||this.width/2,this.y=b.y||this.width/2,this.audioInstrumento=b.audioInstrumento,this.colores=b.colores||this.superView.coloresDefault,this.activo=b.activo||!1,this.border=null,this.mouseEstaEncima=!1,this.dibujar();var c={fondo:"#333333",fondoDestacado:b.colores.fondoDestacado,bordes:b.colores.bordes,nota:b.colores.nota,notaDestacada:b.colores.notaDestacada};this.rueda=new EscuelaDeExperimentos.ViewRueda({interactivo:!1,audioInstrumento:this.audioInstrumento,superView:this,x:this.x+this.width/2,y:this.y+this.width/2,width:.85*this.width,cuantasNotas:5,cuantosTiempos:8,colores:c})};b.prototype.dibujar=function(){var a=this.superView.stage,b=new Kinetic.Layer,c=this.width;this.border=new Kinetic.Rect({width:c,height:c,x:this.x,y:this.y,strokeWidth:2,stroke:this.activo?this.colores.bordes:"#575757",fill:this.colores.fondo,cornerRadius:4}),this.border.on("mouseover",this.mouseover.bind(this)),this.border.on("mouseout",this.mouseout.bind(this)),this.border.on("mousedown",this.click.bind(this)),b.add(this.border),a.add(b)},b.prototype.update=function(a){if(!this.mouseEstaEncima){var b,c=this.audioInstrumento.getGain(a);b=c>.01?EscuelaDeExperimentos.Utility.interpolarColores(this.colores.fondo,this.colores.bordes,c):this.colores.fondo,this.border.fill(b),this.border.draw()}},b.prototype.activar=function(){this.border.stroke(this.colores.bordes),this.border.draw()},b.prototype.desactivar=function(){this.border.stroke("#575757"),this.border.draw()},b.prototype.mouseover=function(){this.mouseEstaEncima=!0,document.body.style.cursor="pointer",this.border.fill("#575757"),this.border.draw()},b.prototype.mouseout=function(){this.mouseEstaEncima=!1,document.body.style.cursor="default",this.border.fill("#333333"),this.border.draw()},b.prototype.click=function(){this.superView.clickedMini(this)},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.ViewInstrumentoMini=b}(this),function(a){"use strict";var b=function(a){var b=a||{};this.visible=b.visible||!1,this.superView=b.superView,this.width=b.width||this.superView.width,this.x=b.x||this.width/2,this.y=b.y||this.width/2,this.audioInstrumento=b.audioInstrumento,this.rueda=new EscuelaDeExperimentos.ViewRueda({interactivo:!0,audioInstrumento:this.audioInstrumento,superView:this,x:this.x,y:this.y,width:this.width,colores:b.colores}),this.visible?this.mostrar():this.esconder()};b.prototype.mostrar=function(){this.visible=!0,this.rueda.layer.show()},b.prototype.esconder=function(){this.visible=!1,this.rueda.layer.hide()},b.prototype.update=function(a){if(this.visible){var b=this.audioInstrumento,c=b.getPasoActual(a);this.rueda.destacarColumna(c)}},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.ViewInstrumento=b}(this),function(a){"use strict";var b=function(a){var b=a||{};this.audioGraph=b.audioGraph,this.htmlContainer=b.htmlContainer,this.width=b.width,this.height=b.height,this.stage=null,this.subViews={},this.instrumentoActivo=null,this.instrumentoMiniActivo=null,this.initStage(),this.initSubviews()};b.prototype.template='<div id="stage"></div>',b.prototype.initStage=function(){var a=document.getElementById(this.htmlContainer);a.innerHTML+=this.template,a.style.background="#333",this.stage=new Kinetic.Stage({container:"stage",width:this.width,height:this.height})},b.prototype.initSubviews=function(){new EscuelaDeExperimentos.ViewControles({audioGraph:this.audioGraph,superView:this});var a=this.width/8,b=13,c={fondo:"#333333",fondoDestacado:"#464646",bordes:"#e63b31",nota:"#e63b31",notaDestacada:"#932822"},d=new EscuelaDeExperimentos.ViewInstrumento({audioInstrumento:this.audioGraph.instrumentos.bajo,superView:this,width:.6*this.width,x:this.width/2,y:this.height/2+60,colores:c,visible:!0});this.subViews.bajo=d,this.instrumentoActivo=d;var e=new EscuelaDeExperimentos.ViewInstrumentoMini({audioInstrumento:this.audioGraph.instrumentos.bajo,superView:this,width:a,y:10,x:1,colores:c,activo:!0});e.instrumentoView=d,this.subViews.bajoMini=e,this.instrumentoMiniActivo=e;var f={fondo:"#333333",fondoDestacado:"#464646",bordes:"#fa6923",nota:"#fa6923",notaDestacada:"#af410c"},g=new EscuelaDeExperimentos.ViewInstrumento({audioInstrumento:this.audioGraph.instrumentos.seno1,superView:this,width:.6*this.width,x:this.width/2,y:this.height/2+60,colores:f});this.subViews.seno1=g;var h=new EscuelaDeExperimentos.ViewInstrumentoMini({audioInstrumento:this.audioGraph.instrumentos.seno1,superView:this,width:a,y:10,x:1+a+b,colores:f});h.instrumentoView=g,this.subViews.senoMini1=h,this.update()},b.prototype.update=function(){var a=this.audioGraph.audioContext.currentTime;for(var b in this.subViews)this.subViews[b].update(a);window.requestAnimationFrame(this.update.bind(this))},b.prototype.clickedMini=function(a){a!==this.instrumentoMiniActivo&&(this.instrumentoActivo.esconder(),this.instrumentoMiniActivo.desactivar(),this.instrumentoActivo=a.instrumentoView,this.instrumentoMiniActivo=a,a.activar(),this.instrumentoActivo.mostrar())},a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{},a.EscuelaDeExperimentos.ViewMain=b}(this),function(a){"use strict";a.EscuelaDeExperimentos=a.EscuelaDeExperimentos||{};var b=function(a){var b=a||{};if(!b.htmlContainer)return void console.error("EscuelaDeExperimentos.RondoRondo():                        Necesito un elemento html donde dibujar.");var c=b.width||document.getElementById(b.htmlContainer).offsetWidth,d=.75*c;this.audioGraph=new EscuelaDeExperimentos.AudioGraph,this.mainView=new EscuelaDeExperimentos.ViewMain({audioGraph:this.audioGraph,htmlContainer:b.htmlContainer,width:c,height:d})};a.EscuelaDeExperimentos.RondoRondo=b}(this);