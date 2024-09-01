import fs from "fs";
import sqlite3 from "sqlite3";

export async function getMessagesByIdentifier(identifier) {
	const db = await new Promise((resolve, reject) => {
		const database = new sqlite3.Database(
			process.env.MESSAGES_DB,
			sqlite3.OPEN_READONLY,
			(err) => {
				if (err) {
					console.error(err);
					reject(err);
				} else {
					// console.log("Connected to the database.");
					resolve(database);
				}
			}
		);
	});

	const query = fs.readFileSync("./messagesByIdentifier.sql").toString();
	const messages = await new Promise((resolve, reject) => {
		const messages = [];
		db.serialize(() => {
			db.each(
				query,
				[identifier],
				(err, row) => {
					if (err) {
						console.error(err.message);
						reject(err);
					} else {
						messages.push(row);
					}
				},
				(err, rowCount) => {
					if (err) {
						reject(err);
					} else {
						resolve(messages);
					}
				}
			);
		});
	});

	await new Promise((resolve, reject) => {
		db.close((err) => {
			if (err) {
				console.error(err.message);
				reject(err);
			} else {
				// console.log("Close the database connection.");
				resolve();
			}
		});
	});

	return messages;
}

export function formatPhoneNumber(phoneNumber) {
	// Remove all non-digit characters
	const digitsOnly = phoneNumber.replace(/\D/g, "");

	// Check if the number starts with a country code
	if (digitsOnly.length > 10) {
		return `+${digitsOnly}`;
	} else {
		// Assume US number if no country code
		return `+1${digitsOnly}`;
	}
}

export function convertTZ(date) {
	const intlDateObj = new Intl.DateTimeFormat("en-US", {
		timeZone: process.env.TIMEZONE,
	});
	return new Date(intlDateObj.format(date));
}
