/*
 * © 2015 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
/**
 * Type definitions for file-url 1.0.0.
 */

/**
 * Convert a path to a file URL.
 */
declare module "file-url" {
    function fileUrl(path:string):string;
    export = fileUrl;
}
