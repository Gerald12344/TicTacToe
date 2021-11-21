// (c) - Harvey Randall 2020-2021

'use strict';
//Please don't steal took ages

//Big thanks to the https://github.com/jamiebuilds/the-super-tiny-compiler for insipration and help with the tokeniser and paser and other parts.

const logger = require("winston-color");
const fs = require('fs')
const settings = require("../harveySettings.json")
const path = require('path')
const headers = require('./niceStuff.json')
const browserify = require('browserify');


let modules = []

let commands = {}
let pluginDependecies = {}
let FileDependencies = []

function tokenizer(input) {
  let current = 0;
  let previous = ''
  let tokens = [];

  while (current < input.length) {
    let char = input[current];
    if (char === '<') {
      tokens.push({
        type: 'paren',
        value: '<',
      });
      current++;
      continue;
    }
    if (char === '=') {
      tokens.push({
        type: 'paren',
        value: '=',
      });
      current++;
      continue;
    }

    if (char === '>') {
      tokens.push({
        type: 'paren',
        value: '>',
      });
      current++;
      continue;
    }

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'number', value });
      continue;
    }
    if (char === '"') {
      let value = '';
      char = input[++current];
      while (char !== '"') {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: 'string', value });

      continue;
    }


    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char) || char === '.') {
      let value = '';
      while (LETTERS.test(char) || char === '.') {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'name', value });

      continue;
    }
    logger.error('Yikes, I dont know what this character is: ' + char);
    process.exit(1)
  }

  return tokens;
}
function parser(tokens) {
  let current = 0;
  function walk() {
    let token = tokens[current];

    if (token.type === 'name') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }
    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }
    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }
    if (token.type === 'paren' && token.value === '=') {
      token = tokens[++current];
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };
    }
    if (
      token.type === 'paren' &&
      token.value === '<'
    ) {
      token = tokens[++current];
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };
      token = tokens[++current];

      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== '>')
      ) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }
    logger.error(token.type);
    process.exit(1)
  }
  let ast = {
    type: 'Program',
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }
  return ast;
}


function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type];
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node);
        break;
      case 'CallExpression':
        traverseArray(node.params, node);
        break;
      case 'NumberLiteral':
      case 'StringLiteral':
        break;

      default:
        logger.error(node.type);
        process.exit(1)
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }
  traverseNode(ast, null);
}



function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: [],
  };

  ast._context = newAst.body;

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      },
    },

    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    CallExpression: {
      enter(node, parent) {


        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };
        node._context = expression.arguments;

        if (parent.type !== 'CallExpression') {
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }
        parent._context.push(expression);
      },
    }
  });
  return newAst;
}

function codeGenerator(node) {
  switch (node.type) {

    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression)
      );

    case 'CallExpression':
      switch (node.callee.name) {
        case 'add':
          return (node.arguments.map(codeGenerator).join(' + '))
        case 'subtract':
          return ('(' + node.arguments.map(codeGenerator)
            .join(' - ') + ')')
        case 'mutiply':
          return ('(' + node.arguments.map(codeGenerator)
            .join(' * ') + ')')
        case 'divide':
          return ('(' + node.arguments.map(codeGenerator)
            .join(' / ') + ')')
        case 'if':
          let ifStuff = node.arguments.map(codeGenerator)
          ifStuff.splice(0, 1).join(',')
          ifStuff.forEach((e, i) => {
            if ((i + 1) === ifStuff.length) return;
            ifStuff[i] = e.replace('"', '').replace('"', '')
          })
          let lasts = ifStuff[ifStuff.length - 1]
          ifStuff.splice(ifStuff.length - 1, 1)
          return (`if(${node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', '')}){${lasts}}`)
        case 'call':
          let propses = node.arguments.map(codeGenerator)
          propses.splice(0, 1).join(',')

          return (`${node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', '')}(${propses})`)
        case 'function':
          let propss = node.arguments.map(codeGenerator)
          propss.splice(0, 1).join(',')
          propss.forEach((e, i) => {
            if ((i + 1) === propss.length) return;
            propss[i] = e.replace('"', '').replace('"', '')
          })
          let last = propss[propss.length - 1]
          propss.splice(propss.length - 1, 1)
          return (`function ${node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', '')}(${propss.join(',')}){${last}}`)
        case 'Arrowfunc':
          let propsss = node.arguments.map(codeGenerator)
          propsss.forEach((e, i) => {
            propsss[i] = e.replace('"', '').replace('"', '')
          })
          let lastest = propsss[propsss.length - 1]
          propsss.splice(propsss.length - 1, 1)
          return (`(${propsss.join(',')}) => {${(node.arguments.map(codeGenerator)[node.arguments.map(codeGenerator).length - 1])}}`)
        case 'selfCallingFunction':
          let propssss = node.arguments.map(codeGenerator)
          propssss.forEach((e, i) => {
            propssss[i] = e.replace('"', '').replace('"', '')
          })
          propssss.splice(propssss.length - 1, 1)
          return (`((${propssss.join(',')}) => {${(node.arguments.map(codeGenerator)[node.arguments.map(codeGenerator).length - 1])}})(${propssss.join(',')});`)
        case 'sendOut':

          let inputs = (node.arguments.map(codeGenerator)[0]);
          if (node.arguments.map(codeGenerator).length > 1) {
            return (`console.log(${(node.arguments.map(codeGenerator)).join(",")})`)
          } else {
            return (`console.log(${inputs})`)
          }
        case 'else':
          return (`else{${node.arguments.map(codeGenerator)}}`)
        case 'promise':
          let promiseArray = node.arguments.map(codeGenerator)
          promiseArray.splice(0, 2)
          return (`return(new Promise((${node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', '')}, ${node.arguments.map(codeGenerator)[1].replace('"', '').replace('"', '')}) => {${promiseArray.join(';')}}))`)

        case 'iNeed':
          modules.push(node.arguments.map(codeGenerator))
          return (`require("${node.arguments.map(codeGenerator)}")`)
        case 'iWant':
          let data = fs.readFileSync(node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', ''), 'utf-8')
          let response = CompiledOtherFiles(data)
          return (response)
        case 'async':
          return (`async ${node.arguments.map(codeGenerator)}`)
        case 'wait':
          return (`await ${node.arguments.map(codeGenerator)}`)
        case 'new':
          return (`new ${node.arguments.map(codeGenerator)}`)

        case 'letsmake':
          let inputing = (node.arguments.map(codeGenerator)[1]);
          return (`let ${(node.arguments.map(codeGenerator)[0]).replace('"', '').replace('"', '')} = ${inputing}`)

        case 'object':
          if (node.arguments.map(codeGenerator).length === 0) {
            return (`{}`)
          }
          return (`{${node.arguments.map(codeGenerator)[0]}: ${node.arguments.map(codeGenerator)[1]}}`)
        case 'if':
          return (`if(${node.arguments.map(codeGenerator)[0]})`)
        case 'after':
          return (`.then(${node.arguments.map(codeGenerator)[0]})`)
        case 'error':
          return (`.catch(${node.arguments.map(codeGenerator)[0]})`)
        case 'reply':
          return (`return(${node.arguments.map(codeGenerator)[0]})`)
        case 'innerLoop':
          return (`{${node.arguments.map(codeGenerator).join(";")}}`)
        case 'body':
          return (`${node.arguments.map(codeGenerator).join(';')}`)
        case 'typeof':
          return (`typeof ${node.arguments.map(codeGenerator)[0]}`)
        case 'var':
          return (node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', ''))
        case 'return':
          return ('return')
        case 'ToNumber':
          return (node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', ''))
        case 'equal':
          return (`${node.arguments.map(codeGenerator)[0]} === ${node.arguments.map(codeGenerator)[1]}`)
        case 'notequal':
          return (`!(${node.arguments.map(codeGenerator)[0]} === ${node.arguments.map(codeGenerator)[1]})`)
        case 'and':
          return (`${node.arguments.map(codeGenerator)[0]} && ${node.arguments.map(codeGenerator)[1]}`)
        case 'true':
          return (true)
        case 'false':
          return (false)
        case 'loop':
          let using = node.arguments.map(codeGenerator)
          let lastes = using[using.length - 1]
          let variable = node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', '')
          return (`for(let ${variable}=0;${variable}<${node.arguments.map(codeGenerator)[1]};${variable}=${variable}+${node.arguments.map(codeGenerator)[2]}){${lastes}}`)
        case 'get':
          return (`document.getElementById(${node.arguments.map(codeGenerator)})`)
        case 'assign':
          return (`${node.arguments.map(codeGenerator)[0]} = ${node.arguments.map(codeGenerator)[1]}`)
        case 'string':
          return (`'${node.arguments.map(codeGenerator).map(e => { return `${e}`.replace("/\n/g", "").replace(/\s\s+/g, ' ') })}'`)
        case 'toString':
          return ("`${"+ node.arguments.map(codeGenerator).join("") + "}`")
        case 'array':
          return (`[${node.arguments.map(codeGenerator).join(',')}]`)
        case 'itterate':
          return (`${node.arguments.map(codeGenerator)[0]}[${node.arguments.map(codeGenerator)[1]}]`)
        case 'concat':
          return (`${node.arguments.map(codeGenerator).join('')}`)
        case 'null':
          return (`null`)
        case 'throwError':
          return (`throw new Error(${node.arguments.map(codeGenerator).join('')})`)
        case 'delete':
          return (`delete ${node.arguments.map(codeGenerator).join('')}`)
        case 'package':
          let dataIn = fs.readFileSync(settings.packagesFolder + "/" + node.arguments.map(codeGenerator)[0].replace('"', '') + "/index.harvey".replace('"', ''), 'utf-8')
          let response2 = CompiledOtherFiles(dataIn)
          return (response2)
        case 'pluginFetch':
          let dataIn3 = fs.readFileSync(settings.packagesFolder + "/" + node.arguments.map(codeGenerator)[0].replace('"', '').replace('"', ''), 'utf-8')
          let response3 = CompiledOtherFiles(dataIn3)
          return (response3)
      }
      if (!(commands[node.callee.name] === undefined)) {
        if (pluginDependecies[node.callee.name] === undefined) {
          pluginDependecies[node.callee.name] = true
          if (!(commands[node.callee.name].Dependencies() === false)) {
            FileDependencies.push(commands[node.callee.name].Dependencies())
          }
        }

        return commands[node.callee.name].Command(node.arguments.map(codeGenerator))
      }

    case 'Identifier':
      return node.name;

    case 'NumberLiteral':
      return node.value;
    case 'StringLiteral':
      return node.value;

    default:
      logger.error(node.type);
      process.exit(1)
  }
}

function CompiledOtherFiles(input) {
  let tokens = tokenizer(input);
  let ast = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);
  return output
}

function loadPlugins() {
  let pluginSettings = require(`../${settings.pluginsFolder}/${settings.pluginsSettings}`)
  let harvscript = require(`../${settings.pluginsFolder}/HS5/plugins.json`)
  pluginSettings.plugins.forEach(element => {
    commands[element.case] = require(`../${settings.pluginsFolder}/${element.file}`)
  })
  harvscript.plugins.forEach(element => {
    commands[element.case] = require(`../${settings.pluginsFolder}/${element.file}`)
  })
}

function uniq(a) {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}
function browserifyModules() {
  if (settings.browserify) {
    var b = browserify();
    modules.forEach((e) => {
      b.require(e)
    })
    if (!fs.existsSync(`${settings.outputFolder}/packages`)) {
      fs.mkdirSync(`${settings.outputFolder}/packages`);
    }
    let file = require('fs').createWriteStream(`./${settings.outputFolder}/packages/HarvScript_Bundle_1.js`);
    file.write(headers.headers + `
* 
*      * ____________________________________________________________________ *      
*      *                     (c) Harvey Randall - 2021                        *
*      *                   https://github.com/Gerald12344                     *
*      * This final contains all the JS imports required to use the website   *
*      * For lisencing and stuff check the github page, and start the project *
*      * ____________________________________________________________________ *
*  
* “A day may come when the courage of men fails, when we forsake our friends and break all bonds of fellowship, but it is not this day.“ 
* - Harvey Randall 2021
*/\n`)
    let stream = b.bundle().pipe(file)
    return new Promise(resolve => {
      stream.on('finish', () => {
        resolve()
      })
    })
  }

}

var JavaScriptObfuscator = require('javascript-obfuscator');
async function compiler(input) {
  modules = []
  if (settings.debug) {
    logger.debug(`Loading Plugins`)
  }
  loadPlugins()
  if (settings.debug) {
    logger.debug(`All Plugins loaded Successfully`)
  }

  console.log('\x1b[34m', 'Compiling Code Stand by...')
  console.log('\x1b[36m', '[                       ]')
  if (settings.debug) {
    logger.debug(`Tokenizing please hang on...`)
  }
  let tokens = tokenizer(input);
  console.log('\x1b[34m', 'Compiling Code Stand by...')
  console.log('\x1b[36m', '[======                 ]')
  if (settings.debug) {
    logger.debug(`Parsing please hang on...`)
  }
  let ast = parser(tokens);
  console.log('\x1b[34m', 'Compiling Code Stand by...')
  console.log('\x1b[36m', '[============           ]')
  if (settings.debug) {
    logger.debug(`Transforming please hang on...`)
  }
  let newAst = transformer(ast);
  console.log('\x1b[34m', 'Compiling Code Stand by...')
  console.log('\x1b[36m', '[==================     ]')
  if (settings.debug) {
    logger.debug(`Generating Code please hang on...`)
  }

  let output = codeGenerator(newAst);
  if (settings.debug) {
    logger.debug(`Cleaning up Dependencies`)
  }
  let Dependencies2 = uniq(FileDependencies)
  output = Dependencies2.join(';') + output

  if (settings.debugFile === true) {
    fs.writeFileSync(`./${settings.outputFolder}/${settings.debugFileLocation}/${settings.debugFileName}`, (output), (err) => {
      logger.error('Yikes, Error writing to debug file.');
      process.exit(1)
    })
  }
  let MainOut = output
  if (settings.obuscateOutput) {
    if (settings.debug) {
      logger.debug(`Obuscating and minifying output!`)
    }
    //console.log(Prepack.prepackSources([{filePath:'MainOutput', fileContents:JavaScriptObfuscator.obfuscate(output)}]))
    MainOut = (JavaScriptObfuscator.obfuscate(output, {
    }))
  }


  if (settings.debug) {
    logger.debug(`Writing to build file!`)
  }
  fs.writeFileSync(`./${settings.outputFolder}/${settings.outputFileName}`, headers.headers + '\n* Harvey Programming Compiled Stuff, you touch you break \n* For lisencing and for copy right stuff please check the legal stuff below \n* This is the compiled file and is optimised and obuscated if you want to see the compiled source code look at CompiledJS.js \n* --[[Code will start soon I promise]]-- \n* Look away its hard to understand. \n*/\n' + MainOut, (err) => {
    logger.error('Yikes, Error writing to ouput file.');
    process.exit(1)
  });
  if (settings.debug) {
    logger.debug(`Bundling all external modules!`)
  }
  await browserifyModules()
  console.log('\x1b[34m', 'Code Compiled.');
  console.log('\x1b[36m', '[=======================]');
  return output



}

const express = require('express');
const app = express()
app.use(express.json())
let lastUpdate = Date.now()
let compileStartTime = Date.now()

let setupCompiler = () => {
  app.get('/api/recompiling', (req, res) => {
    res.send(`${compileStartTime}`)
  })
  compileStartTime = Date.now()
  fs.readFile(`./${settings.inputFolder}/${settings.inputFile}`, 'utf8', async (err, data) => {
    let input = data
    try {
      let CompiledJS = await compiler(input)
    } catch (e) {
      logger.error(e)
      logger.warn("FATAL COMPLATION ERROR")
    }

    if (settings.evalOnCompile) {
      logger.warn(`Running with in a eval loop() for production builds please use ./${settings.outputFolder}/${settings.outputFileName}`)
      if (settings.debug) {
        logger.debug('To change this go to the harveySettings.json file and set evalOnFinish to false');
      }
      if (settings.debug) {
        logger.info('-----------------------[Compiler Successfull]-----------------------')
        logger.debug(`Thank you for using the .Harvey Programming Language. Happy Hacking.`)
        logger.debug(`Compiler competely successfully now attempting to run the code.`)
        logger.info('--------------------------------------------------------------------')
      }
      eval(CompiledJS);
    }
    lastUpdate = Date.now()
    if (settings.dev === true) {
      let text = fs.readFileSync(`./${settings.inputFolder}/public/index.html`, 'utf8').replace(/%build%/g, `${settings.outputFileName}`).replace(/%public%/g, `./public`).replace(/<!-- {{%Bundle%}} -->/g, `<script src="./packages/HarvScript_Bundle_1.js"></script>`)

      text = text + fs.readFileSync(`./compiler/devfiles.html`, 'utf8')

      if (!fs.existsSync(`${settings.outputFolder}/public`)) {
        fs.mkdirSync(`${settings.outputFolder}/public`);
      }



      //fs.writeFileSync(`./${settings.outputFolder}/devfiles.js`, fs.readFileSync(`./compiler/devfiles.js`, 'utf8'));

      fs.writeFileSync(`./${settings.outputFolder}/index.html`, text.replace(/\r?\n|\r/g, ""));

      const dir = fs.opendirSync(`${settings.inputFolder}/public/imports`)
      let dirent
      while ((dirent = dir.readSync()) !== null) {
        fs.writeFileSync(`./${settings.outputFolder}/public/${dirent.name}`, fs.readFileSync(`${settings.inputFolder}/public/imports/${dirent.name}`, 'utf-8'))
      }
      dir.closeSync()

      app.use(express.static(path.join(__dirname, `../dist`)))

      app.get('/api/lastupdate', (req, res) => {
        res.send(`${lastUpdate}`)
      })

      app.post("/api/error", (req, res) => {
        logger.error(`Web client reported error, ${req.body.data} `);
      })

      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, `../${settings.outputFolder}/index.html`));
      });



    }

  })
}
setupCompiler()
var chokidar = require('chokidar');

var watcher = chokidar.watch(`./${settings.inputFolder}`, { ignored: /^\./, persistent: true });
let startTime = Date.now()
let restart = () => {
  if (Date.now() - 5000 < startTime) { return }
  setupCompiler()
}
watcher
  .on('add', function (path) { logger.debug(`File added ${path}, starting recomplation`); restart() })
  .on('change', function (path) { logger.debug(`File updated ${path}, starting recomplation`); restart() })
  .on('unlink', function (path) { logger.debug(`File deleted ${path}, starting recomplation`);; restart() })
  .on('error', function (error) { logger.error('Error happened', error); })

app.listen(3000, () => logger.debug('App listening on port 3000!'));