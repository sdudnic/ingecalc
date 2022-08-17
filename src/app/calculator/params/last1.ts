import { getAutoAstArray } from "../common/functions";

/**
 * Excel: Flexion(Bending).D(4)29
 * @param HFL 
 * @param BFL 
 * @param ASTB 
 * @param AST1 
 * @returns 
 */
export default async function LAST1(
    HFL: number,
    BFL: number,
    AST1: number
): Promise<any> {

    let asts = getAutoAstArray(HFL, BFL, AST1);

    return asts[0][1];
}