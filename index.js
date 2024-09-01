import "dotenv/config";
import { getContacts } from "./dex.js";
import {
	formatPhoneNumber,
	getMessagesByIdentifier,
	convertTZ,
} from "./messages.js";
import { addNote } from "./dex.js";

const contacts = await getContacts();

let notesAdded = 0;
for (const contact of contacts) {
	const lastSeenDate = convertTZ(
		new Date(contact.last_seen_at ? contact.last_seen_at : 0)
	);
	const lastSeenDay = lastSeenDate.toISOString().split("T")[0];
	const newDays = [];
	const newDates = [];
	for (const phone of contact.phones) {
		const phoneNumber = formatPhoneNumber(phone.phone_number);
		const messages = await getMessagesByIdentifier(phoneNumber);
		for (const message of messages) {
			const messageDate = convertTZ(new Date(message.message_date));
			if (messageDate > lastSeenDate) {
				const messageDay = messageDate.toISOString().split("T")[0];
				if (
					messageDay != lastSeenDay &&
					!newDays.includes(messageDay)
				) {
					newDays.push(messageDay);
					newDates.push(messageDate);
				}
			}
		}
	}

	if (newDates.length > 0) {
		for (const date of newDates) {
			const isoString = date.toISOString();
			await addNote(contact.id, "Text Message 📱", isoString);
			console.log(
				"Added note for",
				contact.first_name,
				contact.last_name,
				"on",
				isoString
			);
			notesAdded++;
		}
	}
}

if (notesAdded == 0) {
	console.log("No new messages to add");
}
