import { DefaultSession } from "next-auth";
import { Usuario } from "./prisma";

declare module "next-auth" {
  interface User extends Usuario {}

  interface Session {
    user: Usuario;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Usuario {}
}
