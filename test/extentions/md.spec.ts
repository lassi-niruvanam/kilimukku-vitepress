import { ExtentionMd } from "@/extentions/md.js";
import { empreinte } from "@/utils.js";

import { expect } from "aegir/chai";
import { marked } from "marked";

const composantes: {
  nom: string;
  entrée: string;
  analyse: { clef: string; valeur: string }[];
  traducs: { [clef: string]: string };
  traduit: string;
}[] = [
  {
    nom: "Entête simple",
    entrée: "# Un titre\n",
    analyse: [{ clef: "", valeur: "Un titre" }],
    traducs: { "Un titre": "Un título" },
    traduit: "# Un título\n",
  },
  {
    nom: "Entête deuxième niveau",
    entrée: "## Un autre titre\n",
    analyse: [{ clef: "", valeur: "Un autre titre" }],
    traducs: { "Un autre titre": "Otro título" },
    traduit: "## Otro título\n",
  },
  {
    nom: "Entête avec formattage",
    entrée: "## C'est **important**\n",
    analyse: [{ clef: "", valeur: "C'est **important**" }],
    traducs: { "C'est **important**": "Es **importante**" },
    traduit: "## Es **importante**\n",
  },
  {
    nom: "Tableau",
    entrée: `| Col1 | Col2 |
| --- | --- |
| a | b |`,
    analyse: [
      { clef: "", valeur: "Col1" },
      { clef: "", valeur: "Col2" },
      { clef: "", valeur: "a" },
      { clef: "", valeur: "b" },
    ],
    traducs: { Col1: "columna 1", Col2: "columna 2", a: "A" },
    traduit: `columna 1 | columna 2
--- | ---
A | b
`,
  },
];

describe("Extention md", function () {
  describe("Composantes", function () {
    const fichier = "fichier test";
    const extention = new ExtentionMd();

    composantes.forEach((spéc) => {
      const composante = marked.lexer(spéc.entrée)[0];

      it(`${spéc.nom} - analyse`, async () => {
        const rés = extention.analyserComposante({ composante });
        expect(rés).to.deep.equal(spéc.analyse);
      });

      it(`${spéc.nom} - reconstruction`, async () => {
        const rés = extention.reconstruireComposante({
          composante,
          traducs: Object.fromEntries(
            spéc.analyse.map((c) => [
              fichier + "." + empreinte(c.valeur),
              spéc.traducs[c.valeur],
            ]),
          ),
          langue: "es",
          fichier,
        });
        expect(rés).to.equal(spéc.traduit);
      });
    });
  });
});
