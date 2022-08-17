import { TextColor } from "../common/enums"

/**
 * TEF validation message
 * Excel: Torsion.G27
 * @param TEF 
 * @param GCF 
 * @param GTF 
 * @returns 
 */
export default async function TEF_INFO(
  TEF: number,
  GCF: number,
  GTF: number,
): Promise<string> {
  if (TEF < 2 * GTF || TEF < 2 * GCF) {
    return `< 2gt {{{or}}} < 2gc --> {{{NOK!}}}${TextColor.RED}`
  }
  else { //if (TEF > 2 * GTF || TEF > 2 * GCF)
    return `>= 2gt {{{or}}} >= 2gc --> {{{OK}}}${TextColor.GREEN}`
  }
  /*else {
    return ""
  }*/
}
