/// <reference path='fourslash.ts' />

////interface TInt<T> {
////val<U>(f: (t: T) => U): TInt<U>;
////}
////declare var v1: TInt<string>;
////var v2: TInt<number> = v1/*1*/;

verify.numberOfErrorsInCurrentFile(1);
goTo.marker('1');
edit.deleteAtCaret(';'.length);
verify.numberOfErrorsInCurrentFile(1);

