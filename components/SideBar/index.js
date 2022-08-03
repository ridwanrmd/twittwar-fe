import { Icon } from "@chakra-ui/icons";
import { Box, Button, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";

import { GiFist } from "react-icons/gi";
import { RiHome7Fill } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";
import { AiOutlineHeart } from "react-icons/ai";
import { ImExit } from "react-icons/im";
import { FiMail } from "react-icons/fi";
import SideBarRow from "./SideBarRow";

function SideBar() {
  const { data: session } = useSession();
  console.log({ session });

  const onLogoutClick = async () => {
    await signOut();
  };

  return (
    <Box
      minW="250px"
      mt="10px"
      paddingStart="20px"
      paddingEnd="20px"
      position={"fixed"}
      overflow="hidden"
      left={6}
      top={2}
    >
      <Icon
        as={GiFist}
        fontSize="30px"
        marginStart="10px"
        marginBottom="20px"
        color="var(--twittwar-color)"
      />

      <NextLink href="/home" passHref>
        <Link style={{ textDecoration: "none" }}>
          <SideBarRow Icon={RiHome7Fill} text="Home" />
        </Link>
      </NextLink>
      <NextLink>
        <Link style={{ textDecoration: "none" }}>
          <SideBarRow Icon={HiOutlineUser} text="Profile" />
        </Link>
      </NextLink>
      <NextLink>
        <Link style={{ textDecoration: "none" }}>
          <SideBarRow Icon={FiMail} text="My Argument" />
        </Link>
      </NextLink>
      <Box onClick={onLogoutClick}>
        <SideBarRow Icon={ImExit} text="Go home to yo mama!" />
      </Box>

      <Button
        colorScheme="twittwar"
        height="50px"
        w="100%"
        mt="20px"
        borderRadius="30px"
        fontWeight="700"
      >
        Cuiter
      </Button>
    </Box>
  );
}

export default SideBar;
