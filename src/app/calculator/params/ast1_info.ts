import { TextColor } from "../common/enums";

/**
 * Excel: Flexion.E24
 * @param AST1 
 * @param BFL 
 * @param HFL 
 * @returns 
 */
export default async function AST1_INFO(
    AST1: number,
    BFL: number,
    HFL: number
): Promise<string> {
    // If Ast > 0.04 * _BFL * _HFL Then
    const ast = AST1 / 10000;
    const result = (ast > 0.04 * BFL * HFL) ? " > 0.04Ac --> {{{NOK!}}}" + TextColor.RED : "";
    return result;
}
