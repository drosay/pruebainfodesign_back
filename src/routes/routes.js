const express = require('express');
const router = express.Router();
const historical = require('../controllers/historical.controller');

router.get('/', (req, res) => {
    res.json({
        status: 200,
    })
});

router.post('/tramos', async (req, res) => {
    await historical.getHistTramos(req.body, (resp) =>{
        res.json(resp)
    });
});

router.post('/cliente', async (req, res) => {
  await historical.getHistCliente(req.body, (resp) =>{
      res.json(resp)
  });
});


//MODIFICADO
// Adicional a la <fechainicial> y <fechafinal>
// recibe:
//     <offset>:number, desde donde devuelve los datos
//     <limit>: number, limite de datos por consulta
//     <tramo>: string, con el tramo a consultar, "" para consultar todos

router.post('/tramos-cliente', async (req, res) => {
  await historical.getAllHistTramo(req.body, (resp) =>{
      res.json(resp)
  });
});

module.exports = router;