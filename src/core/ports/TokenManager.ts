export interface TokenPayload {
	id: string
	name: string
	role: 'A' | 'u'
}

export interface RefreshTokenData {
	idRFT: string
	token: string
	created: string
	expiry: string
}

export interface TokenManager {
	generateAccessToken(payload: TokenPayload): Promise<string>
	generateRefreshToken(payload: TokenPayload): Promise<RefreshTokenData>
	verifyAccessToken(token: string): Promise<TokenPayload | null>
	verifyRefreshToken(
		token: string
	): Promise<(TokenPayload & { idRFT: string }) | null>
}
