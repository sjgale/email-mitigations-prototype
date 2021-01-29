export function getDLDistance(source: string, target: string) {
    // Damerau-Levenshtein distance, see:
    // https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance#Distance_with_adjacent_transpositions

    const sourceLength = source.length
    const targetLength = target.length
    const maxLength = sourceLength + targetLength

    const matrix: number[][] = Array.from(
        { length: sourceLength + 2 },
        (_, i) => [maxLength, i === 0 ? maxLength : i - 1]
    )
    matrix[0].push(...Array.from({ length: targetLength }, (_) => maxLength))
    matrix[1].push(...Array.from({ length: targetLength }, (_, i) => (i + 1)))
    
    const lastRowCharacterWasEncountered = {}
    for (let row = 2; row < sourceLength + 2; row++) {

        const characterFromSource = source[row - 2]
        let lastMatchingColumnOnRow = 0

        for (let column = 2; column < targetLength + 2; column++) {

            const characterFromTarget = target[column - 2]
            const substitionCost = characterFromSource === characterFromTarget ? 0 : 1
            let lastMatchingRow = lastRowCharacterWasEncountered[characterFromTarget] || 0

            matrix[row][column] = Math.min(
                matrix[row - 1][column - 1] + substitionCost, // substitution
                matrix[row][column - 1] + 1, // Addition
                matrix[row - 1][column] + 1, // Deletion
                matrix[lastMatchingRow][lastMatchingColumnOnRow] + (row - lastMatchingRow - 2) + 2 + (column - lastMatchingColumnOnRow - 2) // Transposition
            )
            lastMatchingColumnOnRow = substitionCost === 0 ? column : lastMatchingColumnOnRow
        }
        lastRowCharacterWasEncountered[characterFromSource] = row
    }
    return matrix[sourceLength + 1][targetLength + 1]
}
