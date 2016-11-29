/**
 * Created by davidhradek on 28.11.16.
 */

export function NullSafe<T>(valueFunction:()=>T):T {
    try{
        return valueFunction();
    } catch(e) {
        return undefined;
    }
}

export function NullSafeDefault<T>(valueFunction:()=>T, defaultValue:T):T {
    try{
        return valueFunction() || defaultValue;
    } catch(e) {
        return defaultValue;
    }
}