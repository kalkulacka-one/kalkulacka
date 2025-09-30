import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { loadCalculatorData } from "../../../../../../calculator/lib";
import type { calculateMatches } from "../../../../../../calculator/lib/result-calculation/calculate-matches";
import { candidateViewModel } from "../../../../../../calculator/view-models/server/candidate";
import { organizationViewModel } from "../../../../../../calculator/view-models/server/organization";
import { personViewModel } from "../../../../../../calculator/view-models/server/person";
import { HttpError, NotFoundError } from "../../../../../../lib/errors";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ "public-id": string; type: string }> }) {
  try {
    const { "public-id": publicId, type } = await params;

    const apiUrl = new URL(`/api/session/${publicId}`, _request.url);
    const sessionResponse = await fetch(apiUrl.toString());

    if (!sessionResponse.ok) {
      return new NotFoundError("Session not found").toResponse();
    }

    const sessionData = await sessionResponse.json();
    const resultData = sessionData.matches as ReturnType<typeof calculateMatches>;

    const calculatorData = await loadCalculatorData({
      key: sessionData.calculatorGroup || sessionData.calculatorKey,
      group: sessionData.calculatorGroup ? sessionData.calculatorKey : undefined,
    });

    const personsMap = new Map((calculatorData.persons || []).map((person) => [person.id, personViewModel(person)]));
    const organizationsMap = new Map((calculatorData.organizations || []).map((organization) => [organization.id, organizationViewModel(organization)]));

    const topMatches = resultData.slice(0, 5).map((match) => {
      const candidate = calculatorData.candidates.find((c) => c.id === match.id);
      const candidateVm = candidate ? candidateViewModel(candidate, personsMap, organizationsMap) : undefined;

      return {
        id: match.id,
        match: Math.round(match.match ?? 0),
        name: candidateVm?.displayName || "Unknown",
      };
    });

    const geistRegular = await fetch("https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOM4nQ.ttf").then((res) => res.arrayBuffer());
    const geistSemiBold = await fetch("https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQ4nQ.ttf").then((res) => res.arrayBuffer());
    const geistBold = await fetch("https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_Re-Q4nQ.ttf").then((res) => res.arrayBuffer());

    if (type === "instagram") {
      return new ImageResponse(
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f1f5f9",
            padding: "100px 80px",
            fontFamily: "Geist",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 72,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#e2e8f0",
                  color: "#475569",
                  fontSize: 32,
                  fontWeight: 400,
                  padding: "16px 32px",
                  borderRadius: 16,
                }}
              >
                Sněmovní volby 2025
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#e2e8f0",
                  color: "#475569",
                  fontSize: 32,
                  fontWeight: 400,
                  padding: "16px 32px",
                  borderRadius: 16,
                  whiteSpace: "nowrap",
                }}
              >
                {calculatorData.calculator.shortTitle}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 96,
                fontWeight: 700,
                color: "#1e293b",
                lineHeight: 1.1,
                marginBottom: 72,
              }}
            >
              Takhle mi vyšla Volební kalkulačka
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 32,
                marginBottom: 48,
              }}
            >
              {topMatches.map((match, index) => {
                const percentage = match.match;
                return (
                  <div
                    key={match.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "white",
                      borderRadius: "0 48px 48px 48px",
                      border: "2px solid #e5e7eb",
                      overflow: "hidden",
                      boxShadow: "8px 8px 0px #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        height: 8,
                        backgroundColor: "#e5e7eb",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: `${percentage}%`,
                          backgroundColor: index === 0 ? "#3b82f6" : "#94a3b8",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "32px 36px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 24,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: index === 0 ? 80 : 72,
                            height: index === 0 ? 80 : 72,
                            backgroundColor: "#e5e7eb",
                            borderRadius: 12,
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: index === 0 ? 36 : 32,
                            fontWeight: 600,
                            color: "#64748b",
                          }}
                        >
                          {index + 1}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            fontSize: index === 0 ? 56 : 50,
                            fontWeight: "600",
                            color: "#1e293b",
                          }}
                        >
                          {match.name}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          fontSize: index === 0 ? 60 : 54,
                          fontWeight: 600,
                          color: "#475569",
                        }}
                      >
                        {percentage} %
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 44,
                color: "#1e293b",
                fontWeight: "600",
              }}
            >
              Vyplň si ji taky na volebnikalkulacka.cz
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="42" viewBox="0 0 300 64" role="img" aria-label="Logo">
              <path fill="#0070f4" d="M65.9601 1.38557e-05L77.9054 11.964L37.9138 52.0168L25.9684 63.9807L0 37.9722L11.9454 26.0083L25.9684 40.053L65.9601 1.38557e-05Z" />
              <path fill="#334155" d="M126.768 0L74.8308 52.0167L86.7762 63.9807L138.713 11.964L126.768 0Z" />
              <path
                fill="#d04646"
                d="M207.144 0.000134698L219.089 11.9641L199.093 31.9906L219.089 52.0171L207.143 63.981L187.148 43.9544L167.152 63.9809L155.207 52.0169L175.202 31.9905L155.207 11.9639L167.152 1.38557e-05L187.148 20.0267L207.144 0.000134698Z"
              />
              <path
                fill="#0070f4"
                d="M255.196 9.56323C255.196 14.8449 250.921 19.1265 245.647 19.1265C240.374 19.1265 236.099 14.8449 236.099 9.56323C236.099 4.28161 240.374 1.38557e-05 245.647 1.38557e-05C250.921 1.38557e-05 255.196 4.28161 255.196 9.56323Z"
              />
              <path fill="#334155" d="M288.036 1.38557e-05L236.099 52.0167L248.044 63.9807L299.981 11.964L288.036 1.38557e-05Z" />
              <path
                fill="#d04646"
                d="M300 54.4368C300 59.7184 295.725 64 290.452 64C285.178 64 280.903 59.7184 280.903 54.4368C280.903 49.1552 285.178 44.8736 290.452 44.8736C295.725 44.8736 300 49.1552 300 54.4368Z"
              />
            </svg>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                color: "#1e293b",
                fontWeight: "600",
              }}
            >
              Volební kalkulačka
            </div>
          </div>
        </div>,
        {
          width: 1080,
          height: 1920,
          fonts: [
            {
              name: "Geist",
              data: geistRegular,
              weight: 400,
              style: "normal",
            },
            {
              name: "Geist",
              data: geistSemiBold,
              weight: 600,
              style: "normal",
            },
            {
              name: "Geist",
              data: geistBold,
              weight: 700,
              style: "normal",
            },
          ],
        },
      );
    }

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#f1f5f9",
          padding: "140px",
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "45%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 18,
                flexWrap: "wrap",
                marginBottom: 36,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#e2e8f0",
                  color: "#475569",
                  fontSize: 42,
                  fontWeight: 400,
                  padding: "18px 36px",
                  borderRadius: 18,
                }}
              >
                Sněmovní volby 2025
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#e2e8f0",
                  color: "#475569",
                  fontSize: 42,
                  fontWeight: 400,
                  padding: "18px 36px",
                  borderRadius: 18,
                  whiteSpace: "nowrap",
                }}
              >
                {calculatorData.calculator.shortTitle}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 92,
                fontWeight: 700,
                color: "#1e293b",
                lineHeight: 1.2,
                marginBottom: 84,
              }}
            >
              Takhle mi vyšla Volební kalkulačka
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "#334155",
                color: "white",
                fontSize: 64,
                fontWeight: "600",
                padding: "52px 72px",
                borderRadius: "36px 36px 0 36px",
                alignSelf: "flex-start",
              }}
            >
              Vyplnit kalkulačku
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="64" viewBox="0 0 300 64" role="img" aria-label="Logo">
              <path fill="#0070f4" d="M65.9601 1.38557e-05L77.9054 11.964L37.9138 52.0168L25.9684 63.9807L0 37.9722L11.9454 26.0083L25.9684 40.053L65.9601 1.38557e-05Z" />
              <path fill="#334155" d="M126.768 0L74.8308 52.0167L86.7762 63.9807L138.713 11.964L126.768 0Z" />
              <path
                fill="#d04646"
                d="M207.144 0.000134698L219.089 11.9641L199.093 31.9906L219.089 52.0171L207.143 63.981L187.148 43.9544L167.152 63.9809L155.207 52.0169L175.202 31.9905L155.207 11.9639L167.152 1.38557e-05L187.148 20.0267L207.144 0.000134698Z"
              />
              <path
                fill="#0070f4"
                d="M255.196 9.56323C255.196 14.8449 250.921 19.1265 245.647 19.1265C240.374 19.1265 236.099 14.8449 236.099 9.56323C236.099 4.28161 240.374 1.38557e-05 245.647 1.38557e-05C250.921 1.38557e-05 255.196 4.28161 255.196 9.56323Z"
              />
              <path fill="#334155" d="M288.036 1.38557e-05L236.099 52.0167L248.044 63.9807L299.981 11.964L288.036 1.38557e-05Z" />
              <path
                fill="#d04646"
                d="M300 54.4368C300 59.7184 295.725 64 290.452 64C285.178 64 280.903 59.7184 280.903 54.4368C280.903 49.1552 285.178 44.8736 290.452 44.8736C295.725 44.8736 300 49.1552 300 54.4368Z"
              />
            </svg>
            <div
              style={{
                display: "flex",
                fontSize: 54,
                color: "#1e293b",
                fontWeight: "600",
              }}
            >
              Volební kalkulačka
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "55%",
            gap: 44,
            paddingLeft: 80,
          }}
        >
          {topMatches.map((match, index) => {
            const percentage = match.match;
            return (
              <div
                key={match.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "white",
                  borderRadius: "0 32px 32px 32px",
                  border: "2px solid #e5e7eb",
                  overflow: "hidden",
                  boxShadow: "12px 12px 0px #e5e7eb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: 12,
                    backgroundColor: "#e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: `${percentage}%`,
                      backgroundColor: index === 0 ? "#3b82f6" : "#94a3b8",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "44px 52px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 32,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: index === 0 ? 108 : 96,
                        height: index === 0 ? 108 : 96,
                        backgroundColor: "#e5e7eb",
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: index === 0 ? 48 : 40,
                        fontWeight: 600,
                        color: "#64748b",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        fontSize: index === 0 ? 64 : 56,
                        fontWeight: "600",
                        color: "#1e293b",
                      }}
                    >
                      {match.name}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: index === 0 ? 72 : 64,
                      fontWeight: 600,
                      color: "#475569",
                    }}
                  >
                    {percentage} %
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>,
      {
        width: 2400,
        height: 1260,
        fonts: [
          {
            name: "Geist",
            data: geistRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Geist",
            data: geistSemiBold,
            weight: 600,
            style: "normal",
          },
          {
            name: "Geist",
            data: geistBold,
            weight: 700,
            style: "normal",
          },
        ],
      },
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return error.toResponse();
    }

    throw error;
  }
}
