import crypto from "crypto"

export default async function randomString() {
    return crypto.randomBytes(64).toString('hex');
}
