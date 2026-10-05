'use server'

import { createConnection } from "@/lib/db"
import { RowDataPacket } from "mysql2"
import { hashPassword } from "@/lib/utils"

export async function registerUser(formData: FormData) {
	const email = (formData.get("email") as string)?.trim()?.toLowerCase()
	const password = formData.get("password") as string
	const confirmPassword = formData.get("confirmPassword") as string

	if (!email || !password || !confirmPassword) {
		return { error: "All fields are required." }
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(email)) {
		return { error: "Please provide a valid email address." }
	}

	if (password.length < 8) {
		return { error: "Password must be at least 8 characters long." }
	}

	if (!/[A-Z]/.test(password)) {
		return { error: "Password must contain at least one uppercase letter." }
	}

	if (!/[a-z]/.test(password)) {
		return { error: "Password must contain at least one lowercase letter." }
	}

	if (!/[0-9]/.test(password)) {
		return { error: "Password must contain at least one number." }
	}

	if (!/[^A-Za-z0-9]/.test(password)) {
		return { error: "Password must contain at least one special character." }
	}

	if (password !== confirmPassword) {
		return { error: "Passwords do not match." }
	}

	try {
		const connection = await createConnection()

		const [existingUsers] = await connection.query<RowDataPacket[]>(
			"SELECT id FROM Users WHERE email = ?",
			[email]
		)

		if (existingUsers.length > 0) {
			await connection.end()
			return { error: "An account with this email already exists." }
		}

		await connection.query(
			"INSERT INTO Users (email, password, role, isLocked) VALUES (?, ?, 0, FALSE)",
			[email, hashPassword(password)]
		)

		await connection.end()

		return { success: true }
	} catch (error) {
		console.error("Registration error:", error)
		return { error: "Failed to create account. Please try again." }
	}
}
