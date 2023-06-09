import { useRouter } from "next/router";
import * as S from "./styled";
import Image from "next/image";
import {
  CalendarType,
  postListType,
  ProfileModifyType,
  ProfileType,
} from "../../types";
import profilenoneImg from "../../public/Img/profile.png";
import useSWR from "swr";
import { useEffect, useState } from "react";
import BoardItem from "../boarditem";
import CustomAxios from "../../utils/lib/CustomAxios";

export default function Profile() {
  const router = useRouter();
  const tenArr = Array.from(Array(40), (_, index) => index + 1);
  const sevenArr = Array.from(Array(7), (_, index) => index + 1);
  const userId = router.query.user_id;
  const { data: ProfileData, mutate } = useSWR<ProfileType>(
    `account/${userId}`
  );
  const { data: CalendarData } = useSWR<CalendarType[]>(
    `account/calendar/${userId}`
  );
  const { data: MyBoardData } = useSWR<postListType[]>(
    `account/post/${userId}`
  );
  const [boards, setBoards] = useState<postListType[]>();
  const service = ProfileData?.service;
  const [isModify, setIsModify] = useState(false);
  const [modifyState, setModifyState] = useState<ProfileModifyType>();

  useEffect(() => {
    setBoards(MyBoardData);
  }, [MyBoardData]);

  useEffect(() => {
    setModifyState({
      name: ProfileData?.name,
      profileUrl: ProfileData?.profileUrl,
      githubUrl: ProfileData?.githubUrl,
      service: ProfileData?.service,
      company: ProfileData?.company,
      readme: ProfileData?.readme,
    });
    console.log(ProfileData);
  }, [ProfileData]);

  const handleClickGrassBox = async (date: string) => {
    const { data } = await CustomAxios.get(`?date=${date}`);
    setBoards(data);
    mutate();
  };

  const handleProfileModiifyBtnClick = async () => {
    setIsModify((pre) => !pre);
    try {
      await CustomAxios.patch("account/", {
        name: modifyState?.name,
        profileUrl: modifyState?.profileUrl,
        githubUrl: modifyState?.githubUrl,
        service: modifyState?.service,
        company: modifyState?.company,
        readme: modifyState?.readme,
      });
      mutate();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeFile = async (e: any) => {
    e.preventDefault();
    let reader = new FileReader();
    if (e.target.files[0]) {
      let formData = new FormData();
      reader.readAsDataURL(e.target.files[0]);
      formData.append("image", e.target.files[0]);
      try {
        const { data } = await CustomAxios.post("/image/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setModifyState({ ...modifyState, profileUrl: data.imageUrl });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <S.Profile>
      {!isModify ? (
        <>
          <S.ProfileImpormation>
            <S.MyProfileWrapper>
              <S.ProfileImg>
                {modifyState?.profileUrl ? (
                  <Image
                    src={modifyState.profileUrl}
                    width={230}
                    height={230}
                    alt="profile 이미지"
                  />
                ) : (
                  <Image
                    width={230}
                    height={230}
                    src={profilenoneImg}
                    alt="profile 이미지"
                  />
                )}
              </S.ProfileImg>
              <S.User>
                <S.UserName>{ProfileData?.name}</S.UserName>
                <S.UserEmail>{`Mail : ${
                  ProfileData?.email || ""
                }`}</S.UserEmail>
                <S.UserEmail>{`Company : ${
                  ProfileData?.company || ""
                }`}</S.UserEmail>
                <S.GOEdit onClick={() => setIsModify((pre) => !pre)}>
                  프로필 수정
                </S.GOEdit>
              </S.User>
            </S.MyProfileWrapper>
            <S.MyService>
              <S.ServiceBox>
                <S.ServiceTitle>service</S.ServiceTitle>
                <S.ServiceContents>
                  {service &&
                    service.map((i, idx) => (
                      <S.ServiceContent key={idx}>{i}</S.ServiceContent>
                    ))}
                </S.ServiceContents>
              </S.ServiceBox>
            </S.MyService>
          </S.ProfileImpormation>
        </>
      ) : (
        <>
          <S.ProfileImpormation>
            <S.MyProfileWrapper>
              <S.ProfileImg>
                {modifyState?.profileUrl ? (
                  <Image
                    src={modifyState.profileUrl}
                    width={230}
                    height={230}
                    alt="profile 이미지"
                  />
                ) : (
                  <Image
                    width={230}
                    height={230}
                    src={profilenoneImg}
                    alt="profile 이미지"
                  />
                )}
                <form name="files" method="post" encType="multipart/form-data">
                  <input
                    id="change_img"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleChangeFile}
                    accept="image/*"
                  />
                </form>
                <label htmlFor="change_img">변경</label>
              </S.ProfileImg>
              <S.User>
                <S.UserNameInput
                  value={modifyState?.name}
                  onChange={({ target }) =>
                    setModifyState({ ...modifyState, name: target.value })
                  }
                />
                <S.UserEmail>{`Mail : ${
                  ProfileData?.email || ""
                }`}</S.UserEmail>
                <S.UserEmail>
                  <span>Company : </span>
                  <S.ModifyCompanyInput
                    value={modifyState?.company}
                    onChange={({ target }) =>
                      setModifyState({ ...modifyState, company: target.value })
                    }
                  />
                </S.UserEmail>
                <S.GOEdit onClick={handleProfileModiifyBtnClick}>
                  프로필 저장
                </S.GOEdit>
              </S.User>
            </S.MyProfileWrapper>
            <S.MyService>
              <S.ServiceBox>
                <S.ServiceTitle>service</S.ServiceTitle>
                <S.ServiceContents>
                  {service &&
                    service.map((i, idx) => (
                      <S.ServiceContent key={idx}>{i}</S.ServiceContent>
                    ))}
                </S.ServiceContents>
              </S.ServiceBox>
            </S.MyService>
          </S.ProfileImpormation>
        </>
      )}

      <S.ProfileRightWrapper>
        {!isModify ? (
          <S.IntroMd>{ProfileData?.readme}</S.IntroMd>
        ) : (
          <S.IntroMdModify
            value={modifyState?.readme}
            onChange={({ target }) =>
              setModifyState({ ...modifyState, readme: target.value })
            }
          />
        )}
        <S.TableWrapper>
          <table>
            <tbody>
              {sevenArr.map((i) => (
                <tr key={i}>
                  {tenArr.map((it) => (
                    <td key={it}>
                      <S.GrassBox
                        style={{
                          background:
                            CalendarData &&
                            CalendarData[it * i - 1]?.postCount &&
                            it <= i
                              ? "#aa77ff"
                              : "#EAEEF2",
                        }}
                        onClick={() =>
                          handleClickGrassBox(
                            (CalendarData && CalendarData[it]?.date) || ""
                          )
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </S.TableWrapper>
        <S.BoardsWrapper>
          {boards ? (
            boards.map((i) => (
              <BoardItem
                key={i.idx}
                idx={i.idx}
                title={i.title}
                isMine={i.isMine}
                content={i.content}
                writer={i.writer}
                likeCount={i.likeCount}
                createdDate={i.createdDate}
              />
            ))
          ) : (
            <p>로딩중</p>
          )}
        </S.BoardsWrapper>
      </S.ProfileRightWrapper>
    </S.Profile>
  );
}
