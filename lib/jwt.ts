import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

interface SignOption {
  expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "1h",
};

export function getTokens(payload: JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION) {

  const secretKey = process.env.ACCESS_TOKEN_SECRET;
  const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;

  const accessToken = jwt.sign(payload, secretKey!, { expiresIn: '30m' });
  const refreshToken = jwt.sign(payload, refreshSecretKey!, { expiresIn: '1d' });

  return {
    accessToken,
    refreshToken
  };
}

export function verifyJwt(_request: NextRequest) {
  try {
    const authorization = _request.headers.get('authorization')
    if(!authorization) return null
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const decoded = jwt.verify(authorization!.replace('Bearer ',''), secretKey!);
    return decoded as JwtPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}