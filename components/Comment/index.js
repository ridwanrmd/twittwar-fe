import { Flex, Text, Image, Box } from "@chakra-ui/react";
import moment from "moment";
import { api_origin } from "../../constraint";

function Comment(props) {
  const { comment } = props;

  return (
    <Flex
      direction={"column"}
      mt="5px"
      _hover={{
        background: "#e8f5fe",
        borderRadius: "10px",
      }}
      transitionDuration="500ms"
    >
      <Box padding="3">
        <Flex direction={"row"}>
          <Image
            src={api_origin + comment.User.image}
            height="30px"
            width="30px"
            rounded={"full"}
            marginBottom={2}
          />
          <Text marginStart={2}>{comment.User.username}</Text>
          <Text marginStart={3}>{moment(comment.createdAt).fromNow()}</Text>
        </Flex>
        <Text>{comment.content}</Text>
      </Box>
    </Flex>
  );
}

export default Comment;
