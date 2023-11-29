import { ExtentionMd } from "@/extentions/md.js"
import { empreinte } from "@/utils.js"

import {expect} from "aegir/chai"
import { marked } from "marked"

describe("Extention md", function () {
    describe("Analyser composantes", function () {
        const extention = new ExtentionMd()
        it("Entête", async () => {
            const composante = marked.lexer("# Un titre\n")[0]
            const rés = extention.analyserComposante({composante})
            expect(rés).to.deep.equal([{clef: '', valeur: 'Un titre'}])
        })
    })

    describe("Reconstruire composantes", function () {
        const extention = new ExtentionMd()
        it("Entête", async () => {
            const fichier = "fichier test"
            const composante = marked.lexer("# Un titre\n")[0]
            const rés = extention.reconstruireComposante({
                composante,
                traducs: {[fichier + "." + empreinte("Un titre")]: "Un título"},
                langue: "es",
                fichier
            })
            expect(rés).to.equal("# Un título\n")
        })
    })
})