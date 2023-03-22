import { useRouter } from "next/router";
import Image from "next/image";
import profilenoneImg from "../../public/Img/profile.png";
import * as S from "./styled";
import { useEffect, useState } from "react";
import { PostIdType } from "../../types";
import whiteImg from "../../public/Img/white.png";
import useSWR from "swr";
import { Comment } from "../index";
import CustomAxios from "../../utils/lib/CustomAxios";

const BoardIn = () => {
  const router = useRouter();
  const redirect = (url: string) => router.push(url);
  const { data: boardIndata, mutate } = useSWR<PostIdType>(
    `post/${router.query.postid}`
  );
  const [DelectDisplay, setDelectDisplay] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [commentValue, setCommentValue] = useState("");
  // const {data:user} = useSWR<userType>(`/user/${boardIndata?.userId}`);

  useEffect(() => {
    if (boardIndata?.isMine) {
      setDelectDisplay(true);
    } else {
      setDelectDisplay(false);
    }
    console.log(boardIndata);
  }, [boardIndata]);

  const handleClick = async () => {
    if (!commentValue) return console.log("글을 작성하셈");
    try {
      const res = await CustomAxios.post(`/comment/${router.query.postid}`, {
        comment: commentValue,
      });
      mutate();
      setCommentValue("");
      console.log(res);
    } catch (e) {
      console.log(e);
    }
  };

  const DelectBoard = async () => {
    try {
      await CustomAxios.delete(`/post/${boardIndata?.idx}`);
      redirect("/post");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <S.BoardInWapper>
      <S.Title>{boardIndata?.title}</S.Title>
      <S.NameDate>
        <S.Name>
          <span>{boardIndata?.writer.name}</span> · {boardIndata?.createdDate}
        </S.Name>
      </S.NameDate>
      <S.TextBox>
        {boardIndata?.images && boardIndata?.images.length > 0 ? (
          <Image
            src={boardIndata?.images[0] ?? whiteImg}
            width={200}
            height={550}
            objectFit={"cover"}
            alt="boardIn 이미지"
          />
        ) : (
          <Image src={whiteImg} width={200} height={150} alt="로딩 이미지" />
        )}
        <S.desc>{boardIndata?.content}</S.desc>
      </S.TextBox>
      <S.ProfileWapper>
        {profileImg ? (
          <Image
            src={profileImg ?? profilenoneImg}
            width={100}
            height={100}
            objectFit="cover"
            alt="profile 이미지"
          />
        ) : (
          <Image
            src={profilenoneImg}
            width={100}
            height={100}
            objectFit="cover"
            alt="profile 이미지"
          />
        )}
        <S.ProfileName>{boardIndata?.writer.name}</S.ProfileName>
      </S.ProfileWapper>
      <S.CommentCreateWapper>
        <S.CommentInput
          onChange={(e) => setCommentValue(e.target.value)}
          value={commentValue}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleClick();
          }}
        />
        <S.CreateBtn onClick={handleClick}>댓글작성</S.CreateBtn>
      </S.CommentCreateWapper>

      <S.CommentsWapper>
        {boardIndata?.comment ? (
          boardIndata?.comment.map((item, index) => (
            <Comment
              key={index}
              name={item.writer.name}
              contant={item.comment}
              isMine={item.isMine}
              commentId={item.id}
            />
          ))
        ) : (
          <p>loadding...</p>
        )}
      </S.CommentsWapper>
    </S.BoardInWapper>
  );
};

export default BoardIn;
