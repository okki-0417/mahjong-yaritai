type GameResult = {
  resultPoints: number | null;
  ranking: number | null;
};

export function calculateRanking(results: GameResult[]): GameResult[] {
  // null と NaN は順位計算から除外
  const validResults = results
    .map((result, index) => ({
      index,
      resultPoints: result.resultPoints,
    }))
    .filter(item => item.resultPoints !== null && !Number.isNaN(item.resultPoints));

  // resultPoints でソート（降順）
  const sortedResults = validResults.sort((a, b) => b.resultPoints! - a.resultPoints!);

  // 結果を格納する配列を初期化
  const calculatedResults: GameResult[] = results.map(result => ({
    ...result,
    ranking: null,
  }));

  // 同点の場合は同じ順位を付与
  let currentRank = 1;
  sortedResults.forEach((sortedResult, idx) => {
    // 前の人と点数が異なる場合のみ順位を更新
    if (idx > 0 && sortedResults[idx - 1].resultPoints !== sortedResult.resultPoints) {
      currentRank = idx + 1;
    }

    const participantIndex = sortedResult.index;
    const ranking = currentRank;

    calculatedResults[participantIndex] = {
      ...calculatedResults[participantIndex],
      ranking,
    };
  });

  return calculatedResults;
}
