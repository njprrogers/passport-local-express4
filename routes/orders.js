module.exports = function(app) {
  
  const connection = require('../database/mysql-connect');
  // As with any middleware it is quintessential to call next()
  // if the user is authenticated
  const isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }
  
  /* GET Home Page */
  app.get('/orders', isAuthenticated, function(req, res){
    connection.query("select * from orders limit 10", function(err, rows) {
      console.log(rows);
      console.log("above row object");
  
      if (err) {
        console.log('We have an error on orders table ', err);
        return done(err);
      } 
      
      
      res.render('orders', { orders: rows });
    });

  });
}
