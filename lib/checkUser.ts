import { currentUser } from "@clerk/nextjs/server";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    const loggedUser = await db.user.findUnique({
      where: {
        clerkUserid: user?.id,
      },
    });

    if (loggedUser) {
      return loggedUser;
    }

    const name = `${user?.firstName}+${user?.lastName}`;
    const newUser = await Prisma.user.create({
      data: {
        clerkUserid: user.id,
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
