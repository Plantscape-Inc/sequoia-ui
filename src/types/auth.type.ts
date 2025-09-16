export interface GoogleAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: "Bearer";
  id_token: string;
  expires_at: number;
  userinfo: GoogleUserInfo;
}

// export interface GoogleUserInfo {
//     iss: string;
//     azp: string;
//     aud: string;
//     sub: string;
//     hd?: string;
//     email?: string;
//     email_verified: boolean;
//     at_hash?: string;
//     nonce?: string;
//     name?: string;
//     picture?: string;
//     given_name?: string;
//     family_name?: string;
//     iat: number;
//     exp: number;
// }

export interface GoogleUserInfo {
  email: string;
  name: string;
}
