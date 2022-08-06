import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Flex, Button, Box, Text, HStack, VStack } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import axiosInstance from "../../services/axios";
import Post from "../../components/Post";
import PostBox from "../../components/PostBox";
import InfiniteScroll from "react-infinite-scroller";
import UserProfile from "../../components/UserProfile";

function Home(props) {
  // console.log(props);
  const [post, setPost] = useState(props.post);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [isProcess, setIsProcess] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [postLength, setPostLength] = useState(props.length);

  const morePost = async () => {
    setTimeout(async () => {
      const res = await axiosInstance.get("/posts/", {
        params: { page: page + 1, pageSize },
      });

      if (res) {
        const newPost = [...post, ...res.data.data];
        if (newPost.length >= postLength) {
          setHasMore(false);
        }
        setPost(newPost);
        setPage(page + 1);
      }
    }, 500);
  };

  const getPost = async () => {
    const res = await axiosInstance.get("/posts/", {
      params: { page: 1, pageSize },
    });

    setPost(res.data.data);
    setPostLength(res.data.length);
    setPage(1);
    setHasMore(true);
  };

  const resendVerification = async () => {
    setIsProcess(!isProcess);
    const body = {
      email: props.user.email,
      user_id: props.user.user_id,
    };
    await axiosInstance.post("/users/verify", body);
    alert("Success sending verification email");
    setIsProcess(false);
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
      <Box backgroundColor={"gray.100"} mt="2" rounded="12">
        {!props.user.isVerified && (
          <HStack paddingBlock="1" paddingInline="6">
            <Text>Click to resend a verification email</Text>
            <Button
              isProcess={isProcess}
              backgroundColor={"red.500"}
              onClick={resendVerification}
            >
              Resend
            </Button>
          </HStack>
        )}
      </Box>
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
          <InfiniteScroll
            pageStart={0}
            loadMore={morePost}
            loader={
              <Box
                rounded={5}
                boxShadow="md"
                marginBottom={2}
                padding="2"
                marginInlineStart={"25%"}
                key={0}
              >
                Loading ...
              </Box>
            }
          >
            {renderPost()}
          </InfiniteScroll>
        </Flex>
        <UserProfile user={props.user} />
      </Flex>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    // console.log({ session });

    if (!session) return { redirect: { destination: "/login" } };

    const { accessToken } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const page = 1;
    const pageSize = 3;

    const res = await axiosInstance.get("/users/profile/", config);
    const getPost = await axiosInstance.get("/posts/", {
      params: { page, pageSize },
    });
    console.log(getPost.data.data);

    return {
      props: {
        user: res.data.data.result,
        post: getPost.data.data,
        length: getPost.data.length,
        session,
      },
    };
  } catch (error) {
    console.error(error.response.data);
    const { message } = error;

    return { props: { message } };
  }
}

export default Home;
