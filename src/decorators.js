import store from '@/store'

/*
 * target: refers to the class that contains the member property.
 * name: refers to the name of the member property we are decorating
 *       in the class
 * descriptor: descriptor object with the following properties:
 *             value, writable, enumerable, and configurable
 */
function login_required(target, name, descriptor) {
  const original = descriptor.value;
  if (typeof original === 'function') {
    // Accessing the member class property and replaced
    // it with a new function.
    descriptor.value = function(...args) {
      if(!store.state.user || store.state.user.is_authenticated() == false) {
        console.debug('Login required. Request rejected.');
        return;
      }
      console.debug('Login confirmed. Request allowed.');
      try {
        const result = original.apply(this, args);
        return result;
      } catch (e) {
        console.error(`ERROR: ${e}`);
        throw e;
      }
    }
  }
  return descriptor;
}

export { login_required }
