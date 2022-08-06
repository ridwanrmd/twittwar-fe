import Head from "next/head";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Flex, Box, VStack } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import axiosInstance from "../../services/axios";
import Post from "../../components/Post";
import PostBox from "../../components/PostBox";
import ProfileBox from "../../components/ProfileBox";
import InfiniteScroll from "react-infinite-scroller";

function userPost() {
  return <div>userPost</div>;
}

export default userPost;
