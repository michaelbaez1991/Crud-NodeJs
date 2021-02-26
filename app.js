// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root'
// });

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;
//   console.log('The solution is: ', rows[0].solution);
// });

// connection.end();

const express = require('express');
const oApp = express();
const port = 3000
const mysql = require('mysql');

oApp.use(express.json()); 

const oMyConnection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'db_gatos'   
});

oApp.get('/gato', function(oReq, oRes) {
    var sSQLGetAll = "SELECT * FROM gatos";
    oMyConnection.query(sSQLGetAll, function(oError, oRows, oCols) {
        if(oError) {
            oRes.write(JSON.stringify({
                error: true,
                error_object: oError         
            }));
            oRes.end();
        } else {
            oRes.write(JSON.stringify(oRows));
            oRes.end();       
        }
    });
});

function CreateGATO(oDataGATO, oResponse) {  
    var sSQLCreate = "INSERT INTO gatos (nombre, raza, color, edad, peso) VALUES (";
    sSQLCreate += "'" + oDataGATO.nombre + "', ";
    sSQLCreate += "'" + oDataGATO.raza + "', ";
    sSQLCreate += "'" + oDataGATO.color + "', ";
    sSQLCreate += "'" + oDataGATO.edad + "', ";
    sSQLCreate += "'" + oDataGATO.peso + "')";
      
    oMyConnection.query(sSQLCreate, function(oError, oRows, oCols) {
        if(oError) {
            oResponse.write(JSON.stringify({
                error: true,
                error_object: oError
            }));
            oResponse.end();      
        } else {
            var iIDCreated = oRows.insertId;
            oResponse.write(JSON.stringify({
                error: false,
                idCreated: iIDCreated
            }));
            oResponse.end();      
        }    
    });
}   

function ReadGATO(oResponse) {
    var sSQLRead = "SELECT * FROM gatos";
    oMyConnection.query(sSQLRead, function(oError, oRows, oCols) {
        if(oError) {
            oResponse.write(JSON.stringify({
                error: true,
                error_object: oError
            }));
            oResponse.end();
        } else {
            oResponse.write(JSON.stringify({
                error: false,
                data: oRows
            }));
            oResponse.end();            
        }    
    });    
}

function UpdateGATO(oDataGATO, oResponse) {
    var sSQLUpdate = "UPDATE gatos SET ";
    if(oDataGATO.hasOwnProperty('nombre')) {
      sSQLUpdate += "nombre = '" + oDataGATO.nombre + "' ";
    }

    if(oDataGATO.hasOwnProperty('raza')) {
      sSQLUpdate += ", raza = '" + oDataGATO.raza + "' ";
    }

    if(oDataGATO.hasOwnProperty('color')) {
      sSQLUpdate += ", color = '" + oDataGATO.color + "' ";
    }

    if(oDataGATO.hasOwnProperty('edad')) {
      sSQLUpdate += ", edad = " + oDataGATO.edad + " ";
    }

    if(oDataGATO.hasOwnProperty('peso')) {
      sSQLUpdate += ", peso = " + oDataGATO.peso + " ";    
    }   

    sSQLUpdate += " WHERE id_gato = " + oDataGATO.idgato;
    console.log(sSQLUpdate);
    
    oMyConnection.query(sSQLUpdate, function(oErrUpdate, oRowsUpdate, oColsUpdate) {
      if(oErrUpdate) {
        oResponse.write(JSON.stringify({ 
          error: true,
          error_object: oErrUpdate
        }));
        oResponse.end();      
      } else {
        oResponse.write(JSON.stringify({
          error: false
        }));
        oResponse.end();
      }
    });
}

function DeleteGATO(oDataGATO, oResponse) {
    var sSQLDelete = "DELETE FROM gatoS WHERE id_gato = " + oDataGATO.idgato;
    oMyConnection.query(sSQLDelete, function(oErrDelete, oRowsDelete, oColsDelete) {
      if(oErrDelete) {
        oResponse.write(JSON.stringify({
          error: true,
          error_object: oErrDelete
        }));
        oResponse.end();
      } else {
        oResponse.write(JSON.stringify({
          error: false
        }));
        oResponse.end();      
      }    
    });  
}

oApp.post('/gato', function(oReq, oRes) {
    var oDataOP = {};
    var sOP = '';
    
    oDataOP = oReq.body.data_op;
    sOP = oReq.body.op;
    
    switch(sOP) {
        case 'CREATE':      
            CreateGATO(oDataOP, oRes);
        break;
        
        case 'READ':
            ReadGATO(oRes);
        break;
        
        case 'UPDATE':
            UpdateGATO(oDataOP, oRes);
        break;
        
        case 'DELETE':
            DeleteGATO(oDataOP, oRes);
        break;
        
        default:
            oRes.write(JSON.stringify({ 
                error: true, 
                error_message: 'Debes proveer una operación a realizar' 
            }));
            oRes.end();
        break;
    }   
});
 
oApp.listen(port, function(oReq, oRes) {
    console.log("Servicios web gestión entidad GATO activo, en puerto 3000");   
});