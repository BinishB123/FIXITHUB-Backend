import jwt from 'jsonwebtoken'

export interface Ijwtservices{
    generateToken(payload:Object,options:jwt.SignOptions):string
    generateRefreshToken(payload:Object,options:jwt.SignOptions):string
    verifyjwt(refreshToken: string): { success: boolean, newAccessToken?: string, error?: string }
}