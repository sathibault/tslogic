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
      break;
}
}

export function checkBinaryOpOverload(operator: SyntaxKind, left: Expression, leftType: Type, right: Expression, rightType: Type): Type|undefined {
  //console.log(tokenToString(operator),typeToString(leftType),typeToString(rightType));

  switch (operator) {
    case SyntaxKind.BarToken:
    case SyntaxKind.CaretToken:
    case SyntaxKind.AmpersandToken:
      if (isBitType(leftType) && leftType.resolvedTypeArguments &&
          isBitType(rightType) && rightType.resolvedTypeArguments) {
          return leftType;
      } else if (isBitType(leftType) && leftType.resolvedTypeArguments && isNumberType(rightType)) {
          return leftType;
      } else if (isBitType(rightType) && rightType.resolvedTypeArguments && isNumberType(leftType)) {
          return rightType;
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
          return leftType;
      }
      break;
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
    } else if (source.flags & TypeFlags.Union) {
      const subs = (source as UnionType).types;
      return subs.every(subType => assignableToBitType(subType, target));
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

function exprToString(expr: Expression, writer: EmitTextWriter = createTextWriter("")): string {
  const options = { removeComments: true };
  const printer = createPrinter(options);
  const sourceFile = getSourceFileOfNode(expr);
  printer.writeNode(EmitHint.Expression, expr, /*sourceFile*/ sourceFile, writer);
  const result = writer.getText();
  return result;
}

}