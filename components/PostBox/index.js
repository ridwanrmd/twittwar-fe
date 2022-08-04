import { Box, Image, Flex, Textarea, Icon, Button } from "@chakra-ui/react";
import { useState } from "react";
import { api_origin } from "../../constraint";
import { BsCardImage } from "react-icons/bs";
import { CloseIcon } from "@chakra-ui/icons";
import axiosInstance from "../../services/axios";
import { getSession } from "next-auth/react";

export default function PostBox(props) {
  const [user, setUser] = useState(props.user);
  const [caption, setCaption] = useState("");
  const [post_image, setPostImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(!props.user.isVerified);

  const { getPost } = props;

  const postHandler = async () => {
    if (!props.user.isVerified) return alert("You need to verify your account");
    setIsLoading(true);
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const newPost = {
      caption,
    };
    if (post_image) {
      const data = new FormData();
      const fileName = Date.now() + post_image.name;
      data.append("name", fileName);
      data.append("post_image", post_image);
      newPost.postImage = `/public/post/${fileName}`;
      try {
        await axiosInstance.post("/posts/upload", data, config);
      } catch (error) {
        console.log({ Error });
        return alert(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    }
    try {
      await axiosInstance.post("/posts", newPost, config);
      setIsLoading(false);
      setDesc("");
      setPostImage(null);
      getPost();
    } catch (error) {}
  };

  return (
    <Box
      rounded={5}
      boxShadow="md"
      marginBottom={2}
      padding="2"
      marginInlineStart={"25%"}
    >
      <Flex flexWrap="wrap">
        <Image
          src={api_origin + user.image}
          width="40px"
          height="40px"
          objectFit={"cover"}
          rounded="full"
        />
        <Textarea
          isDisabled={isDisabled}
          variant="unstyled"
          width="90%"
          marginStart={4}
          resize="none"
          height="fit-content"
          placeholder="Confront somebody?"
          value={caption}
          onChange={(e) => setDesc(e.target.value)}
        />
        {post_image && (
          <Flex flexDirection="column">
            <CloseIcon onClick={() => setPostImage(null)} />
            <Image
              maxHeight="400px"
              width="90%"
              rounded="10"
              src={URL.createObjectURL(post_image)}
            />
          </Flex>
        )}
      </Flex>
      <Flex justifyContent="space-between" marginTop={2}>
        <label
          htmlFor="post_image"
          style={{
            alignItems: "center",
            cursor: "pointer",
            marginLeft: "60px",
            marginTop: "5px",
          }}
        >
          <Icon as={BsCardImage} color="green.200" fontSize={"20px"} />
          <input
            style={{ display: "none" }}
            type="file"
            id="post_image"
            disabled={isDisabled}
            onChange={(e) => setPostImage(e.target.files[0])}
          />
        </label>
        <Button
          isLoading={isLoading}
          variant="solid"
          colorScheme="red"
          rounded="lg"
          onClick={postHandler}
        >
          WAR!
        </Button>
      </Flex>
    </Box>
  );
}
