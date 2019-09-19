const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = model => (req, res, next) => {
  model
    .findByIdAndDelete(req.params.id)
    .then(doc => {
      if (!doc)
        res
          .status(404)
          .json({ status: 'fail', message: 'No document found with that ID' });

      res.status(204).json({ status: 'success', data: null });
    })
    .catch(err => {
      res.status(404).json({ status: 'fail', message: err });
    });
};

exports.updateOne = model => (req, res, next) => {
  model
    .findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    .then(doc => {
      if (!doc)
        res
          .status(404)
          .json({ status: 'fail', message: 'No document found with that ID' });
      res.status(200).json({ status: 'success!!', data: { data: doc } });
    })
    .catch(err => {
      res.status(404).json({ status: 'fail', message: err });
    });
};

exports.createOne = model => (req, res, next) => {
  model
    .create(req.body)
    .then(doc => {
      res.status(201).json({ status: 'success', data: { data: doc } });
    })
    .catch(err => {
      res.status(400).json({ status: 'fail', message: err });
    });
};

exports.getOne = (model, populateOptions) => (req, res, next) => {
  let query = model.findById(req.params.id);
  if (populateOptions) query = query.populate(populateOptions);
  query
    .then(doc => {
      if (!doc)
        res
          .status(404)
          .json({ status: 'fail', message: 'No document found with that ID' });
      res.status(200).json({
        status: 'success',
        data: { data: doc }
      });
    })
    .catch(err => {
      res.status(404).json({ status: 'fail', message: err });
    });
};

exports.getAll = model => async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.ArticleId) filter = { Article: req.params.ArticleId };

    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
