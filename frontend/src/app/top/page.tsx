import { BsGraphUpArrow } from "react-icons/bs";
import { FaAngleRight } from "react-icons/fa";
import { GiThink } from "react-icons/gi";
import { RiArticleFill } from "react-icons/ri";
import Link from "next/link";
import TileImage, { tileImagePathByTileId } from "@/src/components/TileImage";
import MainVisual from "@/public/main-visual.webp";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "麻雀ヤリタイ",
  description: "麻雀ヤリタイは、麻雀を愛する人が集まり、語らう場所です。",
  openGraph: {
    title: "麻雀ヤリタイ",
    description: "麻雀を愛する人が集まり、語らう場所。",
  },
};

export default function Top() {
  return (
    <div className="w-full">
      <div className="h-[650px] relative">
        <div className="absolute top-1/2 -translate-y-1/2 w-full text-white z-20 flex sm:flex-col flex-row-reverse justify-center items-center sm:gap-0 gap-2 sm:pr-0 pr-8">
          <h1 className="fade-in sm:text-center text-start font-bold sm:text-[clamp(0px,10vw,120px)] text-7xl sm:[writing-mode:_horizontal-tb] [writing-mode:_vertical-rl] tracking-widest">
            麻雀
            <br className="sm:hidden" />
            <span className="sm:pt-0 pt-8">ヤリタイ</span>
          </h1>
          <h2 className="delayed-fade-in text-center font-semibold sm:text-[clamp(12px,10vw,32px)] sm:[writing-mode:_horizontal-tb] [writing-mode:_vertical-rl]">
            麻雀が好きな人が集まる場所
          </h2>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-blue-900 opacity-[0.5] z-10"></div>
        <Image
          src={MainVisual}
          alt="新しく麻雀を始めたい人が集まる場所"
          className="w-full h-full object-cover contrast-125"
        />
      </div>

      <div className="mt-12 h-24 marquee-container">
        <div className="flex gap-3 marquee-inner">
          {Object.keys(tileImagePathByTileId).map((id, index) => (
            <TileImage tile={Number(id)} hover={false} key={index} />
          ))}
        </div>
        <div className="flex gap-3 marquee-inner">
          {Object.keys(tileImagePathByTileId).map((id, index) => (
            <TileImage tile={Number(id)} hover={false} key={index} />
          ))}
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto px-6">
        <div className="lg:mt-20 mt-12 text-white relative">
          <img
            src="/bg-icon-1.webp"
            alt=""
            className="w-2/5 opacity-5 absolute inset-x-0 sm:-top-16 mx-auto -z-10"
          />
          <div>
            <h2 className="lg:text-4xl text-2xl font-bold">
              <span>麻雀が好きな人が集まる場所</span>
            </h2>
            <div className="mt-5 sm:text-xl text-lg">
              <p>｢麻雀ヤリタイ｣は、麻雀を愛する人が集まり、語らう場所です。</p>
              <p className="mt-2">
                色んな人と最近の対局の話をしたり、好きなプロ雀士について語り合ったり、何切る問題を出し合ったり、日々の麻雀の成績を記録したり、一緒に麻雀をしたり！
              </p>
              <p className="mt-8">
                また、「麻雀をやりたいけど難しそうだから始められていない。」という、「麻雀ハジメタイ」人が麻雀を始める助けになるような場所も目指しています。
              </p>
            </div>
          </div>
        </div>

        <div className="lg:mt-28 mt-20 text-white">
          <div>
            <h2 className="lg:text-4xl text-2xl font-bold">はじめる</h2>
            <p className="mt-5 sm:text-xl text-lg">
              以下からお好きなコンテンツを選んで、お楽しみください！
            </p>
            <div className="mt-8 leading-loose">
              <ul className="mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4 sm:text-[clamp(16px,2vw,20px)]">
                <div className="rounded border-2 border-gray-500 opacity-60 cursor-not-allowed relative">
                  <li className="flex justify-between items-center gap-1 py-4 px-6 h-full">
                    <div className="flex items-center gap-5">
                      <RiArticleFill size={30} color="gray" />
                      <span className="lg:text-2xl text-lg font-bold text-gray-400">
                        麻雀ハジメタイ
                      </span>
                    </div>
                    <span className="text-sm text-gray-400 absolute top-2 right-2">
                      Coming Soon
                    </span>
                  </li>
                </div>

                <Link
                  href="/what-to-discard-problems"
                  className="rounded hover:underline transition-all border-2 border-white">
                  <li className="flex justify-between items-center gap-1 py-4 px-6 h-full">
                    <div className="flex items-center gap-5">
                      <GiThink size={40} color="white" />
                      <span className="lg:text-2xl text-lg font-bold">何切る問題集</span>
                    </div>
                    <FaAngleRight />
                  </li>
                </Link>

                <div className="rounded border-2 border-gray-500 opacity-60 cursor-not-allowed relative">
                  <li className="flex justify-between items-center gap-1 py-4 px-6 h-full">
                    <div className="flex items-center gap-5">
                      <RiArticleFill size={30} color="gray" />
                      <span className="lg:text-2xl text-lg font-bold text-gray-400">
                        麻雀に関する記事
                      </span>
                    </div>
                    <span className="text-sm text-gray-400 absolute top-2 right-2">
                      Coming Soon
                    </span>
                  </li>
                </div>

                <div className="rounded border-2 border-gray-500 opacity-60 cursor-not-allowed relative">
                  <li className="flex justify-between items-center gap-1 py-4 px-6 h-full">
                    <div className="flex items-center gap-5">
                      <BsGraphUpArrow size={30} color="gray" />
                      <span className="lg:text-2xl text-lg font-bold text-gray-400">
                        戦績の記録
                      </span>
                    </div>
                    <span className="text-sm text-gray-400 absolute top-2 right-2">
                      Coming Soon
                    </span>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
