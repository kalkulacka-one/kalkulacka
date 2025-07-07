Answer to a question of a calculator

The value of an answer is used solely for the purposes of the voting advice application, and therefore it intentionally doesn't differentiate between all possible real-world situations.

User answers are mapped as follows:

| Answer | Value |
|-|-|
| Yes | `true` |
| No | `false` |
| Skip | `undefined` |

Candidate answers are mapped slightly differently:

| Answer | Value |
|-|-|
| Yes | `true` |
| No | `false` |
| Neutral | `null` |

Vote mappings depend on the actual impact of each option on the outcome.

For example, in ordinary votes in the Parliament of the Czech Republic, abstaining has the same effect as voting against, while being absent reduces the quorum, so it has no direct effect on the result:

| Vote | Value |
|-|-|
| Yes | `true` |
| No | `false` |
| Abstain | `false` |
| Absent | `null` |
| Not member | `undefined` |

However, in certain cases, such as votes on constitutional laws, where a qualified majority is required, being absent has the same effect as voting against, so the mapping changes:

| Vote | Value |
|-|-|
| Yes | `true` |
| No | `false` |
| Abstain | `false` |
| Absent | `false` |
| Not member | `undefined` |

In the European Parliament, the result is based on votes cast, abstentions and absences are excluded from the count, so the mapping is as follows:

| Vote | Value |
|-|-|
| Yes | `true` |
| No | `false` |
| Abstain | `null` |
| Absent | `null` |
