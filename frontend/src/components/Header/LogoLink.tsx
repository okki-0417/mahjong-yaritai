import Image from "next/image";
import Link from "next/link";
import LogoImg from "@/public/logo.webp";

export default function LogoLink({ isLoggedIn }: { isLoggedIn: boolean }) {
  const homePath = isLoggedIn ? "/me" : "/top";

  return (
    <Link href={homePath}>
      <div className="flex items-center gap-2">
        <div className="overflow-hidden lg:size-auto size-8">
          <Image
            src={LogoImg}
            alt="麻雀好きが集まる場所"
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
        </div>
        <p className="font-bold text-xl md:text-2xl lg:text-3xl">
          麻雀ヤリタイ
        </p>
      </div>
    </Link>
  );
}
