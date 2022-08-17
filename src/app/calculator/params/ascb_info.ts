import { TextColor } from "../common/enums";

/**
 * Information sur la validité de ASCB.
 * Excel: Beding-Flexion.H(8)34
 * @param ASCB 
 * @param ASC1 
 * @returns 
 */
export default async function ASCB_INFO(
    ASCB: number,
    ASC1: number,
): Promise<string> {
    return (ASCB < Math.abs(ASC1)) ? "< Asc-ELU --> {{{NOK!}}}" + TextColor.RED : ""
}