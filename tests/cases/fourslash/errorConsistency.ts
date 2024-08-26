/// <reference path="fourslash.ts"/>

////interface TInt<T> {
////val<U>(f: (t: T) => U): TInt<U>;
////}
////declare var v1: TInt<string>;
////var /*1*/v2/*2*/: TInt<number> = v1;

goTo.eof();
verify.errorExistsBetweenMarkers("1", "2");
verify.numberOfErrorsInCurrentFile(1);
edit.backspace(1);
verify.errorExistsBetweenMarkers("1", "2");
verify.numberOfErrorsInCurrentFile(1);
