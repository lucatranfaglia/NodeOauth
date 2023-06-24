import jwt from 'jsonwebtoken'
import config from 'config'


/**
 * Sign JWT
 * @param object 
 * @param keyName 
 * @param options 
 * @returns 
 */
export function signJwt(
  object: Object, 
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivate',
  options?: jwt.SignOptions | undefined
){
  const signingKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  })
}

/**
 * Verify JWT
 * @param token 
 * @param keyName 
 * @returns 
 */
export function verifyJwt<T>(
  token: string, 
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null
{
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
}




export default signJwt