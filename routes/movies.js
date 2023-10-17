const router = require('express').Router();
const Celebrity = require('../models/Celebrity.model');
const Movie = require('../models/Movie.model');

router.get('/add-movie', (req, res, next) => {
    Celebrity.find()
    .then((celebrities) => {
        res.render('movies/new-movie.hbs', {celebrities});
    })
    .catch((err) => {
        next(err);
    });
});

router.post('/add-movie', (req, res, next) => {
    const { title, genre, plot, cast } = req.body;

    Movie.create({
        title,
        genre,
        plot,
        cast
    })
    .then((newMovie) => {
        res.redirect('/movies/all-movies');
    })
    .catch((err) => {
        next(err);
    });

});

router.get('/all-movies', (req, res, next) => {
    Movie.find()
    .then((movies) => {
        res.render('movies/movies.hbs', {movies});
    })
    .catch((err) => {
        next(err);
    });
});

router.get('/all-movies/:id', (req, res, next) => {
    Movie.findById(req.params.id)
    .populate('cast')
    .then((movie) => {
        res.render('movies/movie-details.hbs', movie);
    })
    .catch((err) => {
        next(err);
    })
});

router.post('/:id/delete', (req, res, next) => {
    Movie.findByIdAndDelete(req.params.id)
    .then(() => {
        res.redirect('/movies/all-movies');
    })
    .catch((err) => {
        next(err);
    })
});

router.get('/:id/edit', (req, res, next) => {
    Celebrity.find()
    .then((celebrities) => {
        return celebrities;
    })
    .then((celebrities) => {
        Movie.findById(req.params.id)
        .then((movie) => {
            let movieToEdit = {...movie._doc, cast: celebrities};
            res.render('movies/edit-movie.hbs', movieToEdit);
        })
        .catch((err) => {
            next(err);
        });
    })
    .catch((err) => {
        next(err);
    });
});

router.post('/:id/edit', (req, res, next) => {
    const { title, genre, plot, cast } = req.body;
    Movie.findByIdAndUpdate(req.params.id, {
        title,
        genre,
        plot,
        cast
    }, {new: true})
    .then((updatedMovie) => {
        res.redirect(`/movies/all-movies/${updatedMovie._id}`);
    })
    .catch((err) => {
        next(err);
    })
});

module.exports = router;
