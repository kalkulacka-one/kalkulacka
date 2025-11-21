import { type CalculatorSession, type Prisma, prisma } from "@kalkulacka-one/database";

export type CreateCalculatorSessionParams = Omit<Prisma.CalculatorSessionCreateInput, "createdAt" | "updatedAt" | "deletedAt" | "sessionId"> & {
  sessionId?: string;
};

export async function createCalculatorSession(params: CreateCalculatorSessionParams): Promise<CalculatorSession> {
  const session = await prisma.calculatorSession.create({
    data: {
      ...params,
      calculatorGroup: params.calculatorGroup ?? null,
      calculatorVersion: params.calculatorVersion ?? null,
      embedName: params.embedName ?? null,
    },
  });

  return session;
}
