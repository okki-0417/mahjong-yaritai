export default function getTileNameById(tileId: number): string | null {
  if (tileId < 1 || tileId > 34) {
    return null;
  }

  switch (tileId) {
    case 1:
      return "一萬";
    case 2:
      return "二萬";
    case 3:
      return "三萬";
    case 4:
      return "四萬";
    case 5:
      return "五萬";
    case 6:
      return "六萬";
    case 7:
      return "七萬";
    case 8:
      return "八萬";
    case 9:
      return "九萬";
    case 10:
      return "一筒";
    case 11:
      return "二筒";
    case 12:
      return "三筒";
    case 13:
      return "四筒";
    case 14:
      return "五筒";
    case 15:
      return "六筒";
    case 16:
      return "七筒";
    case 17:
      return "八筒";
    case 18:
      return "九筒";
    case 19:
      return "一索";
    case 20:
      return "二索";
    case 21:
      return "三索";
    case 22:
      return "四索";
    case 23:
      return "五索";
    case 24:
      return "六索";
    case 25:
      return "七索";
    case 26:
      return "八索";
    case 27:
      return "九索";
    case 28:
      return "東";
    case 29:
      return "南";
    case 30:
      return "西";
    case 31:
      return "北";
    case 32:
      return "白";
    case 33:
      return "發";
    case 34:
      return "中";
    default:
      return null;
  }
}
