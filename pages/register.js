import {
  Box,
  FormControl,
  FormLabel,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Link,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import axiosInstance from "../services/axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

function Register() {
  const [sawPassword, setSawPassword] = useState(false);
  const [sawRePassword, setSawRePassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isRegisterProcess, setisRegisterProcess] = useState(false);

  const router = useRouter();

  //redirect to home if already login
  const { data: session } = useSession();
  if (session) router.replace("/home");

  const onRegisterClick = async () => {
    try {
      setisRegisterProcess(true);
      const body = {
        username,
        email,
        password,
        rePassword,
      };
      await axiosInstance.post("/users/register", body);
    } catch (error) {
      if (error.response.data) return alert(error.response.data.message);
      alert(error.message);
    } finally {
      // akan dijalankan di akhir, terlepas proses di try berhasil ataupun gagal lalu masuk ke catch
      setisRegisterProcess(false);
    }
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={"red.50"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"3xl"} textAlign={"center"}>
            Sign Up
          </Heading>
        </Stack>
        <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8} width={"25vw"}>
          <Stack spacing={1}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                value={username}
                placeholder="username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                placeholder="your@mail.com"
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={sawPassword ? "text" : "password"}
                  value={password}
                  placeholder="**********"
                  onChange={(event) => setPassword(event.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setSawPassword((sawPassword) => !sawPassword)
                    }
                  >
                    {sawPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Re-type password</FormLabel>
              <InputGroup>
                <Input
                  type={sawRePassword ? "text" : "password"}
                  value={rePassword}
                  placeholder="**********"
                  onChange={(event) => setRePassword(event.target.value)}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setSawRePassword((sawRePassword) => !sawRePassword)
                    }
                  >
                    {sawRePassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack pt={1}>
              <Text align={"center"}>
                Already join?{" "}
                <NextLink href="/login">
                  <Link color={"red.400"}>Sign In</Link>
                </NextLink>
              </Text>
            </Stack>
            <Stack spacing={10} pt={1}>
              <Button
                isLoading={isRegisterProcess}
                loadingText="Submitting"
                size="lg"
                bg={"red.600"}
                color={"white"}
                _hover={{ bg: "red.700" }}
                onClick={onRegisterClick}
              >
                Join Twittwar
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Register;
