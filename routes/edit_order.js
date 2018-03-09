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

  app.get('/add-order', isAuthenticated, function(req, res){

    res.render('orders_form');

  })
  
  /* GET Home Page */
  app.get('/edit-order/:id', isAuthenticated, function(req, res){

    database.query("select * from orders where orderkey = " + database.connection.escape(req.params.id)).then((rows) => {
      return rows;
    })
    .then((order) => {
      console.log('order = ', order)    
      res.render('orders_form', { order: order[0] });    
    })
    .catch((err) => {
      console.log('We have an error on orders table ', err);
      res.flash('error', 'There has been an error reading the orders table')
      return;
    })
  })
  app.post('/edit-order/:id', isAuthenticated, function(req, res){
    console.log(req.body);
    database.query("update orders set oskyname = '" + req.body.oskyname + "' where orderkey = " + database.connection.escape(req.params.id))
    .then((order) => {
      console.log('order = ', order)
      res.status(200).json({status:"ok"});
      return order;
    })
    .catch((err) => {
      console.log('We have an error on orders table ', err);
      res.flash('error', 'There has been an error reading the orders table')
      return { error: err };
    })
  })
}
