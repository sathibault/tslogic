namespace ts {

export function checkUnaryOpOverload(operator: SyntaxKind, _expr: Expression, exprType: Type): Type|undefined {
  switch (operator) {
    case SyntaxKind.PlusToken:
    case SyntaxKind.MinusToken:
    case SyntaxKind.TildeToken:
    case SyntaxKind.ExclamationToken:
    case SyntaxKind.PlusPlusToken:
    case SyntaxKind.MinusMinusToken:
      if (isBitType(exprType) && exprType.resolvedTypeArguments)
        return exprType;
      else if (isRtlType(exprType) && exprType.resolvedTypeArguments)
        return exprType;
      break;
  }
}

export function checkBinaryOpOverload(operator: SyntaxKind, left: Expression, leftType: Type, right: Expression, rightType: Type): Type|undefined {
  //console.log(tokenToString(operator),typeToString(leftType),typeToString(rightType));

  switch (operator) {
    case SyntaxKind.LessThanToken:
    case SyntaxKind.GreaterThanToken:
    case SyntaxKind.LessThanEqualsToken:
    case SyntaxKind.GreaterThanEqualsToken:
    case SyntaxKind.EqualsEqualsToken:
    case SyntaxKind.ExclamationEqualsToken:
    case SyntaxKind.EqualsEqualsEqualsToken:
    case SyntaxKind.ExclamationEqualsEqualsToken:
      // Override so as not get get:
      // This comparison appears to be unintentional because the types 'RtlExpr<Int<8>>' and 'number' have no overlap.
      if (isBitType(leftType) && leftType.resolvedTypeArguments && isConstNumberExpression(right)) {
        return leftType.checker.getBooleanType();
      } else if (isBitType(rightType) && rightType.resolvedTypeArguments && isConstNumberExpression(left)) {
        return leftType.checker.getBooleanType();
      }
      if (isRtlType(leftType) && leftType.resolvedTypeArguments &&
          isRtlType(rightType) && rightType.resolvedTypeArguments) {
        return makeRtlBase(leftType, leftType.checker.getBooleanType());
      } else if (isRtlType(leftType) && leftType.resolvedTypeArguments && isConstNumberExpression(right)) {
        return makeRtlBase(leftType, leftType.checker.getBooleanType());
      } else if (isRtlType(rightType) && rightType.resolvedTypeArguments && isConstNumberExpression(left)) {
        return makeRtlBase(rightType, rightType.checker.getBooleanType());
      }
      break;
    case SyntaxKind.LessThanLessThanToken:
    case SyntaxKind.GreaterThanGreaterThanToken:
      if (isBitType(leftType) && leftType.resolvedTypeArguments &&
          isBitType(rightType) && rightType.resolvedTypeArguments) {
          return leftType;
      } else if (isBitType(leftType) && leftType.resolvedTypeArguments && isConstNumberExpression(right)) {
          return leftType;
      } else if (isBitType(rightType) && rightType.resolvedTypeArguments && isConstNumberExpression(left)) {
          return rightType;
      }
      if (isRtlType(leftType) && leftType.resolvedTypeArguments &&
          isRtlType(rightType) && rightType.resolvedTypeArguments) {
          return toRtlBase(leftType);
      } else if (isRtlType(leftType) && leftType.resolvedTypeArguments && isConstNumberExpression(right)) {
          return toRtlBase(leftType);
      } else if (isRtlType(rightType) && rightType.resolvedTypeArguments && isConstNumberExpression(left)) {
          return toRtlBase(rightType);
      }
      break;
    case SyntaxKind.BarToken:
    case SyntaxKind.CaretToken:
    case SyntaxKind.AmpersandToken:
    case SyntaxKind.PlusToken:
    case SyntaxKind.MinusToken:
    case SyntaxKind.AsteriskToken:
    case SyntaxKind.SlashToken:
      if (isBitType(leftType) && leftType.resolvedTypeArguments &&
          isBitType(rightType) && rightType.resolvedTypeArguments) {
            const w1 = (leftType.resolvedTypeArguments[0] as LiteralType).value as number;
            const w2 = (rightType.resolvedTypeArguments[0] as LiteralType).value as number;
            const rw = (w1 >= w2) ? w1 : w2;
            const arg = leftType.checker.getNumberLiteralType(rw);
            if (isSignedBitType(leftType))
              return leftType.checker.createTypeReference(leftType.target, [arg]);
            else
              return rightType.checker.createTypeReference(rightType.target, [arg]);
      } else if (isBitType(leftType) && leftType.resolvedTypeArguments && isConstNumberExpression(right)) {
        return leftType;
      } else if (isBitType(rightType) && rightType.resolvedTypeArguments && isConstNumberExpression(left)) {
        return rightType;
      }
      if (isRtlType(leftType) && leftType.resolvedTypeArguments &&
          isRtlType(rightType) && rightType.resolvedTypeArguments) {
            const arg1 = leftType.resolvedTypeArguments[0];
            const arg2 = rightType.resolvedTypeArguments[0];
            if (isBitType(arg1) && arg1.resolvedTypeArguments &&
                isBitType(arg2) && arg2.resolvedTypeArguments) {
              const w1 = (arg1.resolvedTypeArguments[0] as LiteralType).value as number;
              const w2 = (arg2.resolvedTypeArguments[0] as LiteralType).value as number;
              const rw = (w1 >= w2) ? w1 : w2;
              const bitArg = leftType.checker.getNumberLiteralType(rw);
              const res = isSignedBitType(arg1) ? arg1.checker.createTypeReference(arg1.target, [bitArg]) : arg2.checker.createTypeReference(arg2.target, [bitArg]);
              return makeRtlBase(leftType, res);
            }
      } else if (isRtlType(leftType) && leftType.resolvedTypeArguments && isConstNumberExpression(right)) {
          return toRtlBase(leftType);
      } else if (isRtlType(rightType) && rightType.resolvedTypeArguments && isConstNumberExpression(left)) {
          return toRtlBase(rightType);
      }
      break;
    case SyntaxKind.HashPlusToken:
    case SyntaxKind.HashMinusToken:
      if (isBitType(leftType) && leftType.resolvedTypeArguments &&
          isBitType(rightType) && rightType.resolvedTypeArguments) {
          const s1 = isSignedBitType(leftType);
          const s2 = isSignedBitType(rightType);
          const w1 = (leftType.resolvedTypeArguments[0] as LiteralType).value as number;
          const w2 = (rightType.resolvedTypeArguments[0] as LiteralType).value as number;
          const ext = w1 != w2 ? 0 : s1 == s2 ? 1 : 2;
          const rw = ext + ((w1 >= w2) ? w1 : w2);
          const arg = leftType.checker.getNumberLiteralType(rw);
          if (s1)
            return leftType.checker.createTypeReference(leftType.target, [arg]);
          else
            return rightType.checker.createTypeReference(rightType.target, [arg]);
      } else if (isBitType(leftType) && leftType.resolvedTypeArguments && isConstNumberExpression(right)) {
        const w1 = (leftType.resolvedTypeArguments[0] as LiteralType).value as number;
        const rw = 1 + w1;
        const arg = leftType.checker.getNumberLiteralType(rw);
        return leftType.checker.createTypeReference(leftType.target, [arg]);
      } else if (isBitType(rightType) && rightType.resolvedTypeArguments && isConstNumberExpression(left)) {
        const w2 = (rightType.resolvedTypeArguments[0] as LiteralType).value as number;
        const rw = 1 + w2;
        const arg = leftType.checker.getNumberLiteralType(rw);
        return rightType.checker.createTypeReference(rightType.target, [arg]);
      }

      if (isRtlType(leftType) && leftType.resolvedTypeArguments &&
          isRtlType(rightType) && rightType.resolvedTypeArguments) {
            const arg1 = leftType.resolvedTypeArguments[0];
            const arg2 = rightType.resolvedTypeArguments[0];
            console.log('got 2 rtl');
            if (isBitType(arg1) && arg1.resolvedTypeArguments &&
                isBitType(arg2) && arg2.resolvedTypeArguments) {
              console.log('got 2 bit');
              const s1 = isSignedBitType(arg1);
              const s2 = isSignedBitType(arg2);
              const w1 = (arg1.resolvedTypeArguments[0] as LiteralType).value as number;
              const w2 = (arg2.resolvedTypeArguments[0] as LiteralType).value as number;

              const ext = w1 != w2 ? 0 : s1 == s2 ? 1 : 2;
              const hw = ext + ((w1 >= w2) ? w1 : w2);
              const hwArg = leftType.checker.getNumberLiteralType(hw);
              const hRes = isSignedBitType(arg1) ? arg1.checker.createTypeReference(arg1.target, [hwArg]) : arg2.checker.createTypeReference(arg2.target, [hwArg]);
              return makeRtlBase(leftType, hRes);
            }
      } else if (isRtlType(leftType) && leftType.resolvedTypeArguments && isConstNumberExpression(right)) {
        const arg1 = leftType.resolvedTypeArguments[0];
        if (isBitType(arg1) && arg1.resolvedTypeArguments) {
          const w1 = (arg1.resolvedTypeArguments[0] as LiteralType).value as number;
          const rw = 1 + w1;
          const arg = leftType.checker.getNumberLiteralType(rw);
          return makeRtlBase(leftType, arg1.checker.createTypeReference(arg1.target, [arg]));
        }
      } else if (isRtlType(rightType) && rightType.resolvedTypeArguments && isConstNumberExpression(left)) {
        const arg2 = rightType.resolvedTypeArguments[0];
        if (isBitType(arg2) && arg2.resolvedTypeArguments) {
          const w2 = (arg2.resolvedTypeArguments[0] as LiteralType).value as number;
          const rw = 1 + w2;
          const arg = rightType.checker.getNumberLiteralType(rw);
          return makeRtlBase(rightType, arg2.checker.createTypeReference(arg2.target, [arg]));
        }
      }

      console.log('hash +/- fail', leftType.checker.typeToString(leftType), rightType.checker.typeToString(rightType), exprToString(right));
      break;
    case SyntaxKind.HashAsteriskToken:
      if (isBitType(leftType) && leftType.resolvedTypeArguments &&
          isBitType(rightType) && rightType.resolvedTypeArguments) {
          const w1 = (leftType.resolvedTypeArguments[0] as LiteralType).value as number;
          const w2 = (rightType.resolvedTypeArguments[0] as LiteralType).value as number;
          const rw = w1 + w2;
          const arg = leftType.checker.getNumberLiteralType(rw);
          if (isSignedBitType(leftType))
            return leftType.checker.createTypeReference(leftType.target, [arg]);
          else
            return rightType.checker.createTypeReference(rightType.target, [arg]);
      }

      if (isRtlType(leftType) && leftType.resolvedTypeArguments &&
          isRtlType(rightType) && rightType.resolvedTypeArguments) {
            const arg1 = leftType.resolvedTypeArguments[0];
            const arg2 = rightType.resolvedTypeArguments[0];
            console.log('got 2 rtl');
            if (isBitType(arg1) && arg1.resolvedTypeArguments &&
                isBitType(arg2) && arg2.resolvedTypeArguments) {
              console.log('got 2 bit');
              const w1 = (arg1.resolvedTypeArguments[0] as LiteralType).value as number;
              const w2 = (arg2.resolvedTypeArguments[0] as LiteralType).value as number;
              const rw = w1 + w2;
              const hwArg = arg1.checker.getNumberLiteralType(rw);
              const hRes = isSignedBitType(arg1) ? arg1.checker.createTypeReference(arg1.target, [hwArg]) : arg2.checker.createTypeReference(arg2.target, [hwArg]);
              return makeRtlBase(leftType, hRes);
            }
      }

      console.log('hash * fail', leftType.checker.typeToString(leftType), rightType.checker.typeToString(rightType), exprToString(right));
      break;

    case SyntaxKind.EqualsToken:
    case SyntaxKind.BarEqualsToken:
    case SyntaxKind.CaretEqualsToken:
    case SyntaxKind.AmpersandEqualsToken:
    case SyntaxKind.PlusEqualsToken:
    case SyntaxKind.MinusEqualsToken:
    case SyntaxKind.AsteriskEqualsToken:
    case SyntaxKind.LessThanLessThanEqualsToken:
    case SyntaxKind.GreaterThanGreaterThanEqualsToken:
      if (isBitType(leftType) && leftType.resolvedTypeArguments) {
        if (rightType.flags & TypeFlags.NumberLiteral)
          return leftType;
        else if (isConstNumberExpression(right))
          return leftType;
        else if (assignableToBitType(rightType, leftType))
          return leftType
        else {
          console.log('checkBinaryOpOverload assignment fail', leftType.checker.typeToString(leftType), rightType.checker.typeToString(rightType), exprToString(right));
        }
      }
      if (isRtlType(leftType) && leftType.resolvedTypeArguments) {
        if (rightType.flags & TypeFlags.NumberLiteral)
          return leftType;
        else if (isConstNumberExpression(right))
          return leftType;
        else if (assignableToRtlType(rightType, leftType))
          return leftType
        else {
          console.log('checkBinaryOpOverload assignment fail', leftType.checker.typeToString(leftType), rightType.checker.typeToString(rightType), exprToString(right));
        }
      }
      break;
  }
}

export function checkInitializerOverload(target: Type, initType: Type, initializer: Expression): boolean {
  if (isBitType(target) && target.resolvedTypeArguments) {
    if (isConstNumberExpression(initializer))
      return true;
    var okay = assignableToBitType(initType, target);
    if (!okay) {
      console.log('checkInitializerOverload fail', target.checker.typeToString(target), initType.checker.typeToString(initType), exprToString(initializer));
    }  
    return okay;
  } else if (isRtlType(target) && target.resolvedTypeArguments) {
    if (isConstNumberExpression(initializer))
      return true;
    var okay = assignableToRtlType(initType, target);
    if (!okay) {
      console.log('checkInitializerOverload fail', target.checker.typeToString(target), initType.checker.typeToString(initType), exprToString(initializer));
    }  
    return okay;
  }
  return false;
}

// TODO auto extend source expression
export function assignableToBitType(source: Type, target: TypeReference): boolean {
  if (source.flags & TypeFlags.NumberLiteral)
    return true;
  else if (target.resolvedTypeArguments) {
    if (isBitType(source) && source.resolvedTypeArguments) {
      const s1 = isSignedBitType(target);
      const s2 = isSignedBitType(source);
      const w1 = (target.resolvedTypeArguments[0] as LiteralType).value as number;
      const w2 = (source.resolvedTypeArguments[0] as LiteralType).value as number;
      return s1 == s2 && w1 == w2;
    } else if (source.flags & TypeFlags.BooleanLike) {
      const w = (target.resolvedTypeArguments[0] as LiteralType).value as number;
      console.log('bool to bits', target.checker.typeToString(target), source.checker.typeToString(source), !isSignedBitType(target), w );
      return !isSignedBitType(target) && w == 1;
    } else if (source.flags & TypeFlags.Union) {
      const subs = (source as UnionType).types;
      return subs.every(subType => assignableToBitType(subType, target));
    }
  }
  return false;
}

export function assignableToRtlType(source: Type, target: TypeReference): boolean {
  if (source.flags & TypeFlags.NumberLiteral)
    return true;
  else if (target.resolvedTypeArguments) {
    const tgtArg = target.resolvedTypeArguments[0];
    if (isRtlType(source) && source.resolvedTypeArguments) {
      const srcArg = source.resolvedTypeArguments[0];
      if (isBitType(srcArg) && srcArg.resolvedTypeArguments) {
        if (isBitType(tgtArg) && tgtArg.resolvedTypeArguments)
          return assignableToBitType(srcArg, tgtArg);
      } else if (srcArg.flags & TypeFlags.BooleanLike) {
        if (isBitType(tgtArg) && tgtArg.resolvedTypeArguments)
          return assignableToBitType(srcArg, tgtArg);
      }
    } else if (isBitType(source) && source.resolvedTypeArguments) {
      if (isBitType(tgtArg) && tgtArg.resolvedTypeArguments)
        return assignableToBitType(source, tgtArg);
    } else if (source.flags & TypeFlags.Union) {
      const subs = (source as UnionType).types;
      return subs.every(subType => assignableToRtlType(subType, target));
    }
  }
  return false;
}

// Returns true for literal values, unary + or - of literal a expression
export function isConstNumberExpression(expr: Expression) {
  if (expr.kind == SyntaxKind.PrefixUnaryExpression) {
    const unary = expr as PrefixUnaryExpression;
    if (unary.operator == SyntaxKind.PlusToken || unary.operator == SyntaxKind.MinusToken)
      return unary.operand.kind == SyntaxKind.NumericLiteral;
  }
  return expr.kind == SyntaxKind.NumericLiteral;
}

function isSignedBitType(t: TypeReference) {
  return t.symbol.escapedName == 'Int' ? true : false;
}

export function isBitType(t: Type): t is TypeReference {
  return isTypeReference(t) ? t.symbol && ((t.symbol.escapedName == 'UInt') || (t.symbol.escapedName == 'Int')) : false;
}

function isTypeReference(t: Type): t is TypeReference {
  return (getObjectFlags(t) & ObjectFlags.Reference) != 0;
}

export function isNumberType(type: Type) {
  return (type.flags & TypeFlags.NumberLike) || (type.flags & TypeFlags.BigIntLike);
}

function toRtlBase(t: TypeReference) {
  if (t.resolvedTypeArguments) {
    return makeRtlBase(t, t.resolvedTypeArguments[0]);
  }
  throw new Error('Internal error: toRtlBase');
}

function makeRtlBase(original: TypeReference, arg: Type) {
  const base = rtlBaseType(original);
  return base.checker.createTypeReference(base.target, [arg]);
}

const rtlCache: Record<number,TypeReference[]> = {};

export function isRtlType(t: Type): t is TypeReference {
  if (rtlCache[t.id] && rtlCache[t.id][0] == t)
    return true;
  return isTypeReference(t) && check(t, t, 0);
  function check(type: Type, query: TypeReference, depth: number): boolean {
    if (depth > 10)
      return false; // run-away recursion
    if (depth > 0 && type == query)
      return false;
    //console.log('check', type.symbol?.escapedName, isTypeReference(type), isTypeReference(type) && !!type.resolvedTypeArguments);
    if (isTypeReference(type) && type.symbol?.escapedName == 'RtlExpr') {
      rtlCache[query.id] = [query, type];
      return true;
    }
    if (getObjectFlags(type) & (ObjectFlags.ClassOrInterface | ObjectFlags.Reference)) {
      const target = getTargetType(type) as InterfaceType;
      //console.log(target.symbol?.escapedName, type.checker.getBaseTypes(target).map(b => b.symbol?.escapedName));
      return target && target.symbol && type.checker &&
        (some(type.checker.getBaseTypes(target), t => check(t, query, depth+1)) ||
         some(type.checker.getImplementsTypes(target), t => check(t, query, depth+1)));
    } else if (type.flags & TypeFlags.Intersection) {
      return some((type as IntersectionType).types, t => check(t, query, depth+1));
    }
    return false;
  }
}

function rtlBaseType(t: Type) {
  if (rtlCache[t.id])
    return rtlCache[t.id][1];
  throw new Error('Internal error: rtlBaseType miss');
}

function getTargetType(type: Type): Type {
  return getObjectFlags(type) & ObjectFlags.Reference ? (type as TypeReference).target : type;
}

function exprToString(expr: Expression, writer: EmitTextWriter = createTextWriter("")): string {
  const options = { removeComments: true };
  const printer = createPrinter(options);
  const sourceFile = getSourceFileOfNode(expr);
  printer.writeNode(EmitHint.Expression, expr, /*sourceFile*/ sourceFile, writer);
  const result = writer.getText();
  return result;
}

}