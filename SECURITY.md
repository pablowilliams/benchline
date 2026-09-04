# Security policy

Please report a suspected vulnerability privately through GitHub’s security advisory flow rather than a public issue.

## Supported version

The latest tagged release receives security fixes.

## Design controls

- Runtime validation on API inputs and bounded recommendation limits.
- No secrets, personal information or external API keys in the demo path.
- Debug evidence is limited to safe reason codes and synthetic identifiers.
- Release mutations are designed for role checks, idempotency and append-only audit records.
- CI uses read-only default permissions and runs dependency review.

The v1 promotion interface is an explicitly local demonstration and must not be deployed as a multi-user registry without durable storage, OIDC and service-side authorization.
