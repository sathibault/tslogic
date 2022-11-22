namespace ts {

export function checkOperatorOverload(leftType: Type, rightType: Type): Type|undefined {
  if (isTypeReference(leftType) && leftType.resolvedTypeArguments &&
      isTypeReference(rightType) && rightType.resolvedTypeArguments) {
    if (leftType.symbol.escapedName == 'UInt' && rightType.symbol.escapedName == 'UInt') {
      const w1 = (leftType.resolvedTypeArguments[0] as LiteralType).value as number;
      const w2 = (rightType.resolvedTypeArguments[0] as LiteralType).value as number;
      const rw = 1 + ((w1 >= w2) ? w1 : w2);
      const arg = leftType.checker.getNumberLiteralType(rw);
      return leftType.checker.createTypeReference(leftType.target, [arg]);
    }
  }
}

function isTypeReference(t: Type): t is TypeReference {
  return (getObjectFlags(t) & ObjectFlags.Reference) != 0;
}
}