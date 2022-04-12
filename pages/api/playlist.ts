import prisma from "../../lib/prisma";
import { validateRoute } from "../../lib/auth";

export default validateRoute(async (req, res, user) => {
  /* const playlists = await prisma.user.findUnique({
    where: {
      userId: user.id,
    },
    include // include the playlists, really cool.
  }); */
  const playlists = await prisma.playlist.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.json(playlists);
});
