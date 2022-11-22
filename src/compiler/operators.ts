namespace ts {

export function checkBinaryOpOverload(operator: SyntaxKind, leftType: Type, rightType: Type): Type|undefined {
  if (isTypeReference(leftType) && leftType.resolvedTypeArguments &&
      isTypeReference(rightType) && rightType.resolvedTypeArguments) {
    switch (operator) {
      case SyntaxKind.BarToken:
      case SyntaxKind.CaretToken:
      case SyntaxKind.AmpersandToken:
        if (leftType.symbol.escapedName == 'UInt')
          return leftType;
        break;
      case SyntaxKind.PlusToken:
      case SyntaxKind.MinusToken:
        if (leftType.symbol.escapedName == 'UInt' && rightType.symbol.escapedName == 'UInt') {
          const w1 = (leftType.resolvedTypeArguments[0] as LiteralType).value as number;
          const w2 = (rightType.resolvedTypeArguments[0] as LiteralType).value as number;
          const rw = 1 + ((w1 >= w2) ? w1 : w2);
          const arg = leftType.checker.getNumberLiteralType(rw);
          return leftType.checker.createTypeReference(leftType.target, [arg]);
        }
        break;
      case SyntaxKind.BarEqualsToken:
      case SyntaxKind.CaretEqualsToken:
      case SyntaxKind.AmpersandEqualsToken:
      case SyntaxKind.PlusEqualsToken:
      case SyntaxKind.MinusEqualsToken:
      case SyntaxKind.AsteriskEqualsToken:
          if (leftType.symbol.escapedName == 'UInt')
            return leftType;
        break;
      case SyntaxKind.AsteriskToken:
        if (leftType.symbol.escapedName == 'UInt' && rightType.symbol.escapedName == 'UInt') {
          const w1 = (leftType.resolvedTypeArguments[0] as LiteralType).value as number;
          const w2 = (rightType.resolvedTypeArguments[0] as LiteralType).value as number;
          const rw = w1 + w2;
          const arg = leftType.checker.getNumberLiteralType(rw);
          return leftType.checker.createTypeReference(leftType.target, [arg]);
        }
        break;
    }
  }
}

function isTypeReference(t: Type): t is TypeReference {
  return (getObjectFlags(t) & ObjectFlags.Reference) != 0;
}

}