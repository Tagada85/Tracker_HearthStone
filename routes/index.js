'use strict';
const Express = require('express');
const router = Express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Character = require('../models/Character');

// Character.findOne({name: 'Jaina'}, (err, character) => {
//     if(err) throw err;
//     character.image = 'jaina-small.jpg';
//     character.description = `When it comes to turning mana into
//      OH GOD IT BURNS, Jaina is second to none. Her decks include
//       plenty of direct damage spells she will gleefully hurl at 
//       her opponents, including some very potent board clears like 
//       Arcane Explosion and Flamestrike. Add to that a Hero Power 
//       that makes short work of small minions and a varied assortment 
//       of Secrets, and you’ve got yourself a versatile, deadly opponent.`;

//     character.save();
// });

// Character.findOne({name: 'Rexxar'}, (err, character) => {
//     if(err) throw err;
//     character.image = 'rexxar-small.jpg';
//     character.description = `Music soothes the savage beast, and to Rexxar’s ears there can be no sweeter music than the sound of his beast minions tearing into their prey. He’s deep and paradoxical, is what we’re saying. Rexxar has access to buffs that turn even meek minions into fearsome killing machines, and he takes down whatever targets his beasts leave for him with his quiver full of direct damage spells. The hunt is on!`;
//     character.save();
// });

// Character.findOne({name: 'Anduin'}, (err, character) => {
//     if(err) throw err;
//     character.image = 'anduin-small.jpg';
//     character.description = `We know what you’re thinking: he’s a priest, what’s he gonna do – heal me to death? It’s true that Anduin has exceptionally strong healing spells in his deck, but his Shadow spells will wipe that grin right off your face in no time flat. And then he’ll use his excellent board control spells like Mind Control to finish you off. With your own minions.`;
//     character.save();
// });

// Character.findOne({name: 'Malfurion'}, (err, character) => {
//     if(err) throw err;
//     character.image = 'malfurion-small.jpg';
//     character.description = 'Versatility is the name of the game for Malfurion (well, no, it’s technically still Hearthstone, but you get what we’re saying). Many of his spells can have one of two effects, and even some of his minions can shapeshift to meet the tactical needs of the moment. He can generate mana quickly and even leapfrog his opponent, allowing Malfurion to bring powerful damage spells and board clears to bear. Heh. Bear.';
//     character.save();
// });

// Character.findOne({name: 'Valeera'}, (err, character) => {
//     if(err) throw err;
//     character.image = 'valeera-small.jpg';
//     character.description = 'Rogues are masters of sneak attacks, tradecraft, and subterfuge, and Valeera is no exception. Not only does her deck include excellent direct damage spells and potent removal abilities, her cards can also combo off each other for deadly effect. To make matters worse (for her opponents), her ability to summon a dagger means that in a pinch this nimble rogue can easily take matters into her own hands.';
//     character.save();
// });

// Character.findOne({name: 'Garrosh'}, (err, character) => {
//     if(err) throw err;
//     character.image = 'garrosh-small.jpg';
//     character.description = 'As one of the most formidable warriors Azeroth has ever seen, the things Garrosh brings to the table include war axes, plenty of bloodthirsty minions, and severe anger management issues. That’s not hyperbole – Garrosh’s deck literally thrives on dealing AND receiving damage. And don’t be surprised if Garrosh makes his minions charge right at you in a blood-fueled craze.';
//     character.save();
// });

// Character.findOne({name: 'Uther'}, (err, character) => {
//     if(err) throw err;
//     character.image = 'uther-small.jpg';
//     character.description = 'Suppose you’re a minion. Whose deck would you rather be in: Gul’dan, who will likely feed you to his demons, or Uther, who will buff you, heal you, and summon lots of reinforcements to the field? Thought so. Uther can make a weak minion hit like a truck, and a strong minion whimper with regret. He also has a practically unlimited supply of Silver Hand recruits at his disposal, so he’ll never run out of minions.';
//     character.save();
// });

// Character.findOne({name: "Gul'Dan"}, (err, character) => {
//     if(err) throw err;
//     character.image = 'guldan-small.jpg';
//     character.description = 'Demonic magic is powerful, but often carries a hefty price. Gul’dan probably knows a thing or two about that. He has access to a staggering number of demonic minions, but even though they are powerful and often cheap to summon, they always find a way to make up for the difference. Gul’dan can establish card advantage quite easily thanks to his Hero Power, which makes the old warlock a terrible foe.';
//     character.save();
// });

// Character.findOne({name: 'Thrall'}, (err, character) => {
//     if(err) throw err;
//     character.image = 'thrall-small.jpg';
//     character.description = 'What’s the next logical step after single-handedly saving the world from utter destruction for, like, the umpteenth time? Sit down and play some cards, of course! Thrall’s deck is a merry bag of assorted buffs, damage spells, healing spells, and some tough minions to round things out. Expect to be surprised when going up against the Horde’s former warchief and his well-balanced arsenal of spells and minions.';
//     character.save();
// });



//GET Routes

router.use('*', (req, res, next) => {
    req.username = 'test123';
    next();
});

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
    User.findOne({username: req.username}, (err, user) =>{
       if (err) return next(err);
        res.render('decks', {decks: user.decks});
    });
});

//GET Stats
router.get('/stats', (req, res, next) => {
    User.findOne({username: req.username}, (err,user) => {
       if(err) return next(err);
        res.render('stats', {records: user.gamesRecord});
    });
});

//GET NewGame
router.get('/newgame', (req, res, next) => {
    let charactersPromise = Character.find().exec();
    charactersPromise.then( characters => {
        User.findOne({username: req.username}, (err, user) => {
            if(err) return next(err);
            res.render('newgame', {characters: characters, decks:user.decks});
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
            res.render('newgame', {message: 'Game was saved', records: user.gamesRecord});
        });
    }).catch( (err)=> {
        return next(err);
    });
});

//POST New Deck
router.post('/decks', (req, res, next) => {
    let deckName = req.body.deckName;
    let classDeck = req.body.classDeck;
    let deckDescription = req.body.deckDescription;
    let newDeck = {
        deckName: deckName,
        classDeck: classDeck,
        description: deckDescription
    };
    User.findOne({username: req.username}, (err, user) => {
       if(err) return next(err);
        user.decks.push(newDeck);
        user.save();
        res.render('decks', {msg: 'Deck Saved!', decks: user.decks});
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


module.exports = router;
