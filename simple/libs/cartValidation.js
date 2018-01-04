/**
 * Module dependencies
 */
 module.exports =
 {
 	checkWaivers: function(req, res, next) {
 		var cart = req.session.cart;
 		if(!cart) return next();
 		if(cart.some(function(item) {
 			return item.product.requiresWaiver;
 		})) {
 			cart.warnings = cart.warnings || [];
 			cart.warnings.push('nop');
 		}
 		next();
 	},
 	checkGuestCounts: function(req, res, next) {
 		var cart = req.session.cart;
 		if(!cart) return next();
 		if(cart.some(function(item) {
 			return item.guests > item.product.maximumGuests;
 		})) {
 			cart.warnings = cart.warnings || [];
 			cart.warnings.push('not enough place left');
 		}
 		next();
 	}
 };