const restify = require('restify')
const bodyParser = require('body-parser')
const seneca = require('seneca')({ legacy: { transport: false } })

const server = restify.createServer()
server.use(bodyParser.json())
     
listWr = [];

seneca.add({role: 'api', cmd: 'createWR'}, function (msg, respond) {
    const data = msg.body;
    // TODO : insérer le code pour enregistrer les données dans la base de données
    // Envoi de la réponse au client
    listWr.push(data);
    const response = {
      success: true,
      data: [data],
      id: listWr.length
    };

    respond(null, response);
});
  
server.post('/api/wr', function (req, res, next) {
// Envoi de la commande 'createWR' à Seneca
    seneca.act({role: 'api', cmd: 'createWR', body: req.body}, function (err, result) {
        if (err) return next(err);
        res.send(result);
        return next();
    });
});
  


server.listen(3000, () => {
  console.log('Server started on port 3000')
})
