import { getAutoAscArray } from "../common/functions";

/**
 * Excel: Flexion(Bending).D(4)33
 * @param HFL 
 * @param BFL  
 * @param ASC1 
 * @returns 
 */
export default async function LASC1(
    HFL: number,
    BFL: number,
    ASC1: number
): Promise<any> {
    let ascs = getAutoAscArray(HFL, BFL, ASC1);

    return ascs[0][1];
}