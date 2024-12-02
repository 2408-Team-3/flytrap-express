/**
 * A WeakSet to track errors that have already been logged.
 * Prevents duplicate logging of the same error instance.
 */
const loggedErrors = new WeakSet<Error>();

export default loggedErrors;
