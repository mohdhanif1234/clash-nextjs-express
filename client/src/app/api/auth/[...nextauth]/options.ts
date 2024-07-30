import { LOGIN_URL } from "@/lib/apiEndPoints"
import axios from "axios"
import { AuthOptions, ISODateString } from "next-auth"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"

export type CustomSession = {
    user?: CustomUser
    expires: ISODateString
}

export type CustomUser = {
    id?: string | null
    name?: string | null
    email?: string | null
    token?: string | null
}

export const authOptions: AuthOptions = {
    pages: {
        signIn: "/login"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials, req) {
                const { data } = await axios.post(LOGIN_URL, credentials)
                const user = data?.data
                if (user) {
                    return user
                } else {

                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: CustomUser }) {
            if (user) {
                token.user = user
            }
            return token
        },
        async session({ session, user, token }: { session: CustomSession, user: CustomUser, token: JWT }) {
            session.user = token.user as CustomUser
            return session
        }
    }
}