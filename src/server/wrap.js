const wrap = fn => (req, res, next) => {
  fn(req, res)
  .then(data => res.json(data))
  .catch(next)
}

module.exports = wrap
