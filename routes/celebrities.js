const router = require('express').Router();
const Celebrity = require('../models/Celebrity.model');

router.get('/add-celebrity', (req, res, next) => {
    res.render('celebrities/new-celebrity.hbs');
})

router.post('/add-celebrity', (req, res, next) => {
    let { name, occupation, catchPhrase } = req.body;

    Celebrity.findOne({name: name})
    .then((foundCelebrity) => {
        if (foundCelebrity) {
            res.render('celebrities/new-celebrity.hbs', {errMessage: 'Celebrity exists. Try Again'});
        }
        else{
            Celebrity.create({
                name,
                occupation,
                catchPhrase
            })
            .then(() => {
                res.redirect('/celebrities/all-celebrities')
            })
        }
    })
    .catch((err) => {
        console.log(err);
        next(err);
    })
})

router.get('/all-celebrities', (req, res, next) => {
    Celebrity.find()
    .then((celebrities) => {
        res.render('celebrities/celebrities.hbs', {celebrities});
    })
    .catch((err) => {
        console.log(err);
    })
});

router.get('/all-celebrities/:id', (req, res, next) => {
    Celebrity.findById(req.params.id)
    .then((celebrity) => {
        res.render('celebrities/celebrity-details.hbs', celebrity);
    })
    .catch((err) => {
        next(err);
    });

});

router.post('/:id/delete', (req, res, next) => {
    Celebrity.findByIdAndDelete(req.params.id)
    .then(() => {
        res.redirect('/celebrities/all-celebrities')
    })
    .catch((err) => {
        next(err);
    });
});

router.get('/:id/edit', (req, res, next) => {
    Celebrity.findById(req.params.id)
    .then((celebrity) => {
        res.render('celebrities/edit-celebrity.hbs', celebrity);
    })
    .catch((err) => {
        next(err);
    });
});

router.post('/:id/edit', (req, res, next) => {
    const { name, occupation, catchPhrase } = req.body;
    Celebrity.findByIdAndUpdate(req.params.id, {
        name,
        occupation,
        catchPhrase
    }, {new: true})
    .then((updatedCelebrity) => {
        res.redirect(`/celebrities/all-celebrities/${updatedCelebrity._id}`);
    })
    .catch((err) => {
        next(err);
    })
});

module.exports = router;
