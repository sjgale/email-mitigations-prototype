import { expect } from 'chai'
import { getDLDistance } from './string-similarity'

describe('getDLDistance', () => {
    before(() => {
    })

    it('should correctly identify deletions', () => {
        expect(getDLDistance("one", "on")).to.eql(1)
        expect(getDLDistance("really long line", "long")).to.eql(12)
    })

    it('should correctly identify additions', () => {
        expect(getDLDistance("c", "cool")).to.eql(3)
        expect(getDLDistance("cd", "compact disk")).to.eql(10)
    })

    it('should correctly identify substitutions', () => {
        expect(getDLDistance("cool present", "coal present")).to.eql(1)
        expect(getDLDistance("wh@+ w@$ th@+", "what was that")).to.eql(6)
    })

    it('should correctly identify transpositions', () => {
        expect(getDLDistance("creep", "crepe")).to.eql(1)
        expect(getDLDistance("cna yuo raed tihs", "can you read this")).to.eql(4)
    })

    it('should correctly identify combos', () => {
        expect(getDLDistance("im@cat.co", "i@cat.com")).to.eql(2)
        expect(getDLDistance("tast@emial.co", "test@email.com")).to.eql(3)
        expect(getDLDistance("furst-lahst@cmpanee.org", "first-last@company.com")).to.eql(8)
    })
})