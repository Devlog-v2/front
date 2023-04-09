import * as S from "./styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { UseGeTokenDocument, UseRemoveToken } from "../../Hooks/useToken";
import useSWR from "swr";
import { ProfileType } from "../../types";

export default function Header() {
  const router = useRouter();
  const redirect = (url: string) => router.push(url);
  const { data: profileData } = useSWR<ProfileType>("/account/");
  const { Authorization, RefreshToken } = UseGeTokenDocument();
  const isLogin = Authorization ? true : false;

  const Logout = () => {
    UseRemoveToken();
    redirect("/");
  };

  return (
    <S.HeaderWapper>
      <S.HeaderTopWapper>
        <S.HeaderLeftWapper>
          <Link href="/post">
            <a>
              <S.HeaderTitle>Devlog</S.HeaderTitle>
            </a>
          </Link>
        </S.HeaderLeftWapper>
        <S.HeaderRightWapper>
          <Link href="/post">
            <a>홈</a>
          </Link>
          <Link href="/post/add">
            <a>생성</a>
          </Link>
          <Link
            href={
              isLogin ? `/profile/${profileData?.accountIdx}` : `/auth/signin`
            }
          >
            <a>{isLogin ? "프로필" : "로그인"}</a>
          </Link>
        </S.HeaderRightWapper>
      </S.HeaderTopWapper>
    </S.HeaderWapper>
  );
}
