import { getSession } from "next-auth/react";
import { Flex, Button, Box, VStack } from "@chakra-ui/react";
import { useState } from "react";
import UserProfile from "../../components/UserProfile";
import Sidebar from "../../components/SideBar";
import axiosInstance from "../../services/axios";
import Post from "../../components/Post";
import CommentBox from "../../components/CommentBox";
import Comment from "../../components/Comment";

function PostDetail(props) {
  const { post } = props;
  const { comment } = props;

  const [listComment, setListComment] = useState(comment);
  const [commentLength, setCommentLength] = useState(props.commentLength);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const renderComment = () => {
    return listComment.map((comment) => {
      return <Comment key={comment.comment_id} comment={comment} />;
    });
  };

  const getComments = async () => {
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        params: { page: 1, pageSize },
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const newComment = await axiosInstance.get(
        `/comments/${post.post_id}`,
        config
      );
      setListComment(newComment.data.data);
      setPage(1);
    } catch (error) {
      if (error.response.data) return alert(error.response.data.message);
      alert(error.message);
    }
  };

  const getMoreHandler = async () => {
    setPage(page + 1);
    try {
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        params: { page: page + 1, pageSize },
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const newComment = await axiosInstance.get(
        `/comments/${post.post_id}`,
        config
      );
      setListComment([...listComment, ...newComment.data.data]);
    } catch (error) {
      if (error.response.data) return alert(error.response.data.message);
      alert(error.message);
    }
  };

  return (
    <VStack>
      <Flex
        height="100vh"
        width="full"
        maxWidth="100vw"
        ms="auto"
        me="auto"
        padding="0 10px"
      >
        <Sidebar />

        <Flex flexGrow={"0.4"} w="70%" flexDirection="column" marginInline={2}>
          <Post key={post.post_id} post={post} user={props.user}></Post>

          <Box
            rounded={5}
            boxShadow="md"
            marginBottom={2}
            padding="2"
            marginInlineStart={"25%"}
          >
            <CommentBox
              key={comment.comment_id}
              post_id={post.post_id}
              getComments={getComments}
            />
            {renderComment()}

            <Flex flexDirection="row-reverse" mt="2">
              {listComment.length < commentLength && (
                <Button variant="link" onClick={getMoreHandler}>
                  Show More Comment
                </Button>
              )}
            </Flex>
          </Box>
        </Flex>
        <UserProfile user={props.user} />
      </Flex>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });

    if (!session) return { redirect: { destination: "/login" } };

    const { accessToken } = session.user;
    const page = 1;
    const pageSize = 5;

    const config = {
      params: { page, pageSize },
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const { post_id } = context.params;

    const comment = await axiosInstance.get(`/comments/${post_id}`, config);
    const user = await axiosInstance.get("/users/profile/", config);
    const post = await axiosInstance.get(`/posts/${post_id}`, config);
    return {
      props: {
        post: post.data.data,
        user: user.data.data.result,
        comment: comment.data.data,
        commentLength: comment.data.length.length,
      },
    };
  } catch (error) {
    console.error(error.response.data);
    const { message } = error;

    return { props: { message } };
  }
}

export default PostDetail;
