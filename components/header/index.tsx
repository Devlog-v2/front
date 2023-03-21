import * as S from "./styled";
import Link from "next/link";
import Image from "next/image";
import profilenoneImg from "../../public/Img/profile.png";
import { useRouter } from "next/router";
import CustomAxios from "../../utils/lib/CustomAxios";
import { useEffect, useState } from "react";
import { UseRemoveToken } from "../../Hooks/useToken";

export default function Header() {
  const [userId, setUserid] = useState("");
  const [profileImg, setprofileImg] = useState("");
  const router = useRouter();
  const redirect = (url: string) => router.push(url);

  // useEffect(() => {
  //   async function Getprofile() {
  //     try {
  //       const respone = await CustomAxios.get("/user_name");
  //       console.log(respone.data.user_id);
  //       setUserid(respone.data.user_id);
  //       setprofileImg(respone.data.url);
  //     } catch (e: any) {
  //       console.error(e.message);
  //     }
  //   }
  //   Getprofile();
  // }, [router.query]);

  const Logout = () => {
    UseRemoveToken();
    redirect("/");
  };

  return (
    <S.HeaderWapper>
      <S.HeaderTopWapper>
        <S.HeaderBottomWapper>
          <Link href="/post">
            <a>
              <S.HeaderTitle>Devlog</S.HeaderTitle>
            </a>
          </Link>
          <Link href="/post">
            <a>홈</a>
          </Link>
          <Link href="/postAdd">
            <a>소개</a>
          </Link>
        </S.HeaderBottomWapper>

        <S.ProfileImg onClick={() => redirect(`/profile/${1}`)}>
          {profileImg ? (
            <Image
              src={profileImg}
              width={35}
              height={35}
              alt="프로필 이미지"
            />
          ) : (
            <Image
              src={profilenoneImg}
              width={35}
              height={35}
              alt="프로필 이미지"
            />
          )}
        </S.ProfileImg>
      </S.HeaderTopWapper>
    </S.HeaderWapper>
  );
}
