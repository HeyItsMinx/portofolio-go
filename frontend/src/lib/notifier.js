let handler = null;

export function registerNotifier(fn) {
  handler = fn;
}

export function notifyGlobal(message, options) {
  if (handler) handler(message, options);
}