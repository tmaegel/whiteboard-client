import { notify } from "@kyvg/vue3-notification";

function notification(type, title, text, duration = 3000) {
  notify({
    type: type,
    title: title,
    text: text,
    duration: duration,
  });
}

function info(text) {
  console.info('INFO: ' +  text);
  notification('info', 'INFO', text);
}

function success(text) {
  console.log('SUCCESS: ' +  text);
  notification('success', 'SUCCESS', text);
}

function warn(text) {
  console.warn('WARNING: ' +  text);
  notification('warn', 'WARNING', text, 7500);
}

function error(text) {
  console.error('ERROR: ' +  text);
  notification('error', 'ERROR', text, 10000);
}

export { info, success, warn, error }
