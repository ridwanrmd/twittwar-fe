import { Icon } from "@chakra-ui/icons";
import { Box, Button, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";

import { GiFist } from "react-icons/gi";
import { RiHome7Fill } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import SideBarRow from "./SideBarRow";

function SideBar() {
  const { data: session } = useSession();
  console.log({ session });

  return (
    <Box
      minW="250px"
      mt="10px"
      paddingStart="20px"
      paddingEnd="20px"
      position={"fixed"}
      overflow="hidden"
      left={2}
      top={2}
    >
      <Icon
        as={GiFist}
        fontSize="50px"
        marginStart="10px"
        marginBottom="20px"
        // color="var(--twittwar-color)"
      />

      <NextLink href="/home" passHref>
        <Link style={{ textDecoration: "none" }}>
          <SideBarRow Icon={RiHome7Fill} text="Home" />
        </Link>
      </NextLink>
      <NextLink href="/profile" passHref>
        <Link style={{ textDecoration: "none" }}>
          <SideBarRow Icon={HiOutlineUser} text="Profile" />
        </Link>
      </NextLink>
      <NextLink href="/post" passHref>
        <Link style={{ textDecoration: "none" }}>
          <SideBarRow Icon={FiMail} text="My Argument" />
        </Link>
      </NextLink>

      <Button
        colorScheme="red"
        height="50px"
        w="100%"
        mt="20px"
        borderRadius="30px"
        fontWeight="700"
      >
        WAR!
      </Button>
    </Box>
  );
}

export default SideBar;
