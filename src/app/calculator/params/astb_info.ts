import { TextColor } from "../common/enums"

export default async function ASTB_INFO(
    ASTB: number,
    AST1: number,
): Promise<string> {
    if (ASTB < Math.abs(AST1)) {
        return "< Ast-ELU --> {{{NOK!}}}" + TextColor.RED
    } else {
        return ""
    }
}
