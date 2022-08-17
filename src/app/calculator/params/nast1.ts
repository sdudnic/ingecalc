import { getAutoAstArray } from "../common/functions";

/**
 * Excel Flexion(Bending).B(2).29
 * @param HFL 
 * @param BFL  
 * @param AST1 
 * @returns 
 */
export default async function NAST1(
    HFL: number,
    BFL: number,
    AST1: number
): Promise<any> {
    let asts = getAutoAstArray(HFL, BFL, AST1);

    return asts[0][0];
}