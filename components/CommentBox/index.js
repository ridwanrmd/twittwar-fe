import { Textarea, Button, Flex, Text } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/axios";

export default function CommentBox(props) {
  const [content, setContent] = useState("");
  const [contentLength, setContentLength] = useState(0);
  const [textColor, setTextColor] = useState("black");
  const [isInvalid, setIsInvalid] = useState(false);

  const onChangeHandler = (event) => {
    setContent(event.target.value);
  };
  useEffect(() => {
    setContentLength(content.length);
  }, [content]);

  useEffect(() => {
    if (contentLength >= 200) {
      setIsInvalid(true);
      setTextColor("red");
    } else {
      setIsInvalid(false);
      setTextColor("black");
    }
  }, [contentLength]);

  const onComment = async () => {
    const session = await getSession();
    const { accessToken } = session.user;
    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };
    const body = {
      content,
      post_id: props.post_id,
    };
    try {
      await axiosInstance.post("/comments/", body, config);
      props.getComments();
      setContent("");
    } catch (error) {}
  };
  return (
    <>
      <Textarea
        maxLength={300}
        value={content}
        isInvalid={isInvalid}
        placeholder="Add comment"
        resize="none"
        size={"sm"}
        onChange={onChangeHandler}
      />
      <Flex justifyContent="space-between" mt="2">
        <Text
          fontSize={"small"}
          fontStyle="normal"
          fontWeight={"semibold"}
          color={textColor}
          mt="2.5"
        >
          Max Characters {contentLength}/200
        </Text>
        <Button variant="solid" onClick={onComment} colorScheme="red" ml="4">
          Comment
        </Button>
      </Flex>
    </>
  );
}
