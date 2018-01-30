/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


export function NullSafe<T>(valueFunction: () => T): T {
    try {
        return valueFunction();
    } catch (e) {
        return undefined;
    }
}

export function NullSafeDefault<T>(valueFunction: () => T, defaultValue: T): T {
    try {
        return valueFunction() || defaultValue;
    } catch (e) {
        return defaultValue;
    }
}
