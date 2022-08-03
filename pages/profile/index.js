import { useState } from "react";
import { getSession } from "next-auth/react";
import axiosInstance from "../../services/axios";
import { api_origin } from "../../constraint";
import Sidebar from "../../components/Sidebar";
import {
  Text,
  VStack,
  Box,
  Flex,
  HStack,
  Image,
  Button,
  Input,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import UserProfile from "../../components/UserProfile";

function Profile(props) {
  const [avatar, setAvatar] = useState({});
  const [user, setUser] = useState(props.user);
  const [imgSource, setImgSource] = useState(api_origin + props.user.image);
  const [editProfile, setEditProfile] = useState(false);
  const [isProcess, setIsProcess] = useState(false);
  const [isDisabled, setIsDisabled] = useState(props.user.isVerified);

  const {
    user_id,
    username,
    first_name,
    last_name,
    email,
    image,
    gender,
    phone,
    bio,
    age,
    isVerified,
  } = user;

  const resendVerification = async () => {
    setIsProcess(!isProcess);
    const body = {
      email,
      user_id,
    };
    await axiosInstance.post("/users/verify", body);
    alert("Success sending verification email");
    setIsProcess(false);
  };

  const onSaveAvatarUpdate = async () => {
    try {
      const session = await getSession();

      const { accessToken } = session.user;

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };
      await axiosInstance.patch(`/users/avatar`, user, config);

      const resGetUserProfile = await axiosInstance.get(
        `/users/profile`,
        config
      );

      setUser(resGetUserProfile.data.data.result);
      setEditProfile(false);
      window.location.reload();
    } catch (error) {
      console.log({ error });
      alert(error.response.data.message);
    }
  };

  const onFileChange = (event) => {
    setAvatar(event.target.files[0]);
    setImgSource(URL.createObjectURL(event.target.files[0]));
  };

  const onSaveButton = async () => {
    try {
      const session = await getSession();

      const { accessToken } = session.user;

      const body = new FormData();
      body.append("avatar", avatar);

      const config = {
        headers: { Authorization: `bearer ${accessToken}` },
      };

      const res = await axiosInstance.patch("/users/avatar", body, config);

      setUser(res.data.result);
      alert(res.data.message);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const onHandleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
          {!editProfile ? (
            <Box
              rounded={5}
              boxShadow="md"
              marginBottom={2}
              padding="2"
              marginInlineStart={"25%"}
            >
              <Image
                src={imgSource}
                width={200}
                height={200}
                objectFit={"cover"}
                rounded="full"
                marginBottom={2}
              />
              {first_name && (
                <Text
                  fontSize={"md"}
                  fontFamily="cursive"
                >{`${first_name} ${last_name}`}</Text>
              )}
              <Text fontSize={"md"}>{`${username}`}</Text>

              {bio && (
                <Text
                  marginBottom={5}
                  fontStyle="italic"
                  fontWeight={"light"}
                  fontSize="lg"
                >
                  {bio}
                </Text>
              )}
              <TableContainer>
                <Table variant="striped">
                  <Tbody>
                    <Tr>
                      <Td>Username</Td>
                      <Td>{username}</Td>
                    </Tr>
                    <Tr>
                      <Td>Fullname</Td>
                      <Td>{`${first_name} ${last_name}`}</Td>
                    </Tr>
                    <Tr>
                      <Td>Email</Td>
                      <Td>{email}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>

              <Button
                isDisabled={!isDisabled}
                marginTop={4}
                onClick={() => setEditProfile(true)}
                width="fit-content"
              >
                Edit Profile
              </Button>
            </Box>
          ) : (
            <Box
              rounded={5}
              boxShadow="md"
              marginBottom={2}
              padding="2"
              marginInlineStart={"25%"}
            >
              <Image
                src={imgSource}
                width={200}
                objectFit={"cover"}
                height={200}
                rounded="full"
                marginBottom={2}
              />
              <input type="file" onChange={onFileChange} />
              <Button onClick={onSaveButton}>Change Profile Picture</Button>
              <TableContainer marginBlock={5}>
                <Table variant="unstyled">
                  <Tbody>
                    <Tr>
                      <Td>Bio</Td>
                      <Td>
                        <Input
                          width="full"
                          name="bio"
                          type="text"
                          value={bio}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Username</Td>
                      <Td>
                        <Input
                          width="full"
                          name="username"
                          type="text"
                          value={username}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Firstname</Td>
                      <Td>
                        <Input
                          width="full"
                          name="firstName"
                          type="text"
                          value={first_name}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Lastname</Td>
                      <Td>
                        <Input
                          width="full"
                          name="lastName"
                          type="text"
                          value={last_name}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Email</Td>
                      <Td>
                        <Input
                          width="full"
                          name="email"
                          type="text"
                          disabled
                          value={email}
                          variant="filled"
                          onChange={onHandleChange}
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Button onClick={onSaveAvatarUpdate}>Save</Button>
            </Box>
          )}
        </Flex>
        <UserProfile user={user} />
      </Flex>
    </VStack>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession({ req: context.req });
    console.log({ session });

    if (!session) return { redirect: { destination: "/login" } };

    const { accessToken } = session.user;

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const res = await axiosInstance.get("/users/profile", config);

    return {
      props: { user: res.data.data.result, session },
    };
  } catch (error) {
    console.log({ error });
    const { message } = error;
    return { props: { message } };
  }
}

export default Profile;
