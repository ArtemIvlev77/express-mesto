const { Card } = require('../models/card');

exports.getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch(next);

exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send({ message: err.message }))
    .catch(next);
};

exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('Not Found'))
    .then((deleteCard) => res.send({ deleteCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданые данные некорректны' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Не найдено' });
      } else {
        res.status(500).send({ message: `Ошибка на сервере: ${err}` });
      }
    })
    .catch(next);
};

exports.likeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: owner } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      }
    })
    .catch(next);
};

exports.dislikeCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: owner } },
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка.',
        });
      }
    })
    .catch(next);
};
