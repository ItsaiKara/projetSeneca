const Seneca = require('seneca')

// obtention d'une instance de Seneca
var seneca = Seneca()

var count = 0 // compteur local au service

// definition d'un plugin (constituant ici le microservice)
var counter = function (options) {
  // ici definition d'un accesseur pour montrer
  // comment recuperer les valeurs d'un message
  this.add('counter:set,value:*', function (msg, done) {
    count = msg.value
    done(null, {response: {operation:msg.counter, value:msg.value}})
  })
  // A la réception du message counter:inc 
  // déclencher l'incrémentation du compteur...
  this.add('counter:inc', function (msg, done) {
    count = count + 1
    console.log('counter value = ' + count)
    done(null, {value: count})
  })

  this.add('counter:dec', function (msg, done) {
    count = count - 1
    done(null, {value: count})
  })

  return 'counter' // nom du plugin
}

seneca.use(counter) // enregistrement du plugin ds Seneca

// CODE DE TEST 
// envoi ASYNCHRONE du message counter:inc plugin counter
// (absence de callback associé à l'appel)
seneca.act('counter:inc')

// délai de 1000 ms (pour s'assurer que l'incrémentation a bien été faite)
// avant l'envoi SYNCHRONE du message counter:get ...
setTimeout(function () {
  seneca.act('counter:dec', function (err, result) {
    console.log('counter value = ' + result.value)
  })
}, 1000)

// pour tester en mode interactif le service counter :
// - le lancer avec : node counter.js (apres avoir fait un 'npm install')
// - puis dans un terminal : telnet (ou nc) localhost 10021
seneca.use('repl', {port: 10021})

// a decommenter lors de l'utilisation de RESTcounter
// mais il faudra alors commenter la ligne du dessus (repl)
//seneca.listen(4000)
