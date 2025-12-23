import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    const loggedUser = await prisma.user.findUnique({
      where: {
        clerkUserId: user?.id,
      },
    });

    if (loggedUser) {
      return loggedUser;
    }
    console.log(user, "user");
    const name = `${user?.firstName}+${user?.lastName}`;
    const newUser = await prisma.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user?.imageUrl,
        email: user?.emailAddresses[0]?.emailAddress,
      },
    });
    return newUser;
  } catch (error) {
    console.log(error);
  }
};
