export function transformEmojiCounts(emojis) {
  //  emojis
  //   [
  //   { emoji: '🔥' },
  //   { emoji: '👍' },
  //   { emoji: '🌱' },
  //   { emoji: '💪' },
  //   { emoji: '✅' }
  // ]

  const emojiCounts = emojis.reduce((acc, { emoji }) => {
    acc[emoji] = (acc[emoji] || 0) + 1;
    return acc;
  }, {});
  //emojiCounts 배열로 받은 이모지 객체로 변환 숫자체크
  //{ '🔥': 1, '👍': 1, '🌱': 1, '💪': 1, '✅': 1 }

  //Object.entries(emojiCounts)
  // 객체를 [ ['🔥', 1] ] -> 이형태로 변환
  //map을 돌면서 [{  "emoji": "🔥","count": 1}] -> 이형태로 변환

  return Object.entries(emojiCounts).map(([emoji, count]) => ({
    emoji,
    count,
  }));
}
