function info(message, data = "") {
  console.log(`[INFO] ${message}`, data);
}

function error(message, data = "") {
  console.error(`[ERROR] ${message}`, data);
}

function warn(message, data = "") {
  console.warn(`[WARN] ${message}`, data);
}

module.exports = {
  info,
  error,
  warn
};