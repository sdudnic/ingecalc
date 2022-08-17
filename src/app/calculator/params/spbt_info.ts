import { TextColor } from "../common/enums";

export default async function SPBT_INFO(
    ASTB: number,
    BFL: number,
    HFL: number,
): Promise<string> {
    return (ASTB > 0.04 * BFL * HFL * 10000) ? `> 0.04Ac --> {{{NOK!}}}` + TextColor.RED : ""
}
