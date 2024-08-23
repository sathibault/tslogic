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
      } else if (isBitType(leftType) && leftType.resolvedTypeArguments && isNumberType(rightType) && isConstExpression(right)) {
          return leftType;
      } else if (isBitType(rightType) && rightType.resolvedTypeArguments && isNumberType(leftType) && isConstExpression(left)) {
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
      } else if (isBitType(leftType) && leftType.resolvedTypeArguments && isNumberType(rightType) && isConstExpression(right)) {
        return leftType;
      } else if (isBitType(rightType) && rightType.resolvedTypeArguments && isNumberType(leftType) && isConstExpression(left)) {
        return rightType;
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
        if (isBitType(rightType) && rightType.resolvedTypeArguments)
          return leftType;
        else if (isNumberType(rightType) && isConstExpression(right))
          return leftType;
      }
      break;
  }
}

// Returns true for literal values, unary + or - of literal a expression
export function isConstExpression(expr: Expression) {
  if (expr.kind == SyntaxKind.PrefixUnaryExpression) {
    const unary = expr as PrefixUnaryExpression;
    if (unary.operator == SyntaxKind.PlusToken || unary.operator == SyntaxKind.MinusToken)
      return isLiteralExpression(unary.operand);
  }
  return isLiteralExpression(expr);
}

export function checkInitializerOverload(type: ts.Type, initializer: ts.Expression): boolean {
  if (isBitType(type) && type.resolvedTypeArguments) {
    if (isNumericLiteral(initializer))
      return true;
  }
  return false;
}

function isSignedBitType(t: ts.TypeReference) {
  return t.symbol.escapedName == 'Int' ? true : false;
}

export function isBitType(t: ts.Type): t is ts.TypeReference {
  return isTypeReference(t) ? t.symbol && ((t.symbol.escapedName == 'UInt') || (t.symbol.escapedName == 'Int')) : false;
}

function isTypeReference(t: Type): t is TypeReference {
  return (getObjectFlags(t) & ObjectFlags.Reference) != 0;
}

export function isNumberType(type: ts.Type) {
  return (type.flags & ts.TypeFlags.NumberLike) || (type.flags & ts.TypeFlags.BigIntLike);
}

}