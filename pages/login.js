import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Image,
  Text,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import NextLink from "next/link";

function Login() {
  const [emailUsername, setEmailUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoginProcess, setisLoginProcess] = useState(false);
  const [sawPassword, setSawPassword] = useState(false);

  const { data: session } = useSession();
  if (session) router.replace("/home");

  const onLoginClick = async () => {
    console.log(emailUsername);
    setisLoginProcess(true);
    const res = await signIn("credentials", {
      redirect: false,
      emailUsername,
      password,
    });

    //checking empty
    if (emailUsername == "") {
      setisLoginProcess(false);
      return alert("Username or email field is empty");
    }
    if (password == "") {
      setisLoginProcess(false);
      return alert("Password field is empty");
    }

    if (!res.error) {
      router.replace("/home");
    } else {
      alert(res.error);
    }
    setisLoginProcess(false);
  };

  return (
    <Stack
      minH={"100vh"}
      direction={{ base: "column", md: "row" }}
      bg={"red.50"}
    >
      <Flex flex={1}>
        <Image
          margin={8}
          rounded="500"
          alt={"Twittwar image"}
          objectFit={"cover"}
          src={
            "https://img.freepik.com/premium-vector/vintage-human-fist-punch_153969-16.jpg?w=740"
          }
        />
      </Flex>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
        <Stack spacing={4} w={"full"} maxW={"md"}>
          <Heading fontSize={"2xl"}>Sign in</Heading>
          <FormControl id="emailPassword" isRequired>
            <FormLabel>Username or Email</FormLabel>
            <Input
              type="text"
              value={emailUsername}
              onChange={(event) => setEmailUsername(event.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
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
                  onClick={() => setSawPassword((sawPassword) => !sawPassword)}
                >
                  {sawPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={6}>
            <Text>
              Not joined yet?{" "}
              <NextLink href="/register">
                <Link color={"red.400"}>Sign Up</Link>
              </NextLink>
            </Text>
            <Button
              isLoading={isLoginProcess}
              loadingText={"Submit"}
              colorScheme={"red"}
              variant={"solid"}
              onClick={onLoginClick}
            >
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}

export default Login;
