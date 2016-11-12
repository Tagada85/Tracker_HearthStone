'use strict';
const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Character = require('../models/Character');


//test middleware
//DELETE BEFORE PROD
router.use('*', (req, res, next) => {
    req.username = 'test123';
    Character.find({}, (err, characters) => {
        if(err) return next(err);
        req.characters = characters;
        next();
    });
});

router.use('/stats', (req, res, next) => {
    User.findOne({username: req.username}, (err, user)=> {
        if(err) return next(err);
        req.gamesRecord = user.gamesRecord;
        req.decks = user.decks;
        next();
    });
});

//GET Routes
//HomePage
router.get('/', (req, res, next)=>{
    Character.find({}, (err, characters) => {
        if(err) return next(err);
        res.render('index', {characters: characters});
    });
});

// Character Description
router.get('/class/:name', (req, res ,next)=>{
    let name = req.params.name;
    Character.findOne({name: name}, (err, character) => {
        if(err) return next(err);
        res.render('class', {character: character});
    });
});

//GET Decks
router.get('/decks', (req, res, next) => {
    let charactersPromise = Character.find().exec();
    charactersPromise.then( characters => {
        User.findOne({username: req.username}, (err, user) =>{
            if (err) return next(err);
            res.render('decks', {decks: user.decks, characters: characters});
        });
    });
});

//GET Stats
router.get('/stats', (req, res, next) => {
    let charactersPromise = Character.find().exec();
    charactersPromise.then( characters => {
        User.findOne({username: req.username}, (err,user) => {
            if(err) return next(err);
            res.render('stats',
            {records: user.gamesRecord,
            decks: user.decks,
            characters: characters
            });
        });
    });
});

router.post('/stats/', (req, res, next) => {
    let filter = req.body.classPlayed || req.body.deckUsed;
    let filterIsClass = req.body.filterIsClass;
    let filterPromise = filterGames(filter, req.gamesRecord, filterIsClass);
    filterPromise.then( filteredGames => {
        console.log(filteredGames);
        res.render('stats',{
            characters: req.characters,
            records: req.gamesRecord,
            decks: req.decks,
            filtered : filteredGames
        });
    }).catch( err => {
        return next(err);
    });
});

//GET NewGame
router.get('/newgame', (req, res, next) => {
    let charactersPromise = Character.find().exec();
    charactersPromise.then( characters => {
        User.findOne({username: req.username}, (err, user) => {
            if(err) return next(err);
            res.render('newgame',
            {
                characters: characters,
                 decks:user.decks,
                  records: user.gamesRecord
              });
        });
    });
});

//GET Arena
router.get('/arena', (req, res, next) => {
    let charactersPromise = Character.find().exec();
    charactersPromise.then((characters) => {
        User.findOne({username: req.username}, (err, user) => {
           if(err) return next(err);
            res.render('arena', {runs: user.arenaRuns, characters: characters});
        });
    });
});

//GET Profile
router.get('/profile', (req, res, next) => {
    User.findOne({username: req.username}, (err, user) => {
        if(err) return next(err);
        res.render('profile', {user:user});
    });
});

router.get('*', (req, res, next) => {
    res.render('notFound');
});

// POST Routes

//POST New Game
router.post('/newgame', (req, res, next) => {
    let classPlayed = req.body.classPlayed;
    let classOpponent = req.body.classOpponent;
    let deckUsed = req.body.deckUsed;
    let outcome = req.body.outcome;

    let deckPromise = getDeckSchema(req.username, deckUsed);
    deckPromise.then((deck) => {
        //check if deck Class is equal to classPlayed
        if(deck.classDeck !== classPlayed){
            const err = new Error('The class you played doesn\'t match the deck\'s class.');
            err.status = 400;
            return next(err);
        }
        let newGame = {
            classPlayed : classPlayed,
            classOpponent: classOpponent,
            outcome: outcome,
            deckUsed: deck //enter the Schema, not just the deck's title
        };

        User.findOne({username: req.username}, (err, user) => {
            if(err) return next(err);
            user.gamesRecord.push(newGame);
            user.save();
            res.render('newgame',
            {
                message: 'Game was saved',
                records: user.gamesRecord,
                decks: user.decks,
                characters: req.characters
            });
        });
    }).catch( (err)=> {
        return next(err);
    });
});

//POST New Deck
router.post('/decks', (req, res, next) => {
    let deckName = req.body.deckName;
    let classDeck = req.body.classDeck;
    let deckDescription = req.body.description;
    let newDeck = {
        deckName: deckName,
        classDeck: classDeck,
        description: deckDescription
    };
    User.findOne({username: req.username}, (err, user) => {
        if(err) return next(err);
        user.decks.push(newDeck);
        user.save();
        res.render('decks', {message: 'Deck Saved!', decks: user.decks, characters: characters});
    });
});

//POST New Arena Run
router.post('/arena', (req, res, next) => {
    let arenaRun = {
        numberOfWins: parseInt(req.body.wins),
        classPlayed : req.body.classPlayed
    };
    let charactersPromise = Character.find().exec();
    charactersPromise.then((characters) => {
        User.findOne({username: req.username}, (err, user) => {
            if(err) return next(err);
            user.arenaRuns.push(arenaRun);
            user.save();
            res.render('arena', {
                characters: characters,
                msg: 'Successfully saved arena run',
                runs: user.arenaRuns
            });
        });
    });
});
//Authentification routes (Twitter, GitHub, Gmail)

//DELETE Routes

//DELETE Games (Reset)
router.delete('/stats', (req, res, next) => {
   User.findOne({username: req.username}, (err, user) => {
       if (err) return next(err);
       user.gamesRecord = [];
       user.save();
       res.render('stats', {msg: 'Reset completed!', records: user.gameRecords});
   });
});

function getDeckSchema(username, deckUsed){
    let deckPromise = new Promise(
        function(resolve, reject){
            User.findOne({username: username}, (err, user) => {
                if(err) return next(err);
                user.decks.map((deck) => {
                    if(deck.deckName == deckUsed){
                        resolve(deck);
                    }
                });
                const promiseErr = new Error('An error occured while we tried to save this game. Please try later');
                promiseErr.status = 400;
                reject(promiseErr);
            });
        }
    );
    return deckPromise;
}

function filterGames(filter, games, filterIsClass){
    let filteredRecords = [];
    let filterPromise = new Promise(
        (resolve, reject) => {
            if(filterIsClass == 'true'){
                games.map( game => {
                    if(game.classPlayed == filter){
                        filteredRecords.push(game);
                    }
                });
                resolve(filteredRecords);
            }else if(filterIsClass == 'false'){
                games.map( game => {
                    if(game.deckUsed == filter){
                        filteredRecords.push(game);
                    }
                });
                resolve(filteredRecords);
            }else{
                const promiseErr = new Error("We couldn't filter your games at this moment!");
                promiseErr.status = 400;
                reject(promiseErr);
            }
        }
    );
    return filterPromise;
}


module.exports = router;
