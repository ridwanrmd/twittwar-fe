import { Flex, Box, HStack, Image, Text, Button } from "@chakra-ui/react";
import { api_origin } from "../../constraint";
import { signOut } from "next-auth/react";

function UserProfile(props) {
  const onLogoutClick = async () => {
    await signOut();
  };

  return (
    <Flex minWidth={"20vw"} marginLeft={6}>
      <Box position={"fixed"} top={2}>
        <HStack mb={2}>
          <Image
            marginTop={2}
            rounded="full"
            alt={"User Avatar"}
            objectFit={"cover"}
            src={api_origin + props.user.image}
            width="40px"
            height="40px"
          />
          <Flex direction="column">
            <Text fontWeight={"medium"} fontStyle="italic">
              {`${props.user.username}`}
            </Text>
            {!props.user.isVerified && <Box color="red">Unverivied user</Box>}
          </Flex>
        </HStack>
        <Button onClick={onLogoutClick} variant="ghost" w="100%">
          Logout
        </Button>
      </Box>
    </Flex>
  );
}

export default UserProfile;
