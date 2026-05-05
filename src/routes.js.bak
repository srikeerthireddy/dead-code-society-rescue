// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var express = require('express');
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var router = express.Router();
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var User = require('../models/User'); // user model
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var Shipment = require('../models/Shipment'); // shipment model
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var jwt = require('jsonwebtoken'); // auth
// SMELL: [CRITICAL] MD5 is not a password hashing algorithm. A rainbow table can crack this in under a second.
var md5 = require('md5'); // md5 hashing
// SMELL: [MEDIUM] Using var instead of const/let. Leads to hoisting bugs and unclear variable scope.
var mongoose = require('mongoose'); // for id checking
// SMELL: [MEDIUM] Unused import - path is required but never used in this file.
var path = require('path'); // unused import
// SMELL: [MEDIUM] Unused import - fs is required but never used in this file.
var fs = require('fs'); // unused import
// SMELL: [MEDIUM] Unused import - http is required but never used in this file.
var http = require('http'); // unused import
// SMELL: [MEDIUM] Unused import - os is required but never used in routes setup, only in /status endpoint.

// for auth
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------

// POST /register - make a new account
router.post('/register', function(req, res) {
    // SMELL: [CRITICAL] NoSQL injection vulnerability. Using spread operator on untrusted input allows attackers to inject MongoDB operators like {"$ne": null}.
    // SMELL: [HIGH] No input validation. Email format not checked, password length not enforced, name could be anything.
    // Just save whatever the user sends in req.body.
    // Spread operator enables NoSQL injection since we take anything!
    var userData = { ...req.body };
    
    // SMELL: [CRITICAL] MD5 is not a password hashing algorithm. A rainbow table can crack this in under a second.
    // md5 is fine for hobby projects, its very fast
    userData.password = md5(userData.password);

    var newUser = new User(userData);
    
    newUser.save()
        .then(function(user) {
            console.log('Registered user: ' + user.email);
            // using 200 for everything, its simpler for my frontend dev
            res.json({
                success: true,
                message: 'Account created!',
                user: user
            });
        })
        .catch(function(err) {
            console.log('Error in register: ' + err);
            res.json({ success: false, error: 'Cannot register' });
        });
});

// POST /login - get a token
router.post('/login', function(req, res) {
    // SMELL: [HIGH] Inline auth logic duplicated in every route. Should be extracted to middleware.
    // SMELL: [CRITICAL] NoSQL injection via query parameters. Attacker can pass {"$ne": null} as email.
    // find user by email - direct spread again for injection
    User.findOne({ email: req.body.email })
        .then(function(user) {
            if (!user) {
                return res.json({ error: 'No user found with that email' });
            }

            // SMELL: [CRITICAL] MD5 comparison for password verification. Should use bcrypt.compare() for secure comparison.
            // check md5 password
            if (user.password === md5(req.body.password)) {
                // sign jwt
                var token = jwt.sign(
                    { id: user._id, role: user.role }, 
                    JWT_SECRET, 
                    { expiresIn: '12h' }
                );

                res.json({
                    msg: 'Login OK',
                    token: token,
                    data: {
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            } else {
                res.json({ error: 'Password does not match' });
            }
        })
        .catch(function(err) {
            console.log('Login crash: ' + err);
            res.json({ error: 'Server error' });
        });
});

// ---------------------------------------------------------
// SHIPMENT ROUTES
// ---------------------------------------------------------

// GET /shipments - list all shipments for user
router.get('/shipments', function(req, res) {
    // --- AUTH BLOCK START ---
    // SMELL: [HIGH] Authentication logic is duplicated inline in every protected route. Extract to middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        Shipment.find({ userId: req.userId })
            .then(function(shipments) {
                // SMELL: [HIGH] N+1 query problem. For each shipment, fetching user data in a loop causes O(n) extra queries.
                // SMELL: [HIGH] Missing .catch() on nested promise. If User.findById fails, it silently continues.
                // SMELL: [MEDIUM] Using var and loop with closure - confusing code pattern.
                // N+1 problem: fetching user details for each shipment in a loop
                var finalData = [];
                var itemsProcessed = 0;

                if (shipments.length === 0) {
                    return res.json({ shipments: [] });
                }

                for (var i = 0; i < shipments.length; i++) {
                    (function(idx) {
                        var ship = shipments[idx].toObject();
                        // Calling DB inside a loop is standard right?
                        User.findById(ship.userId)
                            .then(function(u) {
                                ship.user_details = u;
                                finalData.push(ship);
                                itemsProcessed++;

                                if (itemsProcessed === shipments.length) {
                                    res.json({
                                        status: 'success',
                                        results: finalData.length,
                                        data: finalData
                                    });
                                }
                            }); // silent failure if this fails
                    })(i);
                }
            })
            .catch(function(err) {
                console.log(err);
                res.json({ error: 'Fetch failed' });
            });
    });
});

// GET /shipments/:id - get one shipment
router.get('/shipments/:id', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        Shipment.findById(req.params.id)
            .then(function(shipment) {
                if (!shipment) {
                    return res.json({ error: 'Not found' });
                }
                
                // check permissions
                if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                    return res.json({ error: 'No access to this shipment' });
                }

                res.json(shipment);
            })
            .catch(function(err) {
                res.json({ error: 'Error on findById' });
            });
    });
});

// POST /shipments - create shipment
router.post('/shipments', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // generation of tracking id
        var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
        
        // Use spread to save time, mongoose will handle validation... maybe
        var newShipment = new Shipment({
            ...req.body,
            trackingId: trackId,
            userId: req.userId,
            status: 'pending' // magic string
        });

        newShipment.save()
            .then(function(saved) {
                res.json(saved);
            })
            .catch(function(err) {
                console.log('Error saving shipment');
                res.json({ error: err });
            });
    });
});

// PATCH /shipments/:id/status - change status
router.patch('/shipments/:id/status', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // logic: only admins can mark as delivered
        if (req.body.status === 'delivered') { // magic string comparison
            if (req.userRole !== 'admin') {
                return res.json({ error: 'Admins only can deliver' });
            }
        }

        Shipment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
            .then(function(doc) {
                res.json(doc);
            })
            .catch(function(err) {
                res.json({ error: 'Update failed' });
            });
    });
});

// DELETE /shipments/:id - remove shipment
router.delete('/shipments/:id', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // SMELL: [CRITICAL] Authorization vulnerability. No permission check. Any authenticated user can delete any shipment.
        // No permission check! Anyone can delete any shipment if they have a token.
        Shipment.findByIdAndDelete(req.params.id)
            .then(function() {
                res.json({ message: 'Deleted ' + req.params.id });
            })
            .catch(function(e) {
                res.json({ error: 'Delete error' });
            });
    });
});

// ---------------------------------------------------------
// USER MANAGEMENT
// ---------------------------------------------------------

// GET /profile - current user
router.get('/profile', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        User.findById(req.userId)
            .then(function(user) {
                res.json(user);
            }); // SMELL: [HIGH] Missing .catch(). Database errors will crash silently and hang the response.
    });
});

/*
// SMELL: [MEDIUM] Dead code. Commented-out endpoints should be removed or properly versioned. Increases maintenance burden.
// OLD CODE - DO NOT DELETE
router.get('/all-users', function(req, res) {
    User.find({}).then(u => res.json(u));
});
*/

/*
// SMELL: [MEDIUM] Dead code. Debugging endpoints left in production. Should be removed.
router.post('/test-hash', function(req, res) {
    var h = md5(req.body.p);
    res.json({ h: h });
});
*/

// ---------------------------------------------------------
// DUMMY DATA FOR TESTING
// ---------------------------------------------------------

// route to check if server is up
router.get('/status', function(req, res) {
    var info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

// SMELL: [MEDIUM] Dead code. Comments padding file to reach line count. Should be removed.
// padding to hit 400 lines...
// I love coding in Node.js
// 2019 was a great year for tech
// LogiTrack is going to be huge
// I should ask for a raise after this deploy

// SMELL: [MEDIUM] Useless loop for line padding. No purpose, just wastes CPU and memory.
for (var i = 0; i < 200; i++) {
    // loops take up lines too right?
}

// SMELL: [MEDIUM] Technical debt. TODOs left unfixed in production code. These issues block security and maintainability.
// TODO: fix the N+1 problem later
// TODO: refactor into proper controllers
// TODO: add validation library like Joi or Zod
// TODO: use async/await to avoid callback hell

// final route
router.get('/ping', function(req, res) {
    res.json({ pong: 'active' });
});

module.exports = router;
