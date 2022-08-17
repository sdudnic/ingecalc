import { TextColor } from "../common/enums";

export default async function SPBC_INFO(
    ASCB: number,
    BFL: number,
    HFL: number,
): Promise<string> {
    return (Math.abs(ASCB) > 0.04 * BFL * HFL * 10000) ? `> 0.04Ac --> {{{NOK!}}}` + TextColor.RED : ""
}
