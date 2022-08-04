import { useState } from "react";
import {
  Box,
  Text,
  Image,
  Flex,
  IconButton,
  Spacer,
  Button,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
} from "@chakra-ui/react";

import axiosInstance from "../../services/axios";
import { getSession } from "next-auth/react";
import { api_origin } from "../../constraint";
import {
  BsHeart,
  BsHeartFill,
  BsThreeDots,
  BsPencil,
  BsChatRightText,
} from "react-icons/bs";
import moment from "moment";
import { DeleteIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

export default function Post(props) {
  const [likes, setLikes] = useState(props.post.likes.length);
  const [comments, setComments] = useState(props.post.comments.length);
  const [isLiked, setIsLiked] = useState(
    props.post.likes.includes(props.user._id)
  );
  const [editMode, setEditMode] = useState(false);
  const [post, setPost] = useState(props.post);

  const onDeleteHandler = async () => {
    try {
      if (!props.user.isVerified)
        return alert("You need to verify your account");

      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const isDeleted = await axiosInstance.delete(
        `/posts/${post.post_id}`,
        config
      );
      alert(isDeleted.data.message);
      if (props.getPost) {
        props.getPost();
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onEditHandler = async () => {
    try {
      if (!props.user.isVerified)
        return alert("You need to verify your account");
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      const body = {
        desc: post.desc,
      };
      const editPost = await axiosInstance.patch(
        `/posts/update/${post._id}`,
        body,
        config
      );
      alert(editPost.data.message);
      setEditMode(false);
    } catch (error) {
      if (error.response.data) return alert(error.response.data.message);
      alert(error.message);
    }
  };

  const onLikeHandler = async () => {
    try {
      if (!props.user.isVerified)
        return alert("You need to verify your account");
      const session = await getSession();
      const { accessToken } = session.user;
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      await axiosInstance.put(
        `/posts/${post._id}`,
        {
          userId: props.user._id,
        },
        config
      );
    } catch (error) {}
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  const onChangeHandler = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };
  return (
    <>
      {!editMode ? (
        <Box
          rounded={5}
          boxShadow="md"
          marginBottom={2}
          padding="2"
          marginInlineStart={"25%"}
        >
          <Flex>
            <Image
              src={api_origin + post.postedBy.profilePicture}
              height="45px"
              width="45px"
              objectFit={"cover"}
              rounded={"full"}
              marginBottom={2}
            ></Image>
            <Text marginStart={3} marginTop={2} fontSize="xl">
              @{post.postedBy.username}
            </Text>
            <Text marginStart={3} marginTop={3}>
              {moment(post.createdAt).fromNow()}
            </Text>
            <Spacer />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDots />}
                variant="ghost"
              />
              {post.postedBy._id === props.user._id && (
                <MenuList>
                  <MenuItem
                    icon={<BsPencil />}
                    onClick={() => {
                      if (!props.user.isVerified)
                        return alert("You need to verify your account");
                      setEditMode(!editMode);
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={() => {
                      if (!props.user.isVerified)
                        return alert("You need to verify your account");
                      onDeleteHandler();
                    }}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              )}
            </Menu>
          </Flex>
          {props.user.isVerified ? (
            <NextLink href={`/post/${post._id}`}>
              <Link variant="unstyle">
                <Text marginStart={12} marginBottom={2}>
                  {post.desc}
                </Text>
                {post.postImage && (
                  <Image
                    marginStart={12}
                    rounded="10"
                    src={api_origin + post.postImage}
                    maxHeight="400px"
                    width="90%"
                  ></Image>
                )}
              </Link>
            </NextLink>
          ) : (
            <NextLink href="#">
              <Link variant="unstyle">
                <Text marginStart={12} marginBottom={2}>
                  {post.desc}
                </Text>
                {post.postImage && (
                  <Image
                    marginStart={12}
                    rounded="10"
                    objectFit={"cover"}
                    src={api_origin + post.postImage}
                    maxHeight="400px"
                    width="90%"
                  ></Image>
                )}
              </Link>
            </NextLink>
          )}
          <Flex flexDirection={"row"}>
            {isLiked ? (
              <IconButton
                marginStart={10}
                padding="3"
                variant={"unstyled"}
                color="red.400"
                _hover={{
                  background: "#e8f5fe",
                  color: "red.400",
                  rounded: "full",
                }}
                icon={<BsHeartFill />}
                onClick={onLikeHandler}
              ></IconButton>
            ) : (
              <IconButton
                marginStart={10}
                padding="3"
                variant={"unstyled"}
                _hover={{
                  background: "#e8f5fe",
                  color: "red.400",
                  borderRadius: "25px",
                }}
                icon={<BsHeart />}
                onClick={onLikeHandler}
              ></IconButton>
            )}
            <Text marginTop={1.5}>{likes}</Text>
            {props.user.isVerified ? (
              <NextLink href={`/post/${post._id}`}>
                <Link variant="unstyle">
                  <IconButton
                    marginStart={10}
                    padding="3"
                    variant={"unstyled"}
                    _hover={{
                      background: "#e8f5fe",
                      color: "red.400",
                      borderRadius: "25px",
                    }}
                    icon={<BsChatRightText />}
                  ></IconButton>
                </Link>
              </NextLink>
            ) : (
              <NextLink href={`#`}>
                <Link variant="unstyle">
                  <IconButton
                    marginStart={10}
                    padding="3"
                    variant={"unstyled"}
                    _hover={{
                      background: "#e8f5fe",
                      color: "red.400",
                      borderRadius: "25px",
                    }}
                    icon={<BsChatRightText />}
                  ></IconButton>
                </Link>
              </NextLink>
            )}
            <Text marginTop={1.5}>{comments}</Text>
          </Flex>
        </Box>
      ) : (
        <Box
          rounded={5}
          boxShadow="md"
          marginBottom={2}
          padding="2"
          marginInlineStart={"25%"}
        >
          <Flex>
            <Image
              src={api_origin + post.postedBy.profilePicture}
              height="45px"
              width="45px"
              objectFit={"cover"}
              rounded={"full"}
              marginBottom={2}
            ></Image>
            <Text marginStart={3} marginTop={2} fontSize="xl">
              @{post.postedBy.username}
            </Text>
            <Spacer />
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<BsThreeDots />}
                variant="ghost"
              />
              {post.postedBy._id === props.user._id && (
                <MenuList>
                  <MenuItem
                    icon={<BsPencil />}
                    onClick={() => {
                      if (!props.user.isVerified)
                        return alert("You need to verify your account");
                      setEditMode(!editMode);
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={() => {
                      if (!props.user.isVerified)
                        return alert("You need to verify your account");
                      onDeleteHandler();
                    }}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              )}
            </Menu>
          </Flex>
          <Textarea
            marginStart={12}
            marginBottom={2}
            name="desc"
            variant="unstyled"
            value={post.desc}
            onChange={onChangeHandler}
          />
          {post.postImage && (
            <Image
              marginStart={12}
              rounded="10"
              objectFit={"cover"}
              src={api_origin + post.postImage}
              maxHeight="400px"
              width="90%"
            ></Image>
          )}
          <Flex flexDirection={"row"} justifyContent="space-between">
            <Flex marginTop="2">
              {isLiked ? (
                <IconButton
                  marginStart={10}
                  padding="3"
                  variant={"unstyled"}
                  color="red.400"
                  _hover={{
                    background: "#e8f5fe",
                    color: "red.400",
                    rounded: "full",
                  }}
                  icon={<BsHeartFill />}
                  onClick={onLikeHandler}
                ></IconButton>
              ) : (
                <IconButton
                  marginStart={10}
                  padding="3"
                  variant={"unstyled"}
                  _hover={{
                    background: "#e8f5fe",
                    color: "red.400",
                    borderRadius: "25px",
                  }}
                  icon={<BsHeart />}
                  onClick={onLikeHandler}
                ></IconButton>
              )}
              <Text marginTop={1.5}>{likes}</Text>
              {props.user.isVerified ? (
                <NextLink href={`/post/${post._id}`}>
                  <Link variant="unstyle">
                    <IconButton
                      marginStart={10}
                      padding="3"
                      variant={"unstyled"}
                      _hover={{
                        background: "#e8f5fe",
                        color: "red.400",
                        borderRadius: "25px",
                      }}
                      icon={<BsChatRightText />}
                    ></IconButton>
                  </Link>
                </NextLink>
              ) : (
                <NextLink href={`#`}>
                  <Link variant="unstyle">
                    <IconButton
                      marginStart={10}
                      padding="3"
                      variant={"unstyled"}
                      _hover={{
                        background: "#e8f5fe",
                        color: "red.400",
                        borderRadius: "25px",
                      }}
                      icon={<BsChatRightText />}
                    ></IconButton>
                  </Link>
                </NextLink>
              )}
              <Text marginTop={1.5}>{comments}</Text>
            </Flex>

            <Button marginTop="2" marginRight={8} onClick={onEditHandler}>
              Save
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
}
