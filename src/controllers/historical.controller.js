const db = require("../database-MySQL");

module.exports = class historical {
  static getHistTramos(data, callback) {
    var consultaTramos = `SELECT c.Linea, SUM(c.Residencial + c.Comercial + c.Industrial) AS consumo, SUM(p.Residencial + p.Comercial + p.Industrial) AS perdidas, SUM(co.Residencial + co.Comercial + co.Industrial) AS costo FROM consumo_tramo c JOIN costos_tramo co ON c.Fecha = co.Fecha AND c.Linea = co.Linea JOIN perdidas_tramo p ON c.Fecha = p.Fecha AND c.Linea = p.Linea WHERE c.Fecha BETWEEN '${data.fechainicial}' AND '${data.fechafinal}' GROUP BY c.Linea ORDER BY c.Linea;`;

    db.query(consultaTramos, (err, resp) => {
      if (err) {
        callback(err);
      }
      callback(resp);
    });
  }

  static getHistCliente(data, callback) {
    var consultaCliente = `SELECT c.Linea, SUM(c.Residencial) AS consumo_residencial, SUM(c.Comercial) AS consumo_comercial, SUM(c.Industrial) AS consumo_industrial, SUM(p.Residencial) AS perdidas_residencial, SUM(p.Comercial) AS perdidas_comercial, SUM(p.Industrial) AS perdidas_industrial, SUM(co.Residencial) AS costo_residencial, SUM(co.Comercial) AS costo_comercial, SUM(co.Industrial) AS costo_industrial FROM consumo_tramo c JOIN costos_tramo co ON c.Fecha = co.Fecha AND c.Linea = co.Linea JOIN perdidas_tramo p ON c.Fecha = p.Fecha AND c.Linea = p.Linea WHERE c.Fecha BETWEEN '${data.fechainicial}' AND '${data.fechafinal}' GROUP BY c.Linea ORDER BY c.Linea`;

    db.query(consultaCliente, (err, resp) => {
      if (err) {
        callback(err);
      }
      callback(resp);
    });
  }

  /*
  static getTramosCliente(data, callback) {
    var consultaTramosCliente = `SELECT TipoConsumo, Linea, Perdidas FROM ( SELECT "Residencial" AS TipoConsumo, pt.Linea, pt.Residencial AS Perdidas FROM perdidas_tramo pt WHERE pt.Fecha BETWEEN '${data.fechainicial}' AND '${data.fechafinal}' UNION ALL SELECT "Comercial" AS TipoConsumo, pt.Linea, pt.Comercial AS Perdidas FROM perdidas_tramo pt WHERE pt.Fecha BETWEEN '${data.fechainicial}' AND '${data.fechafinal}' UNION ALL SELECT "Industrial" AS TipoConsumo, pt.Linea, pt.Industrial AS Perdidas FROM perdidas_tramo pt WHERE pt.Fecha BETWEEN '${data.fechainicial}' AND '${data.fechafinal}' ) AS combined_data ORDER BY TipoConsumo, Perdidas DESC LIMIT 20`;

    db.query(consultaTramosCliente, (err, resp) => {
      if (err) {
        callback(err);
      }
      callback(resp);
    });
  }
  */


  //MODIFICADO
// Adicional a la <fechainicial> y <fechafinal>
// recibe:
//     <offset>:number, desde donde devuelve los datos
//     <limit>: number, limite de datos por consulta
//     <tramo>: string, con el tramo a consultar, "" para consultar todos
  static getAllHistTramo(data, callback) {
    const { fechainicial, fechafinal, offset, limit, tramo } = data;

    const count = `SELECT IF(linea_exists, total_linea, total_total) AS total
    FROM (
      SELECT EXISTS (
        SELECT 1
        FROM perdidas_tramo
        WHERE Linea = '${tramo}'
      ) AS linea_exists,
      IFNULL(
        (SELECT COUNT(*) FROM perdidas_tramo WHERE Linea = '${tramo}' AND Fecha BETWEEN '${fechainicial}' AND '${fechafinal}'),
        0
      ) AS total_linea,
      (SELECT COUNT(*) FROM perdidas_tramo WHERE Fecha BETWEEN '${fechainicial}' AND '${fechafinal}') AS total_total
    ) AS counts;
    `;
    const query = `SELECT TipoConsumo, Linea, Perdidas
    FROM (
      SELECT "Residencial" AS TipoConsumo, pt.Linea, pt.Residencial AS Perdidas
      FROM perdidas_tramo pt
      WHERE pt.Fecha BETWEEN '${fechainicial}' AND '${fechafinal}' AND (pt.Linea = '${tramo}' OR '${tramo}' NOT IN (SELECT DISTINCT Linea FROM perdidas_tramo WHERE Fecha BETWEEN '${fechainicial}' AND '${fechafinal}'))
      UNION ALL
      SELECT "Comercial" AS TipoConsumo, pt.Linea, pt.Comercial AS Perdidas
      FROM perdidas_tramo pt
      WHERE pt.Fecha BETWEEN '${fechainicial}' AND '${fechafinal}' AND (pt.Linea = '${tramo}' OR '${tramo}' NOT IN (SELECT DISTINCT Linea FROM perdidas_tramo WHERE Fecha BETWEEN '${fechainicial}' AND '${fechafinal}'))
      UNION ALL
      SELECT "Industrial" AS TipoConsumo, pt.Linea, pt.Industrial AS Perdidas
      FROM perdidas_tramo pt
      WHERE pt.Fecha BETWEEN '${fechainicial}' AND '${fechafinal}' AND (pt.Linea = '${tramo}' OR '${tramo}' NOT IN (SELECT DISTINCT Linea FROM perdidas_tramo WHERE Fecha BETWEEN '${fechainicial}' AND '${fechafinal}'))
    ) AS combined_data
    ORDER BY TipoConsumo, Perdidas ASC
    LIMIT ${offset}, ${limit};`;

    db.query(count, (err, resp) => {
      if (err) {
        return callback(err);
      }

      const total = resp[0].total;

      db.query(query, (err, dataResult) => {
        if (err) {
          return callback(err);
        }

        const response = {
          registros: total,
          datos: dataResult,
        };

        callback(response);
      });
    });
  }
};
