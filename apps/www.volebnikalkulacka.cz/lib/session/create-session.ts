import { type CalculatorSession, type Prisma, prisma } from "@repo/database";

export type CreateCalculatorSessionParams = Omit<Prisma.CalculatorSessionCreateInput, "createdAt" | "updatedAt" | "deletedAt" | "sessionId"> & {
  sessionId?: string;
};

export async function createCalculatorSession(params: CreateCalculatorSessionParams): Promise<CalculatorSession> {
  const session = await prisma.calculatorSession.create({
    data: {
      ...params,
      ...(params.sessionId && { sessionId: params.sessionId }),
      calculatorGroup: params.calculatorGroup ?? null,
      embedName: params.embedName ?? null,
    },
  });

  return session;
}
