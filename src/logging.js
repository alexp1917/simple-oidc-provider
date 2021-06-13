function Logger() {}

Logger.prototype.log = function() {
  console.log(...arguments);
};

['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(level => {
  Logger.prototype[level] = Logger.prototype.log;
});

module.exports = {
  Logger,
};
