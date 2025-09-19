import { prisma } from "@repo/database";

export async function getUserSessions(sessionId: string) {
  return await prisma.calculatorSession.findMany({
    where: {
      sessionId,
      deletedAt: null,
    },
  });
}
