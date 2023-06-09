import { GetServerSideProps, NextPage } from "next";
import { BoardIn } from "../../components";
import { PostIdType } from "../../types";
import CustomAxios from "../../utils/lib/CustomAxios";
import { SWRConfig } from "swr";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("../../components/header"), { ssr: false });

const BoardInPage: NextPage<{ fallback: Record<string, PostIdType> }> = ({
  fallback,
}) => {
  return (
    <SWRConfig value={fallback}>
      <Header />
      <BoardIn />
    </SWRConfig>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { postid } = ctx.query;

  try {
    const { data: blogIndata } = await CustomAxios.get(`/post/${postid}`);
    return {
      props: {
        fallback: {
          [`/post/${postid}`]: blogIndata,
        },
      },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default BoardInPage;

// export const getStaticPaths:GetStaticPaths = async () => {
//   // const allCookies = cookies(ctx);
//   // const accessTokenByCookie = allCookies['Authorization'] || "";

//   // const { data } = await CustomAxios.get(`/post`, {
//   //   headers: {
//   //     Authorization: accessTokenByCookie,
//   //   },
//   // });

//   // const paths: BlogType[] = data.list.map((post : BlogType) => ({
//   //   params: { id: post.board_id },
//   // }))

//   return { paths : [], fallback: true }

// }

// export const getStaticProps:GetStaticProps = async (ctx) => {
//   const { params: { id }} = ctx as any;
//   const  board_id  = id;
//   // const allCookies = cookies(ctx);
//   // const accessTokenByCookie = allCookies['Authorization'] || "";

//   try {
//     const { data } = await CustomAxios.get(`/post/${board_id}`, {
//       headers: {
//           Authorization: accessTokenByCookie,
//       },
//     });
//     if (data) {
//       const blogIndata = data;
//       return { props: { blogIndata } };
//     }
//     return { props: {} };
//   } catch (error) {
//     console.log(error);
//     return { props: {} };
//   }
// }
