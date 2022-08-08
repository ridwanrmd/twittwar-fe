import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Flex, Box, VStack } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import axiosInstance from "../../services/axios";
import Post from "../../components/Post";
import PostBox from "../../components/PostBox";
import UserProfile from "../../components/UserProfile";
import InfiniteScroll from "react-infinite-scroller";

function userPost(props) {
  const [post, setPost] = useState(props.post);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [isProcess, setIsProcess] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postLength, setPostLength] = useState(props.length);

  useEffect(() => {
    getPost();
  }, []);

  const morePost = async () => {
    if (postLength <= pageSize) {
      setHasMore(false);
    }
    setTimeout(async () => {
      const session = await getSession();
      const { accessToken } = session.user;
      const { user_id } = session.user;
      const config = {
        params: { page: page + 1, pageSize },
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const res = await axiosInstance.get(`/posts/userpost/${user_id}`, config);

      if (res) {
        const newPost = [...post, ...res.data.data];
        if (newPost.length >= postLength) {
          setHasMore(false);
        }
        setPost(newPost);
        setPage(page + 1);
      }
    }, 2000);
  };

  const getPost = async () => {
    const session = await getSession();
    const { accessToken } = session.user;
    const { user_id } = session.user;
    const config = {
      params: { page: 1, pageSize },
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const res = await axiosInstance.get(`/posts/userpost/${user_id}`, config);

    setPost(res.data.data);
    setPostLength(res.data.length);
    setPage(1);
    setHasMore(true);
  };

  const renderPost = () => {
    return post.map((post) => {
      return (
        <Post
          key={post.post_id}
          user={post.User}
          post={post}
          getPost={getPost}
        ></Post>
      );
    });
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
          <PostBox user={props.user} getPost={getPost} />
          {post ? (
            <InfiniteScroll
              pageStart={0}
              loadMore={morePost}
              hasMore={hasMore}
              loader={
                <Box
                  rounded={5}
                  boxShadow="md"
                  marginBottom={2}
                  padding="2"
                  marginInlineStart={"25%"}
                  key={0}
                >
                  wait a minute ...
                </Box>
              }
            >
              {renderPost()}
            </InfiniteScroll>
          ) : (
            <Box
              rounded={5}
              boxShadow="md"
              marginBottom={2}
              padding="2"
              marginInlineStart={"25%"}
            >
              <h1>No post yet</h1>
            </Box>
          )}
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

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const res = await axiosInstance.get("/users/profile/", config);

    return {
      props: {
        user: res.data.data.result,
        session,
      },
    };
  } catch (error) {
    console.error(error.response.data);
    const { message } = error;

    return { props: { message } };
  }
}

export default userPost;
