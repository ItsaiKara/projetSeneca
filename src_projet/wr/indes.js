const restify = require('restify');
const bodyParser = require('body-parser');
const seneca = require('seneca')({ legacy: { transport: false } });

const server = restify.createServer();
server.use(bodyParser.json());

let listWr = [];
console.log("size: " + listWr.length);

seneca.add({role: 'api', cmd: 'createWR'}, function async(msg, respond) {
  const data = msg.body;
  // TODO : insérer le code pour enregistrer les données dans la base de données
  // Envoi de la réponse au client
  listWr.push(data);
  data.id = listWr.length;
  data.state = "created" 
  const response = {
    success: true,
    data: [data],
  };
  respond(null, response);
});

seneca.add({role: 'api', cmd: 'getWR'}, function async(msg, respond) {
  const id = msg.id;
  // TODO : insérer le code pour récupérer les données du WR correspondant à l'id dans la base de données
  // Envoi de la réponse au client
  const wr = listWr.find(w => w.id === id);
  if (!wr) {
    respond(null, { success: false, error: 'WR not found' });
  } else {
    respond(null, { success: true, data: [wr] });
  }
});

seneca.add({ role: 'api', cmd: 'updateWR' }, function async(msg, respond) {
  const id = msg.id;
  const data = msg.body;
  // TODO : insérer le code pour mettre à jour les données du WR correspondant à l'id dans la base de données
  // Envoi de la réponse au client
  const wrIndex = listWr.findIndex(w => w.id === id);
  if (wrIndex === -1) {
    respond(null, { success: false, error: 'WR not found' });
  } else {
    listWr[wrIndex] = listWr[wrIndex].compl_date = currentDate();
    listWr[wrIndex] = { ...listWr[wrIndex], ...data };
    respond(null, { success: true, data: [listWr[wrIndex]] });
  }
});

server.post('/api/wr', function await(req, res, next) {
  // Envoi de la commande 'createWR' à Seneca
  seneca.act({ role: 'api', cmd: 'createWR', body: req.body }, function await(err, result) {
    if (err) return next(err);
    res.send(result);
    return next();
  });
});

server.get('/api/wr/:id', function await(req, res, next) {
  const id = parseInt(req.params.id);
  // Envoi de la commande 'getWR' à Seneca
  seneca.act({ role: 'api', cmd: 'getWR', id: id }, function await(err, result) {
    if (err) return next(err);
    res.send(result);
    return next();
  });
});

server.put('/api/wr/:id', function await(req, res, next) {
  const id = parseInt(req.params.id);
  // Envoi de la commande 'updateWR' à Seneca
  seneca.act({ role: 'api', cmd: 'updateWR', id: id, body: req.body }, function await(err, result) {
    if (err) return next(err);
    //add success attribute
    result.success = true;
    res.send(result);
    return next();
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
