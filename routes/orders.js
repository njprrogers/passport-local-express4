module.exports = function(app) {
  
  const database = require('../database/mysql-connect');

  // As with any middleware it is quintessential to call next()
  // if the user is authenticated
  const isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }

  function getClientModel() {
    
    connection.query("select * from client limit 10", function(err, rows) {
      console.log(rows);
      console.log("above row object");
  
      if (err) {
        console.log('We have an error on client table ', err);
        return done(err);
      }
      return rows;  
    });

  }

  /* GET Home Page */
  app.get('/orders', isAuthenticated, function(req, res){

    database.query("select * from clients limit 1").then((rows) => {
      return rows;
    })
    .then((clients) => {
      console.log('in second promise', clients)
      database.query("select * from orders limit 10").then((rows) => {
        console.log(rows);
        console.log("above row object");
    
        res.render('orders', { orders: rows, clients: clients[0] });
        
      })
      .catch((err) => {
        console.log('We have an error on orders table ', err);
        res.flash('error', 'There has been an error reading the orders table')
        return;
      })
  })

  });
}
