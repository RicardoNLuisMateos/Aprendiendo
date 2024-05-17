import * as Sentry from '@sentry/node';

/**
 * A function that starts a transaction with the provided name.
 *
 * @param {string} transactionName - The name of the transaction to start.
 * @return {any} The started transaction object.
 */
export const startTransaction = (transactionName: string) => {
    const transaction = Sentry.startTransaction({
        op: "httpRequest",
        name: transactionName,
    });
    return transaction
}
/**
 * Finish the transaction by calling the finish method on the transaction object.
 *
 * @param {any} transaction - The transaction object to finish.
 * @return {void} No return value.
 */
export const finishTransaction = (transaction: any) => {
    transaction.finish();
}
/**
 * Start a new span within a transaction.
 *
 * @param {any} transaction - The transaction object to start the span within.
 * @param {string} operation - The operation being performed.
 * @param {string} description - The description of the span.
 * @return {any} The newly created span object.
 */
export const startSpan = (transaction: any, operation:string, description: string) => {
    const span = transaction.startChild({
        op: operation,
        description: description
    });
    return span;
}

/**
 * Finish a span by calling the finish method on the provided span object.
 *
 * @param {any} span - The span object to finish.
 * @return {void} No return value.
 */
export const finishSpan = (span: any) => {
    span.finish();
}