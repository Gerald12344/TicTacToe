let ReactFulVariableMaker = (interal, moreData, extraData) => { return { acompanyingData: moreData, eventMoreData: extraData, aInternal: interal, hooks: {}, aListener: function (val) {}, set update(val) { this.aInternal = val; Object.entries(this.hooks).forEach( ([key, value]) => { value(val); } ); this.aListener(val); }, get update() { return this.aInternal; }, registerListener: function (listener) { this.aListener = listener; }, addListener: function (listener) { let uuid = uuidv4(); this.hooks[uuid] = listener; return uuid; }, removeListener: function (listener) { delete this.hooks[listener]; }, }; };;var byteToHex = []; for (var iii = 0; iii < 256; ++iii) { byteToHex[iii] = (iii + 0x100).toString(16).substr(1); } function bytesToUuid(buf, offset) { var iii = offset || 0; var bth = byteToHex; return ([ bth[buf[iii++]], bth[buf[iii++]], bth[buf[iii++]], bth[buf[iii++]], '-', bth[buf[iii++]], bth[buf[iii++]], '-', bth[buf[iii++]], bth[buf[iii++]], '-', bth[buf[iii++]], bth[buf[iii++]], '-', bth[buf[iii++]], bth[buf[iii++]], bth[buf[iii++]], bth[buf[iii++]], bth[buf[iii++]], bth[buf[iii++]] ]).join(''); } var getRandomValues = (typeof (crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) || (typeof (msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto)); function uuidv4(options, buf, offset) { var rnds = new Array(16); var iii = buf && offset || 0; if (typeof (options) == 'string') { buf = options === 'binary' ? new Array(16) : null; options = null; } options = options || {}; let mathRNG = ()  => { for (var iii = 0, r; iii < 16; iii++) { if ((iii & 0x03) === 0) r = Math.random() * 0x100000000; rnds[iii] = r >>> ((iii & 0x03) << 3) & 0xff; } return rnds; }; var rnds = options.random || (options.rng || mathRNG)(); rnds[6] = (rnds[6] & 0x0f) | 0x40; rnds[8] = (rnds[8] & 0x3f) | 0x80; if (buf) { for (var ii = 0; ii < 16; ++ii) { buf[iii + ii] = rnds[ii]; } } return buf || bytesToUuid(rnds); } ;/* This library uses the new Harv Script Component System */ 
'use strict'


/*This is the main script files for .Harvey, (c) - Harvey Randall 2021*/
/*Because of the small size of this project the dev files are kept at the top of the build file*/
console.log('%c[Harv-Script]' + '%c - Running Harv-Script Developmet v1.0.1!','color:#00B5E2','color:white')
let componentHashTree = {}
/*'Not all web pages were made the same, it is our job to fix that' - Harvey Randall 2020*/
/*setTimeout(() => {let bodyMain = document.getElementsByTagName('BODY')[0];let headMain = document.getElementsByTagName('HEAD')[1];bodyMain.id = 'body';headMain.id = 'head'},500)*/
function makeAjaxRequest(url,typeIn,body,returnFunc){let ajax = new XMLHttpRequest();if(ajax === undefined){console.log('that a negetive Chief');return(false)};function RecieveData(){};ajax.onreadystatechange = RecieveData;ajax.open(typeIn,url,true);ajax.setRequestHeader('Content-type','application/json');ajax.send(body)}
function MontiorInputs(item,reason,functionToCall){let textInput = componentHashTree[item];if(textInput === undefined){return(undefined)};textInput.addEventListener(reason,function input(input){setTimeout(function test(){functionToCall(input.target.value,input.key)},5)},false)}
function element(type,text,id,parent,className){if(typeof className === 'object'){className = ''};let newElement = document.createElement(type);let parentIn = componentHashTree[parent];newElement.innerHTML = text;if(!(parentIn === undefined)){parentIn.appendChild(newElement)};if(parentIn === undefined){if(document.getElementById(id) === null){let FoundParent = document.getElementById(parent);if(parent === 'body'){FoundParent = document.getElementsByTagName(parent)[0]};if(parent === 'head'){FoundParent = document.getElementsByTagName(parent)[0]};FoundParent.appendChild(newElement)};if(!(document.getElementById(id) === null)){newElement.innerHTML = text}};if(!(className === undefined) && !(className === '')){newElement.className = className};componentHashTree[id] = newElement;return(newElement)}
function updatelement(id,inner){let FoundParent = document.getElementById(id);FoundParent.innerHTML = inner}
function updateText(id,text,wipeValue){let Node = document.getElementById(id);Node.innerHTML = text;if(wipeValue){Node.value = text}}
function removeComponents(ArrayIn,UseEffects){ArrayIn.forEach((e) => {e.Element.remove()});if(!(UseEffects === undefined)){UseEffects.forEach((e) => {e()})}}
let OpenFuns = []
function WindowMonitor(ReturnFunc){history.move = (body) => {for(let i=0;i<OpenFuns.length;i=i+1){let item = OpenFuns[i];if(!(item === undefined)){item()}};let Root = document.body;Root.innerHTML = '';history.pushState('','',body);;console.log('%c[Harv-Script]' + '%c - Page location changed to ' + window.location.pathname + '!','color:#00B5E2','color:white');ReturnFunc()};window.onpopstate = () => {console.log(window.location.pathname);for(let i=0;i<OpenFuns.length;i=i+1){let item = OpenFuns[i];if(!(item === undefined)){item()}};let Root = document.body;Root.innerHTML = '';history.pushState('','',window.location.pathname);ReturnFunc()}}
function RouterPoint(location,exact,component){if(exact){if(window.location.pathname === location){OpenFuns.push(component())}};if(exact === false){if(window.location.pathname.startsWith(location)){OpenFuns.push(component())}}}
function Link(href,text,id,parent,className){element('button',text,id,parent,className);MontiorInputs(id,'click',(value) => {if(!(href === window.location.pathname)){history.move(href)}})}
function createReactiveVariable(defaultState){return(ReactFulVariableMaker(defaultState))}
function generateStringFromReactVar(arrayIn){let output = [];arrayIn.forEach((e) => {if('object' === typeof e){output.push(e.aInternal);return(undefined)};output.push(e)});return(output.join(''))}
function booleanComponentRendering(boolean,component,variables){;function updateSettingsCycle(){if(boolean.aInternal === true){cleanup = component(...variables);return(undefined)};if(boolean.aInternal === false){if(!(typeof cleanup === 'undefined')){cleanup()};return(undefined)};console.log('%c[Harv-Script]' + '%c - Failed, incorrect use of usePortal, the first input must be a hook, that is a boolean!','color:#00B5E2','color:white');logError('Failed, incorrect use of usePortal, the first input must be a hook, that is a boolean!')};boolean.addListener((value) => {updateSettingsCycle()});;updateSettingsCycle()}
function ReactfulElement(ElementType,reactVar,parent,UUID,ClassName){if(UUID === undefined){UUID = uuidv4()};let reactfulVars = [];let reactfulClassVars = [];if(Array.isArray(reactVar)){reactVar.forEach((e) => {if('object' === typeof e){reactfulVars.push(e)}})};if(Array.isArray(ClassName)){ClassName.forEach((e) => {if('object' === typeof e){reactfulClassVars.push(e)}})};if('string' === typeof reactVar){if(ClassName === undefined){ClassName = {}};if(ClassName.aListener === undefined && !(ClassName === undefined)){let defaultState = ClassName;ClassName = {};ClassName.aInternal = defaultState};let Element = element(ElementType,reactVar,UUID,parent,ClassName.aInternal);let returnObj = {};if(Array.isArray(ClassName)){let text = generateStringFromReactVar(ClassName);Element.className = text;reactfulClassVars.forEach((e) => {e.addListener((value) => {let text = generateStringFromReactVar(ClassName);Element.className = text});})};if(Array.isArray(ClassName) === false){if('object' === typeof ClassName && !(ClassName.aListener === undefined)){ClassName.addListener((value) => {Element.className = value});}};returnObj['UUID'] = UUID;returnObj['Element'] = Element;return(returnObj)};if(ClassName === undefined){ClassName = {}};let Element = undefined;if(Array.isArray(reactVar)){let text = generateStringFromReactVar(reactVar);Element = element(ElementType,text,UUID,parent,ClassName.aInternal);reactfulVars.forEach((e) => {e.addListener((value) => {let text = generateStringFromReactVar(reactVar);Element.innerHTML = text});})};if(Array.isArray(reactVar) === false){Element = element(ElementType,reactVar.aInternal,UUID,parent,ClassName.aInternal);reactVar.addListener((value) => {Element.innerHTML = value});};if(Array.isArray(ClassName)){let text = generateStringFromReactVar(ClassName);Element.className = text;reactfulClassVars.forEach((e) => {e.addListener((value) => {let text = generateStringFromReactVar(ClassName);Element.className = text});})};if(Array.isArray(ClassName) === false){if('object' === typeof ClassName && !(ClassName.aListener === undefined)){ClassName.addListener((value) => {Element.className = value});}};let returnObj = {};returnObj['UUID'] = UUID;returnObj['Element'] = Element;return(returnObj)}
function reactiveTemplate(predefinedVars,defaultValueArray,valueTemplate,typeIn,parent){;let Var = ReactFulVariableMaker(valueTemplate);;Var.acompanyingData = valueTemplate;;let MetaData = {};for(let i=0;i<predefinedVars.length;i=i+1){MetaData[predefinedVars[i]] = defaultValueArray[i];valueTemplate = valueTemplate.replaceAll('%{'+predefinedVars[i]+'}%',defaultValueArray[i])};Var.update = valueTemplate;Var.eventMoreData = MetaData;ReactfulElement(typeIn,Var,parent);return(Var)}
function updateTemplate(varToUpdate,newVal,reactfulElement){;let Template = reactfulElement.acompanyingData;let ExistingData = reactfulElement.eventMoreData;ExistingData[varToUpdate] = newVal;reactfulElement.eventMoreData = ExistingData;for(let i=0;i<Object.entries(ExistingData).length;i=i+1){Template = Template.replaceAll('%{'+Object.entries(ExistingData)[i][0]+'}%',Object.entries(ExistingData)[i][1])};reactfulElement.update = Template}
function generateTemplateWithElement(predefinedVars,defaultValueArray,valueTemplate){;let Var = ReactFulVariableMaker(valueTemplate);;Var.acompanyingData = valueTemplate;;let MetaData = {};for(let i=0;i<predefinedVars.length;i=i+1){MetaData[predefinedVars[i]] = defaultValueArray[i];valueTemplate = valueTemplate.replaceAll('%{'+predefinedVars[i]+'}%',defaultValueArray[i])};Var.update = valueTemplate;Var.eventMoreData = MetaData;return(Var)}
function generateModernTemplate(template){template = template.replace(/\n/g,'');let templateIn = template.match(/\%{(.*?)\}%/gm);let variables = [];let defaultValues = [];templateIn.forEach((e) => {e = e.split('');e.splice(0,2);e.splice((e.length - 2),2);e = e.join('');let dataInToFunc = e.split('|');variables.push(dataInToFunc[0]);defaultValues.push(dataInToFunc[1])});;let firstStage = template.replace(/\%{(.*?)\}%/gm,'%%HARVEY_VARIABLE%%');let almostDone = firstStage.split('%%');let occurence = 0;let justifiedOut = [];almostDone.forEach((e) => {if(e === 'HARVEY_VARIABLE'){justifiedOut.push('%{'+variables[occurence]+'}%');occurence = occurence + 1;return};justifiedOut.push(e)});let templateDone = justifiedOut.join('');let TemplateOut = generateTemplateWithElement(variables,defaultValues,templateDone);return(TemplateOut)}
function ElementMaker(typeIn,defaultValue,parent){let Title = createReactiveVariable(defaultValue);let UUID = ReactfulElement(typeIn,Title,parent);Title.UUID = UUID;return(Title)}
/*hooks*/
/*I will now add mega cool hooks for server communication*/
function useUpdate(inputFunc,arrayToWatch){let killFunc = inputFunc();arrayToWatch.forEach((e) => {/*Now verify that e actually is a reactful variable*/;if(typeof e === 'object' && !(e === null)){/*Now check if has the right properties*/;if(!(e.addListener === undefined)){e.addListener(() => {inputFunc()});return}};console.log('%c[Harv-Script]' + '%c - Failed, incorrect use of hooks, useUpdate must use a array of useHook variables!','color:#00B5E2','color:white');logError('Failed, incorrect use of hooks, useUpdate must use a array of useHook variables!')});return(killFunc)}
function useHook(defaultVal){/*lets make a reactive variable*/;let mainReactfulVar = ReactFulVariableMaker(defaultVal);function update(val){mainReactfulVar.update = val};let output = [mainReactfulVar,update];return(output)}
/*debugging*/
function Debugger(val){window.onerror = (error,url,line) => {if(val){console.log('%c[Harv-Script]' + '%c - Error occurred that could not be dismissed!\n' + '%c' + error,'color:#00B5E2','color:white','color:light-grey;text-decoration:underline;font-weight:bold');let objectTosend = {};objectTosend.data = error;objectTosend = JSON.stringify(objectTosend);makeAjaxRequest(window.location.origin + '/api/error','POST',objectTosend);return (() => {      /* Basic Component Renderer */      let parent = 'body';      let components = [];      /* Function To Remove Component*/      (() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('div',"",parent, InternalUUID, 'Error-Boundrary'); components.push(ElementWeWant); ((parent) => {(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('div',"",parent, InternalUUID, ""); components.push(ElementWeWant); ((parent) => {(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h1','An Error Occured During Run-Time That Could Not Be Dismissed!',parent, InternalUUID, ""); components.push(ElementWeWant); })();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h2',error,parent, InternalUUID, 'gapBelow'); components.push(ElementWeWant); })();})(InternalUUID)})();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('style',"@import url(`https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200&display=swap`);.gapBelow { margin-bottom: 60px;}.Error-Boundrary { text-align: center; height: 100vh; width: 100vw; position: fixed; z-index: 1000000000; color: black; text-align: center; text-transform: none; top: 0; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.8); white-space: pre; display: flex;}.Error-Boundrary > h2 { font-family: Source Code Pro, monospace; font-weight: 200;}.Error-Boundrary > div { text-align: center; height: 80vh; background-color: white; width: 80vw; border-radius: 16px; display: flex; flex-direction: column; justify-content: center;}",parent, InternalUUID, undefined); components.push(ElementWeWant); })();})(InternalUUID)})();;      return (() => {        if (typeof useUpdateArray !== 'undefined') {          removeComponents(components, useUpdateArray)        } else {          removeComponents(components)        }      })    })()}}}
let error = false
function logError(errorIn){let objectTosend = {};objectTosend.data = errorIn;objectTosend = JSON.stringify(objectTosend);makeAjaxRequest(window.location.origin + '/api/error','POST',objectTosend);let stack = undefined;try{throw new Error('')}catch(error){stack = error.stack};let split = stack.split('\n');split.splice(1,1);stack = split.join('\n');if(error === true){return(undefined)};error = true;return (() => {      /* Basic Component Renderer */      let parent = 'body';      let components = [];      /* Function To Remove Component*/      (() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('div',"",parent, InternalUUID, 'Error-Boundrary'); components.push(ElementWeWant); ((parent) => {(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('div',"",parent, InternalUUID, ""); components.push(ElementWeWant); ((parent) => {(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h1','An Error Occured During Run-Time That Could Not Be Dismissed!',parent, InternalUUID, ""); components.push(ElementWeWant); })();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h2',errorIn,parent, InternalUUID, 'gapBelow'); components.push(ElementWeWant); })();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h1','Stack Trace:',parent, InternalUUID, ""); components.push(ElementWeWant); })();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h3',stack,parent, InternalUUID, undefined); components.push(ElementWeWant); })();})(InternalUUID)})();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('style',"@import url(`https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200&display=swap`);.gapBelow { margin-bottom: 60px;}.Error-Boundrary { text-align: center; height: 100vh; width: 100vw; position: fixed; z-index: 1000000000; color: black; text-align: center; text-transform: none; top: 0; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.8); white-space: pre; display: flex;}.Error-Boundrary > h2 { font-family: Source Code Pro, monospace; font-weight: 200;}.Error-Boundrary > div { text-align: center; height: 80vh; background-color: white; width: 80vw; border-radius: 16px; display: flex; flex-direction: column; justify-content: center;}",parent, InternalUUID, undefined); components.push(ElementWeWant); })();})(InternalUUID)})();;      return (() => {        if (typeof useUpdateArray !== 'undefined') {          removeComponents(components, useUpdateArray)        } else {          removeComponents(components)        }      })    })()}
/*Harvey Framework scripts end here*/
Debugger(true)


function GlobalCSS(Mainparent){return (() => {      /* Basic Component Renderer */      let parent = Mainparent;      let components = [];      /* Function To Remove Component*/      (() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('style',' .nav-button{ background-color: #4CAF50; /* Green */ border: none; color:white; padding: 15px 32px; text-align: center; text-decoration: none; font-size: 16px; cursor: pointer; outline: none; } .nav-button:hover { background-color: #3e8e41; } body{ border:0; } .hidden_tag{ display: none; } /* Yikes this handles the small text */ .downabit{ transform: translate(0,100%); } ',parent, InternalUUID, ""); components.push(ElementWeWant); })();;      return (() => {        if (typeof useUpdateArray !== 'undefined') {          removeComponents(components, useUpdateArray)        } else {          removeComponents(components)        }      })    })()}
function board(parentIn,props,player,callback){return (() => {      /* Basic Component Renderer */      let parent = parentIn;      let components = [];      /* Function To Remove Component*/      (() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('div',"",parent, InternalUUID, 'board'); components.push(ElementWeWant); ((parent) => {(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('div',"",parent, InternalUUID, ""); components.push(ElementWeWant); ((parent) => {let item = props[0];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',item,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(0) === false){return(undefined)};item.update = player.aInternal; });  components.push(ElementWeWant); })();;let itemTwo = props[1];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',itemTwo,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(1) === false){return(undefined)};itemTwo.update = player.aInternal; });  components.push(ElementWeWant); })();;let itemThree = props[2];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',itemThree,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(2) === false){return(undefined)};itemThree.update = player.aInternal; });  components.push(ElementWeWant); })();})(InternalUUID)})();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('div',"",parent, InternalUUID, ""); components.push(ElementWeWant); ((parent) => {let item = props[3];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',item,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(3) === false){return(undefined)};item.update = player.aInternal; });  components.push(ElementWeWant); })();;let itemTwo = props[4];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',itemTwo,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(4) === false){return(undefined)};itemTwo.update = player.aInternal; });  components.push(ElementWeWant); })();;let itemThree = props[5];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',itemThree,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(5) === false){return(undefined)};itemThree.update = player.aInternal; });  components.push(ElementWeWant); })();})(InternalUUID)})();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('div',"",parent, InternalUUID, ""); components.push(ElementWeWant); ((parent) => {let item = props[6];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',item,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(6) === false){return(undefined)};item.update = player.aInternal; });  components.push(ElementWeWant); })();;let itemTwo = props[7];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',itemTwo,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(7) === false){return(undefined)};itemTwo.update = player.aInternal; });  components.push(ElementWeWant); })();;let itemThree = props[8];(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('button',itemThree,parent, InternalUUID, ""); ElementWeWant.Element.addEventListener("click", function(e) {if(callback(8) === false){return(undefined)};itemThree.update = player.aInternal; });  components.push(ElementWeWant); })();})(InternalUUID)})();})(InternalUUID)})();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('style',".board { display: flex; flex-direction: column;}.board > div { flex-direction: horizontal; width: 300px; display: flex; height: 100px;}.board > div > button { width: 100px; height: 100px; border: 1px solid white; text-align: center; justify-content: center; line-height: 100px; font-size: 50px;}",parent, InternalUUID, undefined); components.push(ElementWeWant); })();;      return (() => {        if (typeof useUpdateArray !== 'undefined') {          removeComponents(components, useUpdateArray)        } else {          removeComponents(components)        }      })    })()}
function tixTaxToe(){let useUpdateArray=[];let [One,useOne] = useHook('');let [Two,useTwo] = useHook('');let [Three,useThree] = useHook('');let [Four,useFour] = useHook('');let [Five,useFive] = useHook('');let [Six,useSix] = useHook('');let [Seven,useSeven] = useHook('');let [Eight,useEight] = useHook('');let [Nine,useNine] = useHook('');/*which player??*/;let [player,usePlayer] = useHook('X');let [playertitle,usePlayertitle] = useHook('Player 1');let [warning,useWarning] = useHook(false);let arrayTosend = [One,Two,Three,Four,Five,Six,Seven,Eight,Nine];function validateMove(num){let itemGetting = arrayTosend[num];if(!(itemGetting.aInternal === '')){useWarning(true);setTimeout(() => {useWarning(false)},2000);return(false)}};return (() => {      /* Basic Component Renderer */      let parent = 'body';      let components = [];      /* Function To Remove Component*/      (() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h1','Welcome To Tix Tax Toe!',parent, InternalUUID, undefined); components.push(ElementWeWant); })();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h2',['Current Player: ',playertitle],parent, InternalUUID, undefined); components.push(ElementWeWant); })();;booleanComponentRendering(warning, WarningComponent, [parent]);board(parent,arrayTosend,player,function FlickPlayer(num){if(validateMove(num) === false){return(false)};console.log(player.aInternal === 'O');if(player.aInternal === 'O'){usePlayer('X');usePlayertitle('Player 2');return(true)};if(player.aInternal === 'X'){usePlayer('O');usePlayertitle('Player 1');return(true)}});      return (() => {        if (typeof useUpdateArray !== 'undefined') {          removeComponents(components, useUpdateArray)        } else {          removeComponents(components)        }      })    })()}
function WarningComponent(Mainparent){console.log(Mainparent);return (() => {      /* Basic Component Renderer */      let parent = Mainparent;      let components = [];      /* Function To Remove Component*/      (() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('h3','A player has already selected this square!',parent, InternalUUID, 'Warning'); components.push(ElementWeWant); })();;(() => {let InternalUUID = uuidv4(); let ElementWeWant = ReactfulElement('style',' .Warning { color: #ff0000; } ',parent, InternalUUID, ""); components.push(ElementWeWant); })();;      return (() => {        if (typeof useUpdateArray !== 'undefined') {          removeComponents(components, useUpdateArray)        } else {          removeComponents(components)        }      })    })()}

function RouterRoot(){;GlobalCSS('body');tixTaxToe()}

window.addEventListener('load',() => {;RouterRoot();;WindowMonitor(RouterRoot)})