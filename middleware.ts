import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"


const unAuthenticatedPaths = [
	"/login",
	"/register",
	"/signup",
]

const unAuthenticatedDyanmicPaths = [
	"/forgot-password",
]

export default auth(({ auth, nextUrl }) => {
	const pathName = nextUrl.pathname;

	if (auth?.user) {
		if (
			pathName === '/' || 
			unAuthenticatedPaths.includes(pathName) || 
			unAuthenticatedDyanmicPaths.some(path => pathName.startsWith(path))
		) {
			switch (Number(auth.user.role)) {
				case 0:
					return NextResponse.redirect(new URL("/student/appointment", nextUrl))
				case 1:
					return NextResponse.redirect(new URL("/clinic/appointment", nextUrl))
				case 2:
					return NextResponse.redirect(new URL("/admin/user-management", nextUrl))
			}
		}
	} else {
		if (
			!unAuthenticatedPaths.includes(pathName) && 
			!unAuthenticatedDyanmicPaths.some(path => pathName.startsWith(path))
		) {
			// Redirect to login page if user is not authenticated and trying to access a protected route
			return NextResponse.redirect(new URL("/login", nextUrl))
		}
	}
})

export const config = {
	runtime: 'nodejs',
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}