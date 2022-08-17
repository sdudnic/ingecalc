import { TextColor } from "../common/enums";

/**
 * Information de validation sur le param ASC1.
 * Excel: Bending-Flexion.E(5)25
 * @param ASC1 
 * @param BFL 
 * @param HFL 
 * @returns 
 */
export default async function ASC1_INFO(
    ASC1: number,
    BFL: number,
    HFL: number
): Promise<string> {
    var asc = ASC1 / 10000;
    return (Math.abs(asc) > 0.04 * BFL * HFL) ? ` > 0.04Ac --> {{{NOK!}}}${TextColor.GREEN}` : ""
}
