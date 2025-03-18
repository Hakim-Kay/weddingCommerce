import { db } from './client'

/**
 * Execute a callback within a transaction with error handling
 * @param callback Function to execute within the transaction
 * @returns The result of the callback or null if an error occurred
 */
export async function withTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T | null> {
    try {
        return await db.transaction(async (tx) => {
            return await callback(tx)
        })
    } catch (error) {
        console.error('Transaction failed:', error)
        return null
    }
}

/**
 * Execute a database operation with error handling
 * @param operation Function that performs a database operation
 * @returns The result of the operation or null if an error occurred
 */
export async function withErrorHandling<T>(operation: () => Promise<T>): Promise<T | null> {
    try {
        return await operation()
    } catch (error) {
        console.error('Database operation failed:', error)
        return null
    }
}
