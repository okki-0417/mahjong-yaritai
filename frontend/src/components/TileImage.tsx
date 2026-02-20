import Image, { StaticImageData } from "next/image";
import Tile1 from "@/public/tiles/1.webp";
import Tile2 from "@/public/tiles/2.webp";
import Tile3 from "@/public/tiles/3.webp";
import Tile4 from "@/public/tiles/4.webp";
import Tile5 from "@/public/tiles/5.webp";
import Tile6 from "@/public/tiles/6.webp";
import Tile7 from "@/public/tiles/7.webp";
import Tile8 from "@/public/tiles/8.webp";
import Tile9 from "@/public/tiles/9.webp";
import Tile10 from "@/public/tiles/10.webp";
import Tile11 from "@/public/tiles/11.webp";
import Tile12 from "@/public/tiles/12.webp";
import Tile13 from "@/public/tiles/13.webp";
import Tile14 from "@/public/tiles/14.webp";
import Tile15 from "@/public/tiles/15.webp";
import Tile16 from "@/public/tiles/16.webp";
import Tile17 from "@/public/tiles/17.webp";
import Tile18 from "@/public/tiles/18.webp";
import Tile19 from "@/public/tiles/19.webp";
import Tile20 from "@/public/tiles/20.webp";
import Tile21 from "@/public/tiles/21.webp";
import Tile22 from "@/public/tiles/22.webp";
import Tile23 from "@/public/tiles/23.webp";
import Tile24 from "@/public/tiles/24.webp";
import Tile25 from "@/public/tiles/25.webp";
import Tile26 from "@/public/tiles/26.webp";
import Tile27 from "@/public/tiles/27.webp";
import Tile28 from "@/public/tiles/28.webp";
import Tile29 from "@/public/tiles/29.webp";
import Tile30 from "@/public/tiles/30.webp";
import Tile31 from "@/public/tiles/31.webp";
import Tile32 from "@/public/tiles/32.webp";
import Tile33 from "@/public/tiles/33.webp";
import Tile34 from "@/public/tiles/34.webp";
import tileNameById from "@/src/lib/utils/tileNameById";
import { Center } from "@chakra-ui/react";

export const tileImagePathByTileId: Record<number, StaticImageData> = {
  1: Tile1,
  2: Tile2,
  3: Tile3,
  4: Tile4,
  5: Tile5,
  6: Tile6,
  7: Tile7,
  8: Tile8,
  9: Tile9,
  10: Tile10,
  11: Tile11,
  12: Tile12,
  13: Tile13,
  14: Tile14,
  15: Tile15,
  16: Tile16,
  17: Tile17,
  18: Tile18,
  19: Tile19,
  20: Tile20,
  21: Tile21,
  22: Tile22,
  23: Tile23,
  24: Tile24,
  25: Tile25,
  26: Tile26,
  27: Tile27,
  28: Tile28,
  29: Tile29,
  30: Tile30,
  31: Tile31,
  32: Tile32,
  33: Tile33,
  34: Tile34,
};

export default function TileImage({
  tile,
  tileId,
  hover = true,
  className,
  isShiny = false,
}: {
  tile?: number | string;
  tileId?: number | string;
  hover?: boolean;
  className?: string;
  isShiny?: boolean;
}) {
  const src = tileImagePathByTileId[tileId || tile];
  const alt = tileNameById[tileId || tile] || "";

  return (
    <Center className="aspect-tile relative overflow-hidden">
      <Image
        width={47}
        height={63}
        src={src}
        alt={alt}
        draggable="false"
        className={`transition-all rounded ${className} ${hover && "hover:scale-110"}`}
        loading="lazy"
      />

      <div className={`${isShiny ? "shining-tile" : "hidden"}`} />
    </Center>
  );
}
