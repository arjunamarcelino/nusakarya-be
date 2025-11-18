import { PrivyClient } from '@privy-io/server-auth'

const PRIVY_APP_ID = process.env.PRIVY_APP_ID
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET

if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
  throw new Error('PRIVY_APP_ID and PRIVY_APP_SECRET must be set in environment variables')
}

const privyClient = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET)

export default privyClient

