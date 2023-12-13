import type { Message } from "@/types.js";
import { empreinte } from "@/utils.js";

import { Extention } from "./extention.js";

type ÉlémentExcalidraw = {
  type: string;
  text?: string;
};

export class ExtentionExcalidraw extends Extention {
  exts = ["excalidraw"];

  async extraireMessages({ texte }: { texte: string }): Promise<Message[]> {
    const contenu = JSON.parse(texte);

    return (
      contenu["elements"]
        ?.filter((é: ÉlémentExcalidraw) => é.type === "text")
        .map((x: ÉlémentExcalidraw) => ({ clef: "", valeur: x.text })) || []
    );
  }

  async compiler({
    contenu,
    traducs,
    fichier,
  }: {
    contenu: Buffer;
    traducs: { [clef: string]: string };
    fichier: string;
  }): Promise<string> {
    const contenuTexte = contenu.toString();
    const contenuJson = JSON.parse(contenuTexte);

    for (const x of contenuJson["elements"]) {
      if (x.type === "text") {
        const clef = fichier + "." + empreinte(x.text);
        x.text = traducs[clef] || x.text;
      }
    }
    return JSON.stringify(contenuJson);
  }
}
